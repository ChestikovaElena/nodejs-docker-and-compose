import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: RequestWithUser, @Body() dto: CreateWishDto) {
    return this.wishesService.create(req.user, dto);
  }

  @Get('/top')
  getTopWishes() {
    return this.wishesService.getTopWishes(10);
  }

  @Get('/last')
  getLastWishes() {
    return this.wishesService.getLastWishes(40);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.wishesService.findAll(page, limit);
  }

  @Post('/:id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.wishesService.copy(req.user, id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(req.user, id, dto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  removeOne(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.wishesService.removeOne(req.user, id);
  }
}
