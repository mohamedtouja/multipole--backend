import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BlogModule } from './modules/blog/blog.module';
import { CarouselModule } from './modules/carousel/carousel.module';
import { RealisationsModule } from './modules/realisations/realisations.module';
import { SolutionsModule } from './modules/solutions/solutions.module';
import { TeamModule } from './modules/team/team.module';
import { FormsModule } from './modules/forms/forms.module';
import { Models3DModule } from './modules/models-3d/models-3d.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', 'multipoles'),
        autoLoadEntities: true, // Automatically load entities from modules
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    
    // Common module
    CommonModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    BlogModule,
    CarouselModule,
    RealisationsModule,
    SolutionsModule,
    TeamModule,
    FormsModule,
    Models3DModule,
  ],
})
export class AppModule {}
