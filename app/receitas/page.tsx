import { Repository, db } from "@/lib/db";
import _, { before } from "lodash";
import { DataGridReceitas } from "./_components";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { formatDate, startOfMonth, subDays } from "date-fns";
import { InputDate } from "@/components/input-date";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton-table";
import Link from "next/link";
import { FormLoading } from "@/components/form-loading";
import { getConfig } from "@/lib/config";

const startMonth = formatDate(startOfMonth(new Date()), "yyyy-MM-dd");
const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd");


export default async function ReceitasPage({
  searchParams,
}: PageProps<"/receitas">) {
  const params = await searchParams;
  const inicio = _.has(params, "inicio") ? String(params.inicio) : startMonth;
  const fim = _.has(params, "fim") ? String(params.fim) : endMonth;

  const ano = parseInt(inicio.substring(0, 4));

  const config = await getConfig()

  const ano_atual = config.ano
  const ano_anterior = ano_atual - 1;

  const urlCompare = `?inicio=${inicio}&fim=${fim}`.replaceAll(
    ano == ano_atual ? ano_atual.toString() : ano_anterior.toString(),
    ano == ano_atual ? ano_anterior.toString() : ano_atual.toString(),
  );

  return (
    <div className="flex flex-col h-full ">
      <Form action={``} className="p-4 border-b flex items-center gap-2">
        {/* <Input className="max-w-40" placeholder="inicio" key={`inicio-${inicio}`} defaultValue={inicio} name="inicio" /> */}
        <InputDate defaultValue={inicio} name="inicio" />
        <InputDate defaultValue={fim} name="fim" />

        <Button type="submit">
          <FormLoading />
          <FilterIcon />
          Filtrar
        </Button>

        <Button
          variant={"link"}
          className={`ml-auto`}
          nativeButton={false}
          render={<Link href={urlCompare}>Compare</Link>}
        />
      </Form>

      <Suspense fallback={<SkeletonTable />}>
        <ReceitasData inicio={inicio} fim={fim} />
      </Suspense>

      {/* {JSON.stringify(dias)} */}
    </div>
  );
}

async function ReceitasData({ inicio, fim }: { inicio: string; fim: string }) {
  const data = await Repository.receitasDiario(inicio, fim)
  return <DataGridReceitas data={data as any} />;
}
