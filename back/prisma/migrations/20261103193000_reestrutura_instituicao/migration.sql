ALTER TABLE `instituicoes`
  DROP INDEX `instituicoes_sigla_key`,
  ADD COLUMN `campus` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `cidade` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `cnpj` VARCHAR(191) NULL,
  DROP COLUMN `sigla`,
  DROP COLUMN `endereco`,
  ADD UNIQUE INDEX `instituicoes_cnpj_key`(`cnpj`);
