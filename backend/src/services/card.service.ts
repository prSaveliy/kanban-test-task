import type { CardRepository } from '../repositories/card.repository.js';
import type {
  CreateCardInput,
  UpdateCardInput,
  MoveCardInput,
} from '../common/schemas/card.schema.js';
import { NotFoundError } from '../common/errors/httpErrors.js';

export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async createCard(data: CreateCardInput) {
    const column = await this.cardRepository.findColumnById(data.columnId);
    if (!column) {
      throw new NotFoundError('Column not found');
    }

    const nextPosition = await this.cardRepository.getNextPosition(
      data.columnId,
    );

    return this.cardRepository.create({
      columnId: data.columnId,
      title: data.title,
      description: data.description ?? '',
      position: nextPosition,
    });
  }

  async updateCard(id: number, data: UpdateCardInput) {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundError('Card not found');
    }

    return this.cardRepository.update(id, data);
  }

  async deleteCard(id: number) {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundError('Card not found');
    }

    await this.cardRepository.delete(id);
  }

  async moveCard(cardId: number, data: MoveCardInput) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card not found');
    }

    const targetColumn = await this.cardRepository.findColumnById(
      data.targetColumnId,
    );
    if (!targetColumn) {
      throw new NotFoundError('Target column not found');
    }

    const updatedCard = await this.cardRepository.moveCard(
      cardId,
      data.targetColumnId,
      data.newPosition,
    );

    if (!updatedCard) {
      throw new NotFoundError('Card not found');
    }

    return updatedCard;
  }
}
