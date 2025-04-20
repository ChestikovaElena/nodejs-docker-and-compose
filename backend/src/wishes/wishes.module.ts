import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
