import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import type { Request } from 'express';
import { FormsService } from './forms.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { DevisFormDto } from './dto/devis-form.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/v1/forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('contact')
  async submitContact(@Body() dto: ContactFormDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.formsService.submitContactForm(dto, ipAddress, userAgent);
  }

  @Post('devis')
  async submitDevis(@Body() dto: DevisFormDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.formsService.submitDevisForm(dto, ipAddress, userAgent);
  }
}

@Controller('api/v1/admin/forms')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class FormsAdminController {
  constructor(private readonly formsService: FormsService) {}

  @Get('contact')
  getContactForms(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.formsService.getContactForms(page, limit);
  }

  @Get('devis')
  getDevisForms(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.formsService.getDevisForms(page, limit);
  }

  @Patch('contact/:id/status')
  updateContactStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.formsService.updateContactFormStatus(id, status);
  }

  @Patch('devis/:id/status')
  updateDevisStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.formsService.updateDevisFormStatus(id, status);
  }
}
