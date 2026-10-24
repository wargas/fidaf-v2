import { db, Repository } from "@/lib/db";
import _ from "lodash";
import { DataGridCalculo } from "./_components";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import {
  formatDate,
  startOfMonth,
  subDays,
  eachMonthOfInterval,
  startOfYear,
} from "date-fns";
import { between, or, sql } from "drizzle-orm";
import { InputDate } from "@/components/input-date";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton-table";
import { FormLoading } from "@/components/form-loading";

const startMonth = formatDate(startOfYear(new Date()), "yyyy-MM-dd");
const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd");

export default async function IpcaPage({
  searchParams,
}: PageProps<"/receitas">) {
  const params = await searchParams;

  const inicio = _.has(params, "inicio") ? String(params.inicio) : startMonth;
  const fim = _.has(params, "fim") ? String(params.fim) : endMonth;

  return (
    <div className="flex flex-col">
      <Form action={``} className="p-4 border-b flex gap-2">
        {/* <Input className="max-w-40" placeholder="inicio" key={`inicio-${inicio}`} defaultValue={inicio} name="inicio" /> */}
        <InputDate defaultValue={inicio} name="inicio" />
        <InputDate defaultValue={fim} name="fim" />

        <Button type="submit">
          <FormLoading />
          <FilterIcon />
          Filtrar
        </Button>
      </Form>

      <Suspense fallback={<SkeletonTable />}>
        <CalculoData inicio={inicio} fim={fim} />
      </Suspense>
    </div>
  );
}

async function CalculoData({ inicio, fim }: { inicio: string; fim: string }) {
  const data = await Repository.calculo(inicio, fim)

  return <DataGridCalculo data={data as any} />;
}
