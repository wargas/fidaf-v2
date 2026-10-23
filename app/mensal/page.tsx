import { ipca, recolhimentoDiario } from "@/drizzle/schema"
import { ano_atual } from "@/lib/constants"
import { db } from "@/lib/db"
import _, { filter, range, sumBy } from "lodash"
import { DataGridMensal } from "./_components"
import Form from "next/form"
import { Button } from "@/components/ui/button"
import { FilterIcon } from "lucide-react"
import { formatDate, startOfMonth, subDays } from "date-fns"
import { between, } from "drizzle-orm"
import qs from 'querystring'
import { InputDate } from "@/components/input-date"
import { ButtonGroup } from "@/components/ui/button-group"
import { Suspense } from "react"

const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd")


export default async function MensalPage({ searchParams }: PageProps<"/receitas">) {

    const params = await searchParams

    const limit = _.has(params, "limit") ? String(params.limit) : endMonth


    return <div className="flex flex-col">
        <Form action={``} className="p-4 border-b flex gap-2">

            <InputDate defaultValue={limit} name="limit" />

            <Button type="submit">
                <FilterIcon />
                Filtrar</Button>
        </Form>

        <Suspense fallback={<span>carregando...</span>}>
            <MensalData limit={limit} />
        </Suspense>

    </div>
}

async function MensalData({ limit }: { limit: string }) {
    const data = await db
        .select()
        .from(recolhimentoDiario)

    const lista = data.map(r => ({
        ...r,
        nominal: parseFloat(String(r.nominal)),
        corrigido: parseFloat(String(r.corrigido)),
        dia: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$3")),
        mes: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$2")),
        ano: parseInt(r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$1")),
        dia_ano: r.data!.replace(/(\d+)-(\d+)-(\d+)/, "$2-$3"),
    })).filter(r => r.dia_ano <= limit.substring(5))

    const meses = range(1, 13).map(m => m)
        .map(mes => {
            return {
                mes: mes.toString().padStart(2, '0'),
                iss: {
                    anterior: sumBy(filter(lista, { mes, imposto: 'ISS', ano: ano_atual - 1 }), 'corrigido'),
                    corrente: sumBy(filter(lista, { mes, imposto: 'ISS', ano: ano_atual }), 'corrigido'),
                },
                iptu: {
                    anterior: sumBy(filter(lista, { mes, imposto: 'IPTU', ano: ano_atual - 1 }), 'corrigido'),
                    corrente: sumBy(filter(lista, { mes, imposto: 'IPTU', ano: ano_atual }), 'corrigido'),
                },
                itbi: {
                    anterior: sumBy(filter(lista, { mes, imposto: 'IPTU', ano: ano_atual - 1 }), 'corrigido'),
                    corrente: sumBy(filter(lista, { mes, imposto: 'IPTU', ano: ano_atual }), 'corrigido'),
                },
                adicional: {
                    anterior: sumBy(filter(lista, { mes, imposto: 'JUROS MULTAS', ano: ano_atual - 1 }), 'corrigido'),
                    corrente: sumBy(filter(lista, { mes, imposto: 'JUROS MULTAS', ano: ano_atual }), 'corrigido'),
                },
                total: {
                    anterior: sumBy(filter(lista, { mes, ano: ano_atual - 1 }), 'corrigido'),
                    corrente: sumBy(filter(lista, { mes, ano: ano_atual }), 'corrigido'),
                },
            }
        })
        .map(r => ({ ...r, diferenca: r.total.corrente - r.total.anterior }))
        .filter(m => m.total.anterior > 0 || m.total.corrente > 0);

    return <DataGridMensal data={meses as any} />
}