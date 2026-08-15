import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import buildApp from '../src/app.js';
import { prisma } from '../src/utils/prisma.js';

const app = buildApp();

describe('Cards API Integration Tests', () => {
  let boardId: string;
  let todoColumnId: number;
  let inProgressColumnId: number;
  let doneColumnId: number;

  beforeEach(async () => {
    await prisma.card.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();

    const board = await prisma.board.create({
      data: {
        name: 'Test Board',
        columns: {
          create: [
            { name: 'ToDo', order: 0 },
            { name: 'In Progress', order: 1 },
            { name: 'Done', order: 2 },
          ],
        },
      },
      include: { columns: { orderBy: { order: 'asc' } } },
    });

    boardId = board.id;
    todoColumnId = board.columns[0].id;
    inProgressColumnId = board.columns[1].id;
    doneColumnId = board.columns[2].id;
  });

  describe('POST /api/cards', () => {
    it('should create a card with automatically calculated sequential positions', async () => {
      const res1 = await request(app).post('/api/cards').send({
        columnId: todoColumnId,
        title: 'First Card',
        description: 'First description',
      });

      expect(res1.status).toBe(201);
      expect(res1.body.title).toBe('First Card');
      expect(res1.body.description).toBe('First description');
      expect(res1.body.position).toBe(0);

      const res2 = await request(app).post('/api/cards').send({
        columnId: todoColumnId,
        title: 'Second Card',
      });

      expect(res2.status).toBe(201);
      expect(res2.body.title).toBe('Second Card');
      expect(res2.body.description).toBe('');
      expect(res2.body.position).toBe(1);

      const dbCards = await prisma.card.findMany({
        where: { columnId: todoColumnId },
        orderBy: { position: 'asc' },
      });
      expect(dbCards).toHaveLength(2);
      expect(dbCards[0].position).toBe(0);
      expect(dbCards[1].position).toBe(1);
    });

    it('should return 400 Bad Request when card title is missing or empty', async () => {
      const res = await request(app).post('/api/cards').send({
        columnId: todoColumnId,
        title: '   ',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 Not Found when creating a card in a non-existent column', async () => {
      const res = await request(app).post('/api/cards').send({
        columnId: 999999,
        title: 'Orphan Card',
      });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Column not found');
    });
  });

  describe('PATCH /api/cards/:cardId', () => {
    it('should update card title and description', async () => {
      const card = await prisma.card.create({
        data: {
          columnId: todoColumnId,
          title: 'Old Title',
          description: 'Old Description',
          position: 0,
        },
      });

      const res = await request(app)
        .patch(`/api/cards/${card.id}`)
        .send({ title: 'New Title', description: 'New Description' });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(card.id);
      expect(res.body.title).toBe('New Title');
      expect(res.body.description).toBe('New Description');

      const updated = await prisma.card.findUnique({ where: { id: card.id } });
      expect(updated?.title).toBe('New Title');
    });

    it('should return 400 Bad Request when no update fields are provided', async () => {
      const card = await prisma.card.create({
        data: {
          columnId: todoColumnId,
          title: 'Task',
          position: 0,
        },
      });

      const res = await request(app).patch(`/api/cards/${card.id}`).send({});
      expect(res.status).toBe(400);
    });

    it('should return 404 Not Found when updating a non-existent card', async () => {
      const res = await request(app)
        .patch('/api/cards/999999')
        .send({ title: 'Non-existent' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Card not found');
    });
  });

  describe('PATCH /api/cards/:cardId/move', () => {
    it('should reorder cards within the same column (drag down)', async () => {
      const c1 = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card 1', position: 0 },
      });
      const c2 = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card 2', position: 1 },
      });
      const c3 = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card 3', position: 2 },
      });

      const res = await request(app).patch(`/api/cards/${c1.id}/move`).send({
        targetColumnId: todoColumnId,
        newPosition: 2,
      });

      expect(res.status).toBe(200);
      expect(res.body.position).toBe(2);

      const orderedCards = await prisma.card.findMany({
        where: { columnId: todoColumnId },
        orderBy: { position: 'asc' },
      });

      expect(orderedCards.map(c => c.id)).toEqual([c2.id, c3.id, c1.id]);
      expect(orderedCards.map(c => c.position)).toEqual([0, 1, 2]);
    });

    it('should move cards to another column and recalculate positions in both columns', async () => {
      const c1 = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card 1', position: 0 },
      });
      const c2 = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card 2', position: 1 },
      });

      const c3 = await prisma.card.create({
        data: { columnId: inProgressColumnId, title: 'Card 3', position: 0 },
      });

      const res = await request(app).patch(`/api/cards/${c1.id}/move`).send({
        targetColumnId: inProgressColumnId,
        newPosition: 0,
      });

      expect(res.status).toBe(200);
      expect(res.body.columnId).toBe(inProgressColumnId);
      expect(res.body.position).toBe(0);

      const sourceCards = await prisma.card.findMany({
        where: { columnId: todoColumnId },
        orderBy: { position: 'asc' },
      });
      expect(sourceCards).toHaveLength(1);
      expect(sourceCards[0].id).toBe(c2.id);
      expect(sourceCards[0].position).toBe(0);

      const targetCards = await prisma.card.findMany({
        where: { columnId: inProgressColumnId },
        orderBy: { position: 'asc' },
      });
      expect(targetCards).toHaveLength(2);
      expect(targetCards[0].id).toBe(c1.id);
      expect(targetCards[0].position).toBe(0);
      expect(targetCards[1].id).toBe(c3.id);
      expect(targetCards[1].position).toBe(1);
    });

    it('should return 404 when target column does not exist', async () => {
      const card = await prisma.card.create({
        data: { columnId: todoColumnId, title: 'Card', position: 0 },
      });

      const res = await request(app)
        .patch(`/api/cards/${card.id}/move`)
        .send({ targetColumnId: 999999, newPosition: 0 });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Target column not found');
    });

    it('should return 404 when moving a non-existent card', async () => {
      const res = await request(app)
        .patch('/api/cards/999999/move')
        .send({ targetColumnId: inProgressColumnId, newPosition: 0 });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Card not found');
    });
  });

  describe('DELETE /api/cards/:cardId', () => {
    it('should delete a card successfully', async () => {
      const card = await prisma.card.create({
        data: {
          columnId: todoColumnId,
          title: 'Card to Delete',
          position: 0,
        },
      });

      const res = await request(app).delete(`/api/cards/${card.id}`);
      expect(res.status).toBe(204);

      const dbCard = await prisma.card.findUnique({ where: { id: card.id } });
      expect(dbCard).toBeNull();
    });

    it('should return 404 Not Found when deleting a non-existent card', async () => {
      const res = await request(app).delete('/api/cards/999999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Card not found');
    });
  });
});
