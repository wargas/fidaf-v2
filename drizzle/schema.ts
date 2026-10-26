import { mysqlTable, mysqlSchema, varchar, text, timestamp, decimal, int, date, mysqlEnum, boolean, uniqueIndex, index, mysqlView, bigint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const codigos = mysqlTable("codigos", {
	id: int({ unsigned: true }).autoincrement().primaryKey(),
	codigo: varchar({ length: 255 }),
	imposto: varchar({ length: 255 }),
	subalinea: varchar({ length: 255 }),
});

export const validador = mysqlTable("validador", {
	codigo: varchar({ length: 20 }).primaryKey(),
	valor: decimal({ precision: 12, scale: 2 }).notNull(),
});

export const recolhimento = mysqlTable("recolhimento", {
	id: varchar({ length: 100 }).primaryKey(),
	data: date().notNull(),
	codigo: varchar({ length: 20 }).notNull(),
	valor: decimal({ precision: 12, scale: 2 }),
	tipo: int().default(1).notNull(),
});

export const servidores = mysqlTable("servidores", {
	id: int().autoincrement().primaryKey(),
	nome: varchar({ length: 100 }).notNull(),
	cargo: varchar({ length: 100 }),
	mes: varchar({ length: 20 }),
});

export const cargos = mysqlTable("cargos", {
	nome: varchar({ length: 255 }).primaryKey(),
	pontos: decimal({ precision: 2, scale: 1 }).notNull(),
});

export const ipca = mysqlTable("ipca", {
	id: int({ unsigned: true }).autoincrement().primaryKey(),
	mes: varchar({ length: 255 }),
	indice: decimal({ precision: 10, scale: 2 }),
},
(table) => [
	uniqueIndex("mes").on(table.mes),
]);

export const teste = mysqlTable("teste", {
	name: mysqlEnum(["A","B"]),
});

export const user = mysqlTable("user", {
	id: varchar({ length: 36 }).primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
},
(table) => [
	uniqueIndex("email").on(table.email),
]);

export const account = mysqlTable("account", {
	id: varchar({ length: 36 }).primaryKey(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: varchar({ length: 36 }).notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ fsp: 3 }),
	refreshTokenExpiresAt: timestamp({ fsp: 3 }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: timestamp({ fsp: 3 }).notNull(),
});

export const session = mysqlTable("session", {
	id: varchar({ length: 36 }).primaryKey(),
	expiresAt: timestamp({ fsp: 3 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: timestamp({ fsp: 3 }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: varchar({ length: 36 }).notNull(),
},
(table) => [
	index("session_userId_idx").on(table.userId),
	uniqueIndex("token").on(table.token),
]);

export const verification = mysqlTable("verification", {
	id: varchar({ length: 36 }).primaryKey(),
	identifier: varchar({ length: 255 }).notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ fsp: 3 }).notNull(),
	createdAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
	updatedAt: timestamp({ fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`).notNull(),
},
(table) => [
	index("verification_identifier_idx").on(table.identifier),
]);
export const correcao = mysqlView("correcao", {

mes: varchar({ length: 255 }),

correcao: decimal({ precision: 16, scale: 6 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select \`tb1\`.\`mes\` AS \`mes\`,(\`tb1\`.\`maximo\` / \`tb1\`.\`indice\`) AS \`correcao\` from (select \`fidaf\`.\`ipca\`.\`mes\` AS \`mes\`,\`fidaf\`.\`ipca\`.\`indice\` AS \`indice\`,(select max(\`fidaf\`.\`ipca\`.\`indice\`) from \`fidaf\`.\`ipca\`) AS \`maximo\` from \`fidaf\`.\`ipca\`) \`tb1\``);

export const pontos = mysqlView("pontos", {

pontos: decimal({ precision: 65, scale: 5 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select ((\`tb2\`.\`pontos\` + ((12 - \`tb2\`.\`total\`) * \`tb2\`.\`ultimo\`)) / 12) AS \`pontos\` from (select sum(\`tb1\`.\`pontos\`) AS \`pontos\`,sum(if((\`tb1\`.\`mes\` = \`tb1\`.\`ultimo\`),\`tb1\`.\`pontos\`,0)) AS \`ultimo\`,count(0) AS \`total\` from (select \`fidaf\`.\`pm\`.\`mes\` AS \`mes\`,\`fidaf\`.\`pm\`.\`pontos\` AS \`pontos\`,(select max(\`fidaf\`.\`pontos_mes\`.\`mes\`) from \`fidaf\`.\`pontos_mes\`) AS \`ultimo\` from \`fidaf\`.\`pontos_mes\` \`pm\`) \`tb1\`) \`tb2\``);

export const pontosMes = mysqlView("pontos_mes", {

mes: varchar({ length: 20 }),

pontos: decimal({ precision: 24, scale: 1 }),

total: bigint({ mode: 'number' }).notNull(),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select \`ct1\`.\`mes\` AS \`mes\`,sum(\`ct1\`.\`pontos\`) AS \`pontos\`,count(0) AS \`total\` from (select \`s\`.\`mes\` AS \`mes\`,\`c\`.\`pontos\` AS \`pontos\` from (\`fidaf\`.\`servidores\` \`s\` join \`fidaf\`.\`cargos\` \`c\` on((\`c\`.\`nome\` = \`s\`.\`cargo\`)))) \`ct1\` group by \`ct1\`.\`mes\``);

export const recolhimentoDiario = mysqlView("recolhimento_diario", {

data: varchar({ length: 10 }),

imposto: varchar({ length: 255 }),

nominal: decimal({ precision: 34, scale: 2 }),

corrigido: decimal({ precision: 50, scale: 8 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select date_format(\`rec\`.\`data\`,'%Y-%m-%d') AS \`data\`,\`cod\`.\`imposto\` AS \`imposto\`,sum(\`rec\`.\`valor\`) AS \`nominal\`,(sum(\`rec\`.\`valor\`) * \`fidaf\`.\`cor\`.\`correcao\`) AS \`corrigido\` from ((\`fidaf\`.\`recolhimento\` \`rec\` left join \`fidaf\`.\`codigos\` \`cod\` on((\`cod\`.\`codigo\` = \`rec\`.\`codigo\`))) left join \`fidaf\`.\`correcao\` \`cor\` on((\`fidaf\`.\`cor\`.\`mes\` = date_format(\`rec\`.\`data\`,'%Y-%m')))) group by date_format(\`rec\`.\`data\`,'%Y-%m-%d'),\`cod\`.\`imposto\`,\`fidaf\`.\`cor\`.\`correcao\``);

export const resumo = mysqlView("resumo", {

mes: varchar({ length: 7 }),

imposto: varchar({ length: 255 }),

nominal: decimal({ precision: 34, scale: 2 }),

corrigido: decimal({ precision: 50, scale: 8 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select date_format(\`rec\`.\`data\`,'%Y-%m') AS \`mes\`,\`cod\`.\`imposto\` AS \`imposto\`,sum(\`rec\`.\`valor\`) AS \`nominal\`,(sum(\`rec\`.\`valor\`) * \`fidaf\`.\`cor\`.\`correcao\`) AS \`corrigido\` from ((\`fidaf\`.\`recolhimento\` \`rec\` left join \`fidaf\`.\`codigos\` \`cod\` on((\`cod\`.\`codigo\` = \`rec\`.\`codigo\`))) left join \`fidaf\`.\`correcao\` \`cor\` on((\`fidaf\`.\`cor\`.\`mes\` = date_format(\`rec\`.\`data\`,'%Y-%m')))) group by date_format(\`rec\`.\`data\`,'%Y-%m'),\`cod\`.\`imposto\`,\`fidaf\`.\`cor\`.\`correcao\``);

export const status = mysqlView("status", {

imposto: varchar({ length: 255 }),

valor: decimal({ precision: 34, scale: 2 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select \`c\`.\`imposto\` AS \`imposto\`,sum(\`r\`.\`valor\`) AS \`valor\` from (\`fidaf\`.\`recolhimento\` \`r\` join \`fidaf\`.\`codigos\` \`c\` on((\`c\`.\`codigo\` = \`r\`.\`codigo\`))) where (year(\`r\`.\`data\`) = 2025) group by \`c\`.\`imposto\``);

export const viewDatas = mysqlView("view_datas", {

data: date(),
}).algorithm("undefined").sqlSecurity("definer").as(sql`with recursive \`datas\` as (select cast('2025-01-01' as date) AS \`data\` union all select (\`datas\`.\`data\` + interval 1 day) AS \`DATE_ADD(data, INTERVAL 1 DAY)\` from \`datas\` where (\`datas\`.\`data\` < '2025-12-31')) select \`datas\`.\`data\` AS \`data\` from \`datas\``);