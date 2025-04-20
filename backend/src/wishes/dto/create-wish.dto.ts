import { OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wishes.entity';

export class CreateWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'raised',
]) {}
