import type { BoardRepository } from '../repositories/board.repository.js';
import type {
  CreateBoardInput,
  UpdateBoardInput,
} from '../common/schemas/board.schema.js';
import { NotFoundError } from '../common/errors/httpErrors.js';

export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(data: CreateBoardInput) {
    return this.boardRepository.create(data.name);
  }

  async getBoardById(id: string) {
    const board = await this.boardRepository.findById(id);
    if (!board) {
      throw new NotFoundError('Board not found');
    }
    return board;
  }

  async updateBoard(id: string, data: UpdateBoardInput) {
    const exists = await this.boardRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Board not found');
    }
    return this.boardRepository.update(id, data.name);
  }

  async deleteBoard(id: string) {
    const exists = await this.boardRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Board not found');
    }
    await this.boardRepository.delete(id);
  }
}
