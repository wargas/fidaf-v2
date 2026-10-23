import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { recolhimentoDiario } from "@/drizzle/schema";
import { ano_atual } from "@/lib/constants";
import { db } from "@/lib/db";
import { range, sumBy, filter } from "lodash";
import { BarChart } from "recharts";
import { MainChart } from "../_components";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "cn";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonChart } from "./_components";

const _meses = range(1, 13).map(m => m)


export default async function Home(props: PageProps<"/">) {

  const { key = "total" } = await props.searchParams

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Arrecadacao Mensal</CardTitle>
          <CardDescription>Detalha a Arrecadação durante os 12 meses do ano</CardDescription>
          <CardAction>
            <ButtonGroup>
              <Button nativeButton={false} size={`xs`} variant={'outline'} className={cn({ 'font-bold': key == `total` })} render={<Link href={`?key=total`}>TOTAL</Link>} />
              <Button nativeButton={false} size={`xs`} variant={'outline'} className={cn({ 'font-bold': key == `iss` })} render={<Link href={`?key=iss`}>ISS</Link>} />
              <Button nativeButton={false} size={`xs`} variant={'outline'} className={cn({ 'font-bold': key == `iptu` })} render={<Link href={`?key=iptu`}>IPTU</Link>} />
              <Button nativeButton={false} size={`xs`} variant={'outline'} className={cn({ 'font-bold': key == `itbi` })} render={<Link href={`?key=itbi`}>ITBI</Link>} />
              <Button nativeButton={false} size={`xs`} variant={'outline'} className={cn({ 'font-bold': key == `adicional` })} render={<Link href={`?key=adicional`}>JUROS/MULTAS</Link>} />
            </ButtonGroup>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* <SkeletonChart /> */}
          <Suspense fallback={<SkeletonChart />}>
            <DashboardData key={key.toString()} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function DashboardData({ key }: { key: string }) {
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
  }))

  const meses = _meses
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
          anterior: sumBy(filter(lista, { mes, imposto: 'ITBI', ano: ano_atual - 1 }), 'corrigido'),
          corrente: sumBy(filter(lista, { mes, imposto: 'ITBI', ano: ano_atual }), 'corrigido'),
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

    return <MainChart data={meses} />
}
