import { ipca } from "@/drizzle/schema";
import { db } from "@/lib/db";
import _ from "lodash";
import { DataGridIPCA } from "./_components";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton-table";
import { getConfig } from "@/lib/config";

const _meses = _.range(1, 13).map((a) => a.toString().padStart(2, "0"));
export default async function IpcaPage({ searchParams }: PageProps<"/ipca">) {


  await searchParams;

  return (
    <div className="h-full">
      <Suspense fallback={<SkeletonTable />}>
        <IPCAData />
      </Suspense>
    </div>
  );
}

async function IPCAData() {
  const config = await getConfig()

  const ano_atual = config.ano
  const data = await db.select().from(ipca);

  const meses = _meses.map((m) => {
    return {
      mes: m,
      ano_anterior: _.find(data, { mes: `${ano_atual - 1}-${m}` })?.indice ?? 0,
      ano_atual: _.find(data, { mes: `${ano_atual}-${m}` })?.indice ?? 0,
    };
  });
  return <DataGridIPCA meses={meses} ano_atual={ano_atual} />;
}
