import { z } from 'zod';

export const createCardSchema = z.object({
  columnId: z.coerce
    .number()
    .int()
    .positive('Column ID must be a positive integer'),
  title: z.string().trim().min(1, 'Card title is required'),
  description: z.string().optional().default(''),
});

export const updateCardSchema = z
  .object({
    title: z.string().trim().min(1, 'Card title cannot be empty').optional(),
    description: z.string().optional(),
  })
  .refine(data => data.title !== undefined || data.description !== undefined, {
    message: 'At least one field (title or description) must be provided',
  });

export const cardIdParamSchema = z.object({
  cardId: z.coerce
    .number()
    .int()
    .positive('Card ID must be a positive integer'),
});

export const moveCardSchema = z.object({
  targetColumnId: z.coerce
    .number()
    .int()
    .positive('Target Column ID must be a positive integer'),
  newPosition: z.coerce
    .number()
    .int()
    .min(0, 'New position must be non-negative'),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CardIdParam = z.infer<typeof cardIdParamSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
