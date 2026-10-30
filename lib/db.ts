import { recolhimentoDiario } from "@/drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { range, sumBy, filter } from "lodash";
import { eachMonthOfInterval } from "date-fns";
import { sql, or, between } from "drizzle-orm";
import _ from "lodash";
import humanNumber from "human-number";
import { getConfig } from "./config";

export const db = drizzle(process.env.DATABASE_URL!);

export class Repository {

    static async calculo(inicio: string, fim: string) {
        const meses = eachMonthOfInterval({ start: inicio, end: fim }).length;

        console.log(meses, inicio, fim)

        const config = await getConfig()

        const ano_atual = config.ano

        const dataCorrente = await db
            .select({
                ano: sql<string>`YEAR(${recolhimentoDiario.data})`,
                sum: sql<number>`SUM(${recolhimentoDiario.corrigido})`,
            })
            .from(recolhimentoDiario)
            .groupBy(sql`YEAR(${recolhimentoDiario.data})`)
            .where(
                or(
                    between(recolhimentoDiario.data, inicio, fim),
                    between(
                        recolhimentoDiario.data,
                        inicio.replace(String(ano_atual), String(ano_atual - 1)),
                        fim.replace(String(ano_atual), String(ano_atual - 1)),
                    ),
                ),
            );

        const refis = config.refis;
        const pontos = 490.67;

        const data: { label: string; value: string, valueHuman: string }[] = [];

        data.push(
            ...dataCorrente.map((d) => ({
                label: `RECEITAS ${d.ano}`,
                value: parseFloat(d.sum.toString()).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                valueHuman: humanNumber(d.sum)
            })),
        );

        const receitasAnterior = parseFloat(
            dataCorrente
                .find((d) => d.ano == (ano_atual - 1).toString())
                ?.sum.toString() ?? "0",
        );
        const receitasCorrente = parseFloat(
            dataCorrente.find((d) => d.ano == ano_atual.toString())?.sum.toString() ??
            "0",
        );

        const incrementoValor = Math.max(receitasCorrente - receitasAnterior, 0);
        const incrementoPercent = incrementoValor / receitasAnterior;

        data.push({
            label: `INCREMENTO (${incrementoPercent.toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2 })})`,
            value: incrementoValor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(incrementoValor)
        });

        data.push({
            label: "VALOR REFIS",
            value: refis.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(refis)
        });

        let premioPercent = 0.1;

        if (incrementoPercent >= 0.07) {
            premioPercent = 0.15;
        }

        if (incrementoPercent >= 0.04 && incrementoPercent <= 0.07) {
            premioPercent = 0.125;
        }

        data.push({
            label: `PORCENTAGEM DISTRIBUICAO`,
            value: premioPercent.toLocaleString("pt-BR", {
                style: "percent",
                minimumFractionDigits: 2,
            }),
            valueHuman: humanNumber(premioPercent)
        });

        const valorADistribuir = incrementoValor * premioPercent * 0.8 + refis * 0.05;

        data.push({
            label: "VALOR A DISTRIBUIR",
            value: valorADistribuir.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(valorADistribuir)
        });

        const valorPonto = valorADistribuir / pontos;

        data.push({
            label: "VALOR AUDITOR",
            value: (valorPonto * 3).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(valorPonto * 3)
        });

        data.push({
            label: "VALOR ANALISTA",
            value: (valorPonto * 2.1).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(valorPonto * 2.1)
        });

        data.push({
            label: "VALOR AUDITOR (MENSAL)",
            value: ((valorPonto * 3) / meses).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber((valorPonto * 3) / meses)
        });

        data.push({
            label: "VALOR ANALISTA (MENSAL)",
            value: ((valorPonto * 2.1) / meses).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber((valorPonto * 2.1) / meses)
        });

        data.push({
            label: "VALOR AUDITOR (ANUAL PROJETADO)",
            value: (((valorPonto * 3) / meses) * 12).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(((valorPonto * 3) / meses) * 12)
        });

        data.push({
            label: "VALOR ANALISTA (ANUAL PROJETADO)",
            value: (((valorPonto * 2.1) / meses) * 12).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            valueHuman: humanNumber(((valorPonto * 2.1) / meses) * 12)
        });

        return data
    }

