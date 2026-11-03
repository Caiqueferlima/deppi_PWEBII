import { z } from "zod";

export const createInstituicaoSchema = z.object({
  nome: z.string().min(2, "Nome inválido"),
  campus: z.string().min(2, "Campus inválido"),
  cidade: z.string().min(2, "Cidade inválida"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos"),
});

export const updateInstituicaoSchema = z.object({
  nome: z.string().min(2).optional(),
  campus: z.string().min(2).optional(),
  cidade: z.string().min(2).optional(),
  cnpj: z.string().regex(/^\d{14}$/).optional(),
  ativo: z.boolean().optional(),
});

export const toggleAtivoSchema = z.object({
  ativo: z.boolean(),
});

export const instituicaoIdParamSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export type CreateInstituicaoDTO = z.infer<typeof createInstituicaoSchema>;
export type UpdateInstituicaoDTO = z.infer<typeof updateInstituicaoSchema>;
