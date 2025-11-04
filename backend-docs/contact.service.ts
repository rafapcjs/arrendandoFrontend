import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ContactData {
  name: string;
  email: string;
  message: string;
}

@Injectable()
export class ContactService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(contactData: ContactData): Promise<void> {
    const { name, email, message } = contactData;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // Email donde recibirás los mensajes
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo Mensaje de Contacto - Arrendando S.A.S
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje</h3>
            <p style="line-height: 1.6; color: #555;">${message}</p>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Este mensaje fue enviado desde el formulario de contacto de Arrendando S.A.S
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
              Fecha: ${new Date().toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}