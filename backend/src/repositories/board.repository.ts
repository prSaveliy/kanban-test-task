import type { PrismaClient } from '../../generated/prisma/client.js';

export class BoardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(name: string) {
    return this.prisma.board.create({
      data: {
        name,
        columns: {
          create: [
            { name: 'ToDo', order: 0 },
            { name: 'In Progress', order: 1 },
            { name: 'Done', order: 2 },
          ],
        },
      },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
  }

  async update(id: string, name: string) {
    return this.prisma.board.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    return this.prisma.board.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.board.count({ where: { id } });
    return count > 0;
  }
}
