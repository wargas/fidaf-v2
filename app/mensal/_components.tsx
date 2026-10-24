"use client";
import { cn } from "cn";
import _, { sumBy } from "lodash";
import { DataGrid as ReactDataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";



type Row = {
  mes: string;
  iss: {
    anterior: number;
    corrente: number;
  };
  iptu: {
    anterior: number;
    corrente: number;
  };
  itbi: {
    anterior: number;
    corrente: number;
  };
  adicionais: {
    anterior: number;
    corrente: number;
  };
  total: {
    anterior: number;
    corrente: number;
  };
  diferenca: number;
};

const impostos = ["iss", "iptu", "itbi", "adicional", "total"];

export function DataGridMensal({ data, ano_atual }: { data: Row[], ano_atual: number }) {

  const ano_anterior = ano_atual - 1;

  return (
    <ReactDataGrid
      style={{ height: "100%" }}
      bottomSummaryRows={[
        {
          id: "total-0",
          total: 0,
        },
      ]}
      columns={[
        {
          key: "mes",
          name: "MES",
          renderCell: (p) => p.row.mes,
          renderSummaryCell(props) {
            return <div className="font-bold">TOTAL</div>;
          },
          frozen: "start",
        },
        ...impostos.map((i) => ({
          key: `${i}.nominal`,
          name: i.toUpperCase(),
          children: [
            {
              key: `${i}.anterior`,
              name: `ANTERIOR`,
              renderHeaderCell: () => (
                <div className="text-center">{ano_anterior}</div>
              ),
              renderCell: (props: any) => (
                <div className="text-right">
                  {" "}
                  {parseFloat(
                    String(_.get(props, `row.${i}.anterior`)),
                  ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              ),
              renderSummaryCell(props: any) {
                return (
                  <div className="text-right font-bold">
                    {sumBy(data, `${i}.anterior`).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                );
              },
            },
            {
              key: `${i}.corrente`,
              name: `CORRENTE`,
              renderHeaderCell: () => (
                <div className="text-center">{ano_atual}</div>
              ),
              renderCell: (props: any) => (
                <div className="text-right">
                  {" "}
                  {parseFloat(
                    String(_.get(props, `row.${i}.corrente`)),
                  ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              ),
              renderSummaryCell(props: any) {
                return (
                  <div className="text-right font-bold">
                    {sumBy(data, `${i}.corrente`).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                );
              },
            },
          ],
        })),
        {
          key: "diferenca",
          name: "INCREMENTO",
          renderCell: (props: any) => {
            const total = parseFloat(String(_.get(props, `row.diferenca`)));
            return (
              <div
                className={cn("text-right font-bold", {
                  "text-red-600": total < 0,
                })}
              >
                {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
          renderSummaryCell(props: any) {
            const total = sumBy(data, `diferenca`);
            return (
              <div
                className={cn("text-right font-bold", {
                  "text-red-600": total < 0,
                })}
              >
                {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
          frozen: "end",
        },
      ]}
      rows={data}
    />
  );
}
