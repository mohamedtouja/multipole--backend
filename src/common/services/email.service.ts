import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendContactFormEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    message: string;
  }) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const from = this.configService.get<string>('SMTP_FROM');
    const fullName = `${data.firstName} ${data.lastName}`;

    await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `Nouveau message de contact - ${fullName}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        <p><strong>Entreprise:</strong> ${data.company || 'Non fourni'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Confirmation to user
    await this.transporter.sendMail({
      from,
      to: data.email,
      subject: 'Confirmation - Votre message a été reçu',
      html: `
        <h2>Merci pour votre message</h2>
        <p>Bonjour ${data.firstName},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br/>L'équipe Multipoles</p>
      `,
    });
  }

  async sendDevisFormEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    projectType: string;
    description: string;
    budget?: string;
    quantity?: number;
    dimensions?: { width?: number; height?: number; depth?: number };
    desiredDeliveryDate?: string;
  }) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const from = this.configService.get<string>('SMTP_FROM');
    const fullName = `${data.firstName} ${data.lastName}`;

    await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `Nouvelle demande de devis - ${fullName} - ${data.company}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        
        <h3>Informations du projet</h3>
        <p><strong>Type de projet:</strong> ${data.projectType}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Budget:</strong> ${data.budget || 'Non spécifié'}</p>
        <p><strong>Quantité:</strong> ${data.quantity || 'Non spécifié'}</p>
        ${data.dimensions ? `<p><strong>Dimensions:</strong> L: ${data.dimensions.width || 'N/A'} x H: ${data.dimensions.height || 'N/A'} x P: ${data.dimensions.depth || 'N/A'}</p>` : ''}
        <p><strong>Date de livraison souhaitée:</strong> ${data.desiredDeliveryDate || 'Non spécifié'}</p>
        
        <h3>Informations de contact</h3>
        <p><strong>Nom:</strong> ${fullName}</p>
        <p><strong>Entreprise:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
      `,
    });

    // Confirmation to user
    await this.transporter.sendMail({
      from,
      to: data.email,
      subject: 'Confirmation - Votre demande de devis a été reçue',
      html: `
        <h2>Merci pour votre demande de devis</h2>
        <p>Bonjour ${data.firstName},</p>
        <p>Nous avons bien reçu votre demande de devis et nous vous contacterons très prochainement pour discuter de votre projet.</p>
        <p>Cordialement,<br/>L'équipe Multipoles</p>
      `,
    });
  }
}
