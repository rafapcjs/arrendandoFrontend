import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

export class ContactDto {
  name: string;
  email: string;
  message: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send-email')
  async sendContactEmail(@Body() contactDto: ContactDto) {
    try {
      await this.contactService.sendEmail(contactDto);
      return {
        success: true,
        message: 'Email enviado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al enviar el email'
      };
    }
  }
}