import { Repository } from 'typeorm';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(authorizedUser: User, dto: CreateWishlistDto) {
    const { itemsId } = dto;
    const wishes = await this.wishesService.findMany(itemsId);

    return await this.wishlistRepository.save({
      ...dto,
      owner: authorizedUser,
      items: wishes,
    });
  }

  async findById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      relations: {
        items: {
          owner: true,
        },
        owner: true,
      },
      where: { id },
    });
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    return wishlist;
  }

  async findAll() {
    return await this.wishlistRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  async updateOne(authorizedUser: User, id: number, dto: UpdateWishlistDto) {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException('Нельзя обновить, коллекция не найдена');
    }

    if (authorizedUser.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя изменить чужую коллекцию');
    }

    try {
      await this.wishesService.updateOne(authorizedUser, id, dto);

      return this.findById(id);
    } catch {
      throw new ConflictException('При изменении коллекция возникла ошибка');
    }
  }

  async removeOne(authorizedUser: User, id: number) {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException('Нельзя удалить, коллекция не найдена');
    }

    if (authorizedUser.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя удалить чужую коллекцию');
    }

    try {
      return await this.wishlistRepository.delete(id);
    } catch {
      throw new ConflictException('При удалении коллекции возникла ошибка');
    }
  }
}
