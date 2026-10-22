-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `codigos` (
	`id` int unsigned AUTO_INCREMENT PRIMARY KEY,
	`codigo` varchar(255),
	`imposto` varchar(255),
	`subalinea` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `validador` (
	`codigo` varchar(20) PRIMARY KEY,
	`valor` decimal(12,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recolhimento` (
	`id` varchar(100) PRIMARY KEY,
	`data` date NOT NULL,
	`codigo` varchar(20) NOT NULL,
	`valor` decimal(12,2),
	`tipo` int NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `servidores` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`nome` varchar(100) NOT NULL,
	`cargo` varchar(100),
	`mes` varchar(20)
);
--> statement-breakpoint
CREATE TABLE `cargos` (
	`nome` varchar(255) PRIMARY KEY,
	`pontos` decimal(2,1) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ipca` (
	`id` int unsigned AUTO_INCREMENT PRIMARY KEY,
	`mes` varchar(255),
	`indice` decimal(10,2),
	CONSTRAINT `mes` UNIQUE INDEX(`mes`)
);
--> statement-breakpoint
CREATE TABLE `teste` (
	`name` enum('A','B')
);
--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `correcao` AS (select `tb1`.`mes` AS `mes`,(`tb1`.`maximo` / `tb1`.`indice`) AS `correcao` from (select `fidaf`.`ipca`.`mes` AS `mes`,`fidaf`.`ipca`.`indice` AS `indice`,(select max(`fidaf`.`ipca`.`indice`) from `fidaf`.`ipca`) AS `maximo` from `fidaf`.`ipca`) `tb1`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `pontos` AS (select ((`tb2`.`pontos` + ((12 - `tb2`.`total`) * `tb2`.`ultimo`)) / 12) AS `pontos` from (select sum(`tb1`.`pontos`) AS `pontos`,sum(if((`tb1`.`mes` = `tb1`.`ultimo`),`tb1`.`pontos`,0)) AS `ultimo`,count(0) AS `total` from (select `fidaf`.`pm`.`mes` AS `mes`,`fidaf`.`pm`.`pontos` AS `pontos`,(select max(`fidaf`.`pontos_mes`.`mes`) from `fidaf`.`pontos_mes`) AS `ultimo` from `fidaf`.`pontos_mes` `pm`) `tb1`) `tb2`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `pontos_mes` AS (select `ct1`.`mes` AS `mes`,sum(`ct1`.`pontos`) AS `pontos`,count(0) AS `total` from (select `s`.`mes` AS `mes`,`c`.`pontos` AS `pontos` from (`fidaf`.`servidores` `s` join `fidaf`.`cargos` `c` on((`c`.`nome` = `s`.`cargo`)))) `ct1` group by `ct1`.`mes`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `recolhimento_diario` AS (select date_format(`rec`.`data`,'%Y-%m-%d') AS `data`,`cod`.`imposto` AS `imposto`,sum(`rec`.`valor`) AS `nominal`,(sum(`rec`.`valor`) * `fidaf`.`cor`.`correcao`) AS `corrigido` from ((`fidaf`.`recolhimento` `rec` left join `fidaf`.`codigos` `cod` on((`cod`.`codigo` = `rec`.`codigo`))) left join `fidaf`.`correcao` `cor` on((`fidaf`.`cor`.`mes` = date_format(`rec`.`data`,'%Y-%m')))) group by date_format(`rec`.`data`,'%Y-%m-%d'),`cod`.`imposto`,`fidaf`.`cor`.`correcao`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `resumo` AS (select date_format(`rec`.`data`,'%Y-%m') AS `mes`,`cod`.`imposto` AS `imposto`,sum(`rec`.`valor`) AS `nominal`,(sum(`rec`.`valor`) * `fidaf`.`cor`.`correcao`) AS `corrigido` from ((`fidaf`.`recolhimento` `rec` left join `fidaf`.`codigos` `cod` on((`cod`.`codigo` = `rec`.`codigo`))) left join `fidaf`.`correcao` `cor` on((`fidaf`.`cor`.`mes` = date_format(`rec`.`data`,'%Y-%m')))) group by date_format(`rec`.`data`,'%Y-%m'),`cod`.`imposto`,`fidaf`.`cor`.`correcao`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `status` AS (select `c`.`imposto` AS `imposto`,sum(`r`.`valor`) AS `valor` from (`fidaf`.`recolhimento` `r` join `fidaf`.`codigos` `c` on((`c`.`codigo` = `r`.`codigo`))) where (year(`r`.`data`) = 2025) group by `c`.`imposto`);--> statement-breakpoint
CREATE ALGORITHM = undefined SQL SECURITY definer VIEW `view_datas` AS (with recursive `datas` as (select cast('2025-01-01' as date) AS `data` union all select (`datas`.`data` + interval 1 day) AS `DATE_ADD(data, INTERVAL 1 DAY)` from `datas` where (`datas`.`data` < '2025-12-31')) select `datas`.`data` AS `data` from `datas`);
*/