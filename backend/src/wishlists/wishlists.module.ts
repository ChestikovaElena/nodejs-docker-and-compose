import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), UsersModule, WishesModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
