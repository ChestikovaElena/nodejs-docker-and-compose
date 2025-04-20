import { OmitType } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsNumber } from 'class-validator';
import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
  'item',
]) {
  @Column()
  @IsNumber()
  itemId: number;
}
