import { Repository } from "@/lib/db";
import _ from "lodash";
import { DataGridMensal } from "./_components";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { formatDate, subDays } from "date-fns";
import { InputDate } from "@/components/input-date";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton-table";
import { FormLoading } from "@/components/form-loading";
import { getConfig } from "@/lib/config";
import { ano_atuals } from "@/lib/constants";

const endMonth = formatDate(subDays(new Date(), 1), "yyyy-MM-dd");

export default async function MensalPage({
  searchParams,
}: PageProps<"/receitas">) {
  const params = await searchParams;

  const config = await getConfig()

  const ano_atual = config.ano

  const limit = _.has(params, "limit") ? String(params.limit) : endMonth;

  return (
    <div className="flex flex-col h-full">
      <Form action={``} className="p-4 border-b flex gap-2">
        <InputDate defaultValue={limit} name="limit" />

        <Button type="submit">
          <FormLoading />
          <FilterIcon />
          Filtrar
        </Button>
      </Form>

      <Suspense fallback={<SkeletonTable />}>
        <MensalData limit={limit} />
      </Suspense>
    </div>
  );
}

async function MensalData({ limit }: { limit: string }) {
  const meses = await Repository.receitasMensal(limit)

  return <DataGridMensal data={meses as any} ano_atual={ano_atuals} />;
}
