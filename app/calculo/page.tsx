import { recolhimentoDiario } from "@/drizzle/schema"
import { ano_atual } from "@/lib/constants"
import { db } from "@/lib/db"
import _, { } from "lodash"
import { DataGridCalculo } from "./_components"
import Form from "next/form"
import { Button } from "@/components/ui/button"
import { FilterIcon } from "lucide-react"
import { formatDate, startOfMonth, subDays, eachMonthOfInterval, startOfYear } from "date-fns"
import { between, or, sql, } from "drizzle-orm"
import { InputDate } from "@/components/input-date"
import { Suspense } from "react"
import { SkeletonTable } from "@/components/skeleton-table"

const startMonth = formatDate(startOfYear(new Date()), "yyyy-MM-dd")
const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd")

export default async function IpcaPage({ searchParams }: PageProps<"/receitas">) {

    const params = await searchParams

    const inicio = _.has(params, "inicio") ? String(params.inicio) : startMonth
    const fim = _.has(params, "fim") ? String(params.fim) : endMonth




    return <div className="flex flex-col">
        <Form action={``} className="p-4 border-b flex gap-2">
            {/* <Input className="max-w-40" placeholder="inicio" key={`inicio-${inicio}`} defaultValue={inicio} name="inicio" /> */}
            <InputDate defaultValue={inicio} name="inicio" />
            <InputDate defaultValue={fim} name="fim" />

            <Button type="submit">
                <FilterIcon />
                Filtrar</Button>
        </Form>
        
        <Suspense fallback={<SkeletonTable />}>
            <CalculoData inicio={inicio} fim={fim} />
        </Suspense>


    </div>
}

async function CalculoData({ inicio, fim }: { inicio: string, fim: string }) {
    const meses = eachMonthOfInterval({ start: inicio, end: fim }).length - 1

    const dataCorrente = await db
        .select({
            ano: sql<string>`YEAR(${recolhimentoDiario.data})`,
            sum: sql<number>`SUM(${recolhimentoDiario.corrigido})`
        })
        .from(recolhimentoDiario)
        .groupBy(sql`YEAR(${recolhimentoDiario.data})`)
        .where(
            or(
                between(recolhimentoDiario.data, inicio, fim),
                between(recolhimentoDiario.data, inicio.replace(String(ano_atual), String(ano_atual - 1)), fim.replace(String(ano_atual), String(ano_atual - 1))),
            )
        );

    const refis = 31_243_248.20
    const pontos = 495.15

    const data: { label: string, value: string }[] = []

    data.push(
        ...dataCorrente.map(d => ({ label: `RECEITAS ${d.ano}`, value: parseFloat(d.sum.toString()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }))
    )

    const receitasAnterior = parseFloat(dataCorrente.find(d => d.ano == (ano_atual - 1).toString())?.sum.toString() ?? "0")
    const receitasCorrente = parseFloat(dataCorrente.find(d => d.ano == ano_atual.toString())?.sum.toString() ?? "0")

    const incrementoValor = Math.max((receitasCorrente - receitasAnterior), 0)
    const incrementoPercent = incrementoValor / receitasAnterior

    data.push(
        { label: `INCREMENTO (${incrementoPercent.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 })})`, value: incrementoValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
    )


    data.push({
        label: "VALOR REFIS", value: refis.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    let premioPercent = 0.1

    if (incrementoPercent >= 0.07) {
        premioPercent = 0.15
    }


    if (incrementoPercent >= 0.04 && incrementoPercent <= 0.07) {
        premioPercent = 0.125
    }

    data.push(
        { label: `PORCENTAGEM DISTRIBUICAO`, value: premioPercent.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 }) }
    )

    const valorADistribuir = (incrementoValor * premioPercent * 0.8) + (refis * 0.05)

    data.push({
        label: "VALOR A DISTRIBUIR", value: valorADistribuir.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    const valorPonto = valorADistribuir / pontos

    data.push({
        label: "VALOR AUDITOR", value: (valorPonto * 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    data.push({
        label: "VALOR ANALISTA", value: (valorPonto * 2.1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    data.push({
        label: "VALOR AUDITOR (MENSAL)", value: (valorPonto * 3 / meses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    data.push({
        label: "VALOR ANALISTA (MENSAL)", value: (valorPonto * 2.1 / meses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    data.push({
        label: "VALOR AUDITOR (ANUAL PROJETADO)", value: (valorPonto * 3 / meses * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    data.push({
        label: "VALOR ANALISTA (ANUAL PROJETADO)", value: (valorPonto * 2.1 / meses * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    })

    return <DataGridCalculo data={data as any} />
}