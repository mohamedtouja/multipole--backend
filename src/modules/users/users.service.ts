import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { HashService } from '../../common/services/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

interface CreateUserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(payload: CreateUserPayload) {
    const user = this.usersRepository.create({
      ...payload,
      role: payload.role ?? Role.SUPER_ADMIN,
    });
    return this.usersRepository.save(user);
  }

  async updateLastLogin(id: string, date: Date) {
    await this.usersRepository.update(id, { lastLoginAt: date });
  }

  async findAll(query: QueryUserDto) {
    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      return this.usersRepository
        .createQueryBuilder('user')
        .where(query.role ? 'user.role = :role' : '1=1', query.role ? { role: query.role } : {})
        .andWhere(
          '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
          { search: `%${query.search}%` },
        )
        .select([
          'user.id',
          'user.email',
          'user.firstName',
          'user.lastName',
          'user.role',
          'user.lastLoginAt',
          'user.createdAt',
          'user.updatedAt',
        ])
        .orderBy('user.createdAt', 'DESC')
        .getMany();
    }

    return this.usersRepository.find({
      where,
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const user = this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? Role.SUPER_ADMIN,
    });

    const savedUser = await this.usersRepository.save(user);

    // Return user without password
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updateData: any = { ...dto };

    if (dto.password) {
      updateData.password = await this.hashService.hash(dto.password);
    }

    await this.usersRepository.update(id, updateData);

    return this.findOne(id);
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}
