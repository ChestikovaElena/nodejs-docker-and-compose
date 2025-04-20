import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length, IsNumber, IsPositive } from 'class-validator';
import { BaseEntity } from '../../common';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
