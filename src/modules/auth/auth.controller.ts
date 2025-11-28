import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Headers('accept-language') locale?: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.socket.remoteAddress;
    return this.authService.login(dto, userAgent, ipAddress, locale);
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Headers('accept-language') locale?: string,
  ) {
    return this.authService.refresh(dto.refreshToken, locale);
  }

  @Post('logout')
  async logout(
    @Body() dto: RefreshTokenDto,
    @Headers('accept-language') locale?: string,
  ) {
    return this.authService.logout(dto.refreshToken, locale);
  }

  @Get('me')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getMe(@CurrentUser() user: { id: string }) {
    return this.authService.getMe(user.id);
  }
}
