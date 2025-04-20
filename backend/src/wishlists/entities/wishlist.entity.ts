import { IsUrl, Length, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wishes.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
