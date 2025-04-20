import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(authorizedUser: User, dto: CreateOfferDto) {
    const wish = await this.wishesService.getWishById(dto.itemId);

    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (authorizedUser.id === wish.owner.id) {
      throw new BadRequestException('Нельзя скинуться на свой подарок');
    }

    const amount = Number(dto.amount);
    const price = Number(wish.price);
    const raised = Number(wish.raised);

    if (amount > price || amount + raised > price) {
      throw new ForbiddenException(
        'Нельзя скинуться больше, чем стоит подарок',
      );
    }

    try {
      const offer = await this.offerRepository.save({
        ...dto,
        item: wish,
        user: dto.hidden ? authorizedUser : undefined,
      });
      await this.wishesService.updateRaised(wish.id);

      return offer;
    } catch {
      throw new ConflictException('При сохранении произошла ошибка');
    }
  }

  async findOne(id: number) {
    return await this.offerRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async checkEditingIsAvailable(authorizedUser: User, id: number) {
    const offer = await this.findOne(id);

    if (!offer) {
      throw new NotFoundException(
        'Нельзя обновить или удалить, заявка не найдена',
      );
    }

    if (offer.user.id !== authorizedUser.id) {
      throw new ForbiddenException('Нельзя обновить или удалить чужую заявку');
    }
  }

  async updateOne(authorizedUser: User, id: number, dto: UpdateOfferDto) {
    await this.checkEditingIsAvailable(authorizedUser, id);

    try {
      await this.offerRepository.update(id, dto);

      return this.findOne(id);
    } catch {
      throw new ConflictException('При обновлении заявки возникла ошибка');
    }
  }

  async removeOne(authorizedUser: User, id: number) {
    await this.checkEditingIsAvailable(authorizedUser, id);

    try {
      return await this.offerRepository.delete(id);
    } catch {
      throw new ConflictException('При удалении заявка произошла ошибка');
    }
  }
}
