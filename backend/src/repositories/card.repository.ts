import type { PrismaClient } from '../../generated/prisma/client.js';

export class CardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findColumnById(columnId: number) {
    return this.prisma.column.findUnique({
      where: { id: columnId },
    });
  }

  async findById(id: number) {
    return this.prisma.card.findUnique({
      where: { id },
    });
  }

  async getNextPosition(columnId: number): Promise<number> {
    const lastCard = await this.prisma.card.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
    });
    return lastCard ? lastCard.position + 1 : 0;
  }

  async create(data: {
    columnId: number;
    title: string;
    description: string;
    position: number;
  }) {
    return this.prisma.card.create({
      data,
    });
  }

  async update(id: number, data: { title?: string; description?: string }) {
    return this.prisma.card.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.card.delete({
      where: { id },
    });
  }

  async moveCard(cardId: number, targetColumnId: number, newPosition: number) {
    return this.prisma.$transaction(async tx => {
      const card = await tx.card.findUnique({ where: { id: cardId } });
      if (!card) {
        return null;
      }

      const sourceColumnId = card.columnId;
      const oldPosition = card.position;

      if (sourceColumnId === targetColumnId) {
        if (oldPosition < newPosition) {
          await tx.card.updateMany({
            where: {
              columnId: sourceColumnId,
              position: { gt: oldPosition, lte: newPosition },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        } else if (oldPosition > newPosition) {
          await tx.card.updateMany({
            where: {
              columnId: sourceColumnId,
              position: { gte: newPosition, lt: oldPosition },
            },
            data: {
              position: { increment: 1 },
            },
          });
        }

        return tx.card.update({
          where: { id: cardId },
          data: { position: newPosition },
        });
      }

      // Moving to a different column
      await tx.card.updateMany({
        where: {
          columnId: sourceColumnId,
          position: { gt: oldPosition },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      await tx.card.updateMany({
        where: {
          columnId: targetColumnId,
          position: { gte: newPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      return tx.card.update({
        where: { id: cardId },
        data: {
          columnId: targetColumnId,
          position: newPosition,
        },
      });
    });
  }
}
