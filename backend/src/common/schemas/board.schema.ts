import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().trim().min(1, 'Board name is required'),
});

export const updateBoardSchema = z.object({
  name: z.string().trim().min(1, 'Board name is required'),
});

export const boardIdParamSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type BoardIdParam = z.infer<typeof boardIdParamSchema>;
