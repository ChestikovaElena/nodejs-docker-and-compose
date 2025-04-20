import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateOfferDto) {
    return await this.offersService.create(req.user, dto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.offersService.findOne(id);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }
}
