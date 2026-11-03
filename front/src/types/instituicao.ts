export type Institution = {
  id: string;
  nome: string;
  campus: string;
  cidade: string;
  cnpj: string | null;
  ativo: boolean;
  createdAt: string;
  _count?: {
    usuarios: number;
    cursos: number;
    departamentos: number;
  };
};

export type InstitutionInput = {
  nome: string;
  campus: string;
  cidade: string;
  cnpj: string;
};
