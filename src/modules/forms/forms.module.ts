import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactFormEntity } from './entities/contact-form.entity';
import { DevisFormEntity } from './entities/devis-form.entity';
import { FormsService } from './forms.service';
import { FormsController, FormsAdminController } from './forms.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactFormEntity, DevisFormEntity]),
    CommonModule,
  ],
  controllers: [FormsController, FormsAdminController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
