import { Column, Entity, ManyToOne } from 'typeorm';
import { IsNumber, IsPositive } from 'class-validator';
import { BaseEntity } from '../../common';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wishes.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