    static async receitasMensal(limit: string) {
        const data = await db.select().from(recolhimentoDiario);
        const config = await getConfig()

        const ano_atual = config.ano

        const lista = data
            .map((r) => ({
                ...r,
                nominal: parseFloat(String(r.nominal)),
                corrigido: parseFloat(String(r.corrigido)),
                dia: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$3")),
                mes: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$2")),
                ano: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$1")),
                dia_ano: r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$2-$3"),
            }))
            .filter((r) => r.dia_ano <= limit.substring(5));

        return range(1, 13)
            .map((m) => m)
            .map((mes) => {
                return {
                    mes: mes.toString().padStart(2, "0"),
                    iss: {
                        anterior: sumBy(
                            filter(lista, { mes, imposto: "ISS", ano: ano_atual - 1 }),
                            "corrigido",
                        ),
                        corrente: sumBy(
                            filter(lista, { mes, imposto: "ISS", ano: ano_atual }),
                            "corrigido",
                        ),
                    },
                    iptu: {
                        anterior: sumBy(
                            filter(lista, { mes, imposto: "IPTU", ano: ano_atual - 1 }),
                            "corrigido",
                        ),
                        corrente: sumBy(
                            filter(lista, { mes, imposto: "IPTU", ano: ano_atual }),
                            "corrigido",
                        ),
                    },
                    itbi: {
                        anterior: sumBy(
                            filter(lista, { mes, imposto: "ITBI", ano: ano_atual - 1 }),
                            "corrigido",
                        ),
                        corrente: sumBy(
                            filter(lista, { mes, imposto: "ITBI", ano: ano_atual }),
                            "corrigido",
                        ),
                    },
                    adicional: {
                        anterior: sumBy(
                            filter(lista, { mes, imposto: "JUROS MULTAS", ano: ano_atual - 1 }),
                            "corrigido",
                        ),
                        corrente: sumBy(
                            filter(lista, { mes, imposto: "JUROS MULTAS", ano: ano_atual }),
                            "corrigido",
                        ),
                    },
                    total: {
                        anterior: sumBy(
                            filter(lista, { mes, ano: ano_atual - 1 }),
                            "corrigido",
                        ),
                        corrente: sumBy(filter(lista, { mes, ano: ano_atual }), "corrigido"),
                    },
                };
            })
            .map((r) => ({ ...r, diferenca: r.total.corrente - r.total.anterior }))
            .filter((m) => m.total.anterior > 0 || m.total.corrente > 0);
    }

    static async receitasDiario(inicio: string, fim: string) {
        const data = await db
            .select()
            .from(recolhimentoDiario)
            .where(between(recolhimentoDiario.data, inicio, fim));

        return Object.keys(_.groupBy(data, "data"))
            .map((dia) => {
                const receitas = _.filter(data, { data: dia }).map((i) => ({
                    ...i,
                    nominal: parseFloat(String(i.nominal)),
                    corrigido: parseFloat(String(i.corrigido)),
                }));

                const total = {
                    corrigido: sumBy(receitas, "corrigido"),
                    nominal: sumBy(receitas, "nominal"),
                };

                const iss = {
                    corrigido: sumBy(_.filter(receitas, { imposto: "ISS" }), "corrigido"),
                    nominal: sumBy(_.filter(receitas, { imposto: "ISS" }), "nominal"),
                };

                const iptu = {
                    corrigido: sumBy(_.filter(receitas, { imposto: "IPTU" }), "corrigido"),
                    nominal: sumBy(_.filter(receitas, { imposto: "IPTU" }), "nominal"),
                };

                const itbi = {
                    corrigido: sumBy(_.filter(receitas, { imposto: "ITBI" }), "corrigido"),
                    nominal: sumBy(_.filter(receitas, { imposto: "ITBI" }), "nominal"),
                };

                const adicional = {
                    corrigido: sumBy(
                        _.filter(receitas, { imposto: "JUROS MULTAS" }),
                        "corrigido",
                    ),
                    nominal: sumBy(
                        _.filter(receitas, { imposto: "JUROS MULTAS" }),
                        "nominal",
                    ),
                };

                return {
                    dia,
                    total,
                    iss,
                    iptu,
                    itbi,
                    adicional,
                    // receitas
                };
            })
            .filter((d) => d.total.nominal > 0);
    }
}