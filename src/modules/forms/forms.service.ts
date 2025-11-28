import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactFormEntity } from './entities/contact-form.entity';
import { DevisFormEntity } from './entities/devis-form.entity';
import { ContactFormDto } from './dto/contact-form.dto';
import { DevisFormDto } from './dto/devis-form.dto';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(ContactFormEntity)
    private readonly contactFormRepository: Repository<ContactFormEntity>,
    @InjectRepository(DevisFormEntity)
    private readonly devisFormRepository: Repository<DevisFormEntity>,
    private readonly emailService: EmailService,
  ) {}

  async submitContactForm(
    dto: ContactFormDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const contactForm = this.contactFormRepository.create({
      ...dto,
      ipAddress,
      userAgent,
    });

    await this.contactFormRepository.save(contactForm);

    // Send email notification
    await this.emailService.sendContactFormEmail(dto);

    return {
      success: true,
      message:
        'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
    };
  }

  async submitDevisForm(
    dto: DevisFormDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Convert desiredDeliveryDate string to Date if provided
    const devisData = {
      ...dto,
      desiredDeliveryDate: dto.desiredDeliveryDate
        ? new Date(dto.desiredDeliveryDate)
        : undefined,
    };

    const devisForm = this.devisFormRepository.create({
      ...devisData,
      ipAddress,
      userAgent,
    });

    await this.devisFormRepository.save(devisForm);

    // Send email notification
    await this.emailService.sendDevisFormEmail(dto);

    return {
      success: true,
      message:
        'Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous peu.',
    };
  }

  async getContactForms(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.contactFormRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDevisForms(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.devisFormRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateContactFormStatus(id: string, status: string) {
    await this.contactFormRepository.update(id, { status });
    return { message: 'Status updated successfully' };
  }

  async updateDevisFormStatus(id: string, status: string) {
    await this.devisFormRepository.update(id, { status });
    return { message: 'Status updated successfully' };
  }
}
