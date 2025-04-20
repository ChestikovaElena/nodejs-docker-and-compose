import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
  'items',
]) {
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
