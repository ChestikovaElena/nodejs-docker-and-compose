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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.create(req.user, dto);
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.wishlistService.findById(id);
  }

  @Get()
  findMany() {
    return this.wishlistService.findAll();
  }

  @Patch('/:id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlistService.updateOne(req.user, id, dto);
  }

  @Delete('/:id')
  removeOne(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.wishlistService.removeOne(req.user, id);
  }
}
