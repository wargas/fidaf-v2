import { recolhimentoDiario } from "@/drizzle/schema";
import { db } from "@/lib/db";
import _, { sumBy } from "lodash";
import { DataGridReceitas } from "./_components";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { formatDate, startOfMonth, subDays } from "date-fns";
import { between } from "drizzle-orm";
import { InputDate } from "@/components/input-date";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton-table";
import Link from "next/link";
import { ano_atual } from "@/lib/constants";
import { FormLoading } from "@/components/form-loading";

const startMonth = formatDate(startOfMonth(new Date()), "yyyy-MM-dd");
const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd");
const ano_anterior = ano_atual - 1;

export default async function ReceitasPage({
  searchParams,
}: PageProps<"/receitas">) {
  const params = await searchParams;
  const inicio = _.has(params, "inicio") ? String(params.inicio) : startMonth;
  const fim = _.has(params, "fim") ? String(params.fim) : endMonth;

  const ano = parseInt(inicio.substring(0, 4));

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
  const data = await db
    .select()
    .from(recolhimentoDiario)
    .where(between(recolhimentoDiario.data, inicio, fim));

  const dias = Object.keys(_.groupBy(data, "data"))
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
  return <DataGridReceitas data={dias as any} />;
}
