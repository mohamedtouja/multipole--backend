import { Module } from '@nestjs/common';
import { HashService } from './services/hash.service';
import { TranslationService } from './services/translation.service';
import { S3Service } from './services/s3.service';
import { EmailService } from './services/email.service';

@Module({
  providers: [HashService, TranslationService, S3Service, EmailService],
  exports: [HashService, TranslationService, S3Service, EmailService],
})
export class CommonModule {}
