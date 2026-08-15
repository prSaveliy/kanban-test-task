import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import buildApp from '../src/app.js';
import { prisma } from '../src/utils/prisma.js';

const app = buildApp();

describe('Boards API Integration Tests', () => {
  beforeEach(async () => {
    await prisma.card.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
  });

  describe('POST /api/boards', () => {
    it('should create a board with 3 default columns (ToDo, In Progress, Done)', async () => {
      const response = await request(app)
        .post('/api/boards')
        .send({ name: 'Development Sprint' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Development Sprint');
      expect(response.body.columns).toHaveLength(3);

      const [todo, inProgress, done] = response.body.columns;
      expect(todo.name).toBe('ToDo');
      expect(todo.order).toBe(0);
      expect(inProgress.name).toBe('In Progress');
      expect(inProgress.order).toBe(1);
      expect(done.name).toBe('Done');
      expect(done.order).toBe(2);

      const dbBoard = await prisma.board.findUnique({
        where: { id: response.body.id },
        include: { columns: true },
      });
      expect(dbBoard).not.toBeNull();
      expect(dbBoard?.columns).toHaveLength(3);
    });

    it('should return 400 Bad Request when board name is missing or empty', async () => {
      const emptyRes = await request(app)
        .post('/api/boards')
        .send({ name: '' });
      expect(emptyRes.status).toBe(400);
      expect(emptyRes.body).toHaveProperty('error');

      const whitespaceRes = await request(app)
        .post('/api/boards')
        .send({ name: '   ' });
      expect(whitespaceRes.status).toBe(400);

      const missingRes = await request(app).post('/api/boards').send({});
      expect(missingRes.status).toBe(400);
    });
  });

  describe('GET /api/boards/:boardId', () => {
    it('should return a board by ID with its columns and cards', async () => {
      const board = await prisma.board.create({
        data: {
          name: 'Existing Board',
          columns: {
            create: [
              {
                name: 'ToDo',
                order: 0,
                cards: {
                  create: [
                    { title: 'Task A', description: 'Desc A', position: 0 },
                    { title: 'Task B', description: 'Desc B', position: 1 },
                  ],
                },
              },
              { name: 'In Progress', order: 1 },
              { name: 'Done', order: 2 },
            ],
          },
        },
        include: { columns: { include: { cards: true } } },
      });

      const response = await request(app).get(`/api/boards/${board.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(board.id);
      expect(response.body.name).toBe('Existing Board');
      expect(response.body.columns).toHaveLength(3);

      const todoCol = response.body.columns.find((c: any) => c.name === 'ToDo');
      expect(todoCol.cards).toHaveLength(2);
      expect(todoCol.cards[0].title).toBe('Task A');
      expect(todoCol.cards[1].title).toBe('Task B');
    });

    it('should return 404 Not Found for non-existent boardId', async () => {
      const response = await request(app).get(
        '/api/boards/non-existent-uuid-12345',
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Board not found');
    });
  });

  describe('PATCH /api/boards/:boardId', () => {
    it('should update board name', async () => {
      const board = await prisma.board.create({
        data: { name: 'Original Name' },
      });

      const response = await request(app)
        .patch(`/api/boards/${board.id}`)
        .send({ name: 'Renamed Board' });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(board.id);
      expect(response.body.name).toBe('Renamed Board');

      const updatedDbBoard = await prisma.board.findUnique({
        where: { id: board.id },
      });
      expect(updatedDbBoard?.name).toBe('Renamed Board');
    });

    it('should return 400 Bad Request when new name is empty', async () => {
      const board = await prisma.board.create({
        data: { name: 'Original Name' },
      });

      const response = await request(app)
        .patch(`/api/boards/${board.id}`)
        .send({ name: '  ' });

      expect(response.status).toBe(400);
    });

    it('should return 404 Not Found when updating a non-existent board', async () => {
      const response = await request(app)
        .patch('/api/boards/non-existent-uuid-12345')
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Board not found');
    });
  });

  describe('DELETE /api/boards/:boardId', () => {
    it('should delete a board and cascade delete its columns and cards', async () => {
      const board = await prisma.board.create({
        data: {
          name: 'Board to Delete',
          columns: {
            create: [
              {
                name: 'ToDo',
                order: 0,
                cards: {
                  create: [{ title: 'Card 1', position: 0 }],
                },
              },
            ],
          },
        },
        include: { columns: { include: { cards: true } } },
      });

      const columnId = board.columns[0].id;
      const cardId = board.columns[0].cards[0].id;

      const response = await request(app).delete(`/api/boards/${board.id}`);
      expect(response.status).toBe(204);

      const dbBoard = await prisma.board.findUnique({
        where: { id: board.id },
      });
      const dbColumn = await prisma.column.findUnique({
        where: { id: columnId },
      });
      const dbCard = await prisma.card.findUnique({ where: { id: cardId } });

      expect(dbBoard).toBeNull();
      expect(dbColumn).toBeNull();
      expect(dbCard).toBeNull();
    });

    it('should return 404 Not Found when deleting a non-existent board', async () => {
      const response = await request(app).delete(
        '/api/boards/non-existent-uuid-12345',
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Board not found');
    });
  });
});
