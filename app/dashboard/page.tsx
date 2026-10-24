import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { recolhimentoDiario } from "@/drizzle/schema";
import { db, Repository } from "@/lib/db";
import { range, sumBy, filter } from "lodash";
import { BarChart } from "recharts";
import { MainChart } from "./_components";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "cn";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonChart, SkeletonStats } from "./_components";
import { Stat, StatIndicator, StatLabel, StatTrend, StatValue } from "@/components/ui/stat";
import { DollarSign } from "lucide-react";
import { formatDate } from "date-fns";
import { getConfig } from "@/lib/config";

const _meses = range(1, 13).map((m) => m);

export default async function Home(props: PageProps<"/">) {
  const { key = "total" } = await props.searchParams;

  return (
    <div className="p-4 flex flex-col gap-4">

      <Suspense fallback={<SkeletonStats />}>
        <States />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Arrecadacao Mensal</CardTitle>
          <CardDescription>
            Detalha a Arrecadação durante os 12 meses do ano
          </CardDescription>
          <CardAction>
            <ButtonGroup>
              <Button
                nativeButton={false}
                size={`xs`}
                variant={"outline"}
                className={cn({ "font-bold": key == `total` })}
                render={<Link href={`?key=total`}>TOTAL</Link>}
              />
              <Button
                nativeButton={false}
                size={`xs`}
                variant={"outline"}
                className={cn({ "font-bold": key == `iss` })}
                render={<Link href={`?key=iss`}>ISS</Link>}
              />
              <Button
                nativeButton={false}
                size={`xs`}
                variant={"outline"}
                className={cn({ "font-bold": key == `iptu` })}
                render={<Link href={`?key=iptu`}>IPTU</Link>}
              />
              <Button
                nativeButton={false}
                size={`xs`}
                variant={"outline"}
                className={cn({ "font-bold": key == `itbi` })}
                render={<Link href={`?key=itbi`}>ITBI</Link>}
              />
              <Button
                nativeButton={false}
                size={`xs`}
                variant={"outline"}
                className={cn({ "font-bold": key == `adicional` })}
                render={<Link href={`?key=adicional`}>JUROS/MULTAS</Link>}
              />
            </ButtonGroup>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* <SkeletonChart /> */}
          <Suspense fallback={<SkeletonChart />}>
            <DashboardData chave={key.toString()} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function DashboardData({ chave: key }: { chave: string }) {
  const config = await getConfig()
  const ano_atual = config.ano

  const data = await Repository.receitasMensal(`${ano_atual}-12-31`)

  return <MainChart data={data} />;
}

const now = formatDate(new Date(), 'yyyy-MM-dd')

async function States() {
  const config = await getConfig()

  const ano_atual = config.ano
  const data = await Repository.calculo(`${ano_atual}-01-01`, now)

  return <div className="grid grid-cols-4 gap-2">
    <Stat>
      <StatLabel>Incremento atual</StatLabel>
      <StatIndicator variant={'icon'}>
        <DollarSign />
      </StatIndicator>
      <StatValue>{data.at(2)?.valueHuman}</StatValue>
    </Stat>

    <Stat>
      <StatLabel>Valor a distribuir</StatLabel>
      <StatIndicator variant={'icon'}>
        <DollarSign />
      </StatIndicator>
      <StatValue>{data.at(5)?.valueHuman}</StatValue>
    </Stat>

    <Stat>
      <StatLabel>Valor auditor</StatLabel>
      <StatIndicator variant={'icon'}>
        <DollarSign />
      </StatIndicator>
      <StatValue>{data.at(8)?.valueHuman}</StatValue>
    </Stat>

    <Stat>
      <StatLabel>Valor analista</StatLabel>
      <StatIndicator variant={'icon'}>
        <DollarSign />
      </StatIndicator>
      <StatValue>{data.at(9)?.valueHuman}</StatValue>
    </Stat>


  </div>
}