import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HashService } from '../../common/services/hash.service';
import { TranslationService } from '../../common/services/translation.service';
import { UsersService } from '../users/users.service';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import {
  JwtAccessPayload,
  JwtRefreshPayload,
} from './interfaces/jwt-payload.interface';
import { durationToSeconds } from '../../common/utils/duration.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly translationService: TranslationService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
    locale?: string,
  ) {
    const user = await this.usersService.findByEmail(dto.email);

    if (
      !user ||
      !(await this.hashService.compare(dto.password, user.password))
    ) {
      throw new UnauthorizedException(
        this.translationService.translate(locale, 'auth', 'invalidCredentials'),
      );
    }

    await this.usersService.updateLastLogin(user.id, new Date());

    const accessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );
    const { token: refreshToken, tokenId } = await this.generateRefreshToken(
      user.id,
      userAgent,
      ipAddress,
    );

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refresh(refreshToken: string, locale?: string) {
    let payload: JwtRefreshPayload;

    try {
      payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        this.translationService.translate(
          locale,
          'auth',
          'refreshTokenInvalid',
        ),
      );
    }

    const tokenHash = await this.hashService.hash(refreshToken);
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { tokenId: payload.tokenId, tokenHash },
      relations: ['user'],
    });

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expiresAt < new Date() ||
      tokenRecord.user.id !== payload.sub
    ) {
      throw new UnauthorizedException(
        this.translationService.translate(
          locale,
          'auth',
          'refreshTokenInvalid',
        ),
      );
    }

    const user = tokenRecord.user;
    const accessToken = this.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string, locale?: string) {
    try {
      const payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      await this.refreshTokenRepository.update(
        { tokenId: payload.tokenId },
        { revoked: true, revokedAt: new Date() },
      );
    } catch {
      // Silently ignore invalid tokens on logout
    }

    return {
      message: this.translationService.translate(locale, 'auth', 'loggedOut'),
    };
  }

  async cleanupExpiredTokens() {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  private generateAccessToken(
    userId: string,
    email: string,
    role: string,
  ): string {
    const payload: JwtAccessPayload = {
      sub: userId,
      email,
      role: role as any,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
    } as any);
  }

  private async generateRefreshToken(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ token: string; tokenId: string }> {
    const tokenId = uuidv4();
    const payload: JwtRefreshPayload = {
      sub: userId,
      tokenId,
      type: 'refresh',
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    } as any);

    const tokenHash = await this.hashService.hash(token);
    const expiresInSeconds = durationToSeconds(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      '7d',
    );

    const refreshTokenEntity = this.refreshTokenRepository.create({
      tokenHash,
      tokenId,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
      userAgent,
      ipAddress,
      user: { id: userId } as any,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { token, tokenId };
  }

  async getMe(userId: string) {
    return this.usersService.findById(userId);
  }
}
