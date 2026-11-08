export type Usuario = {
  id: string;
  nome: string;
  nomeUsual: string | null;
  email: string;
  createdAt: string;
  ativo: boolean;
  instituicao: { id: string; nome: string } | null;
  roles: string[];
};

export type Papel = {
  id: string;
  nome: string;
};
