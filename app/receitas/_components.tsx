"use client";
import _, { sumBy } from "lodash";
import { DataGrid as ReactDataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";


type Row = {
  dia: string;
  total: {
    corrigido: number;
    nominal: number;
  };
  iss: {
    corrigido: number;
    nominal: number;
  };
  iptu: {
    corrigido: number;
    nominal: number;
  };
  itbi: {
    corrigido: number;
    nominal: number;
  };
  adicional: {
    corrigido: number;
    nominal: number;
  };
};

const impostos = ["iss", "iptu", "itbi", "adicional", "total"];

export function DataGridReceitas({ data }: { data: Row[] }) {
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
          key: "dia",
          name: "DATA",
          renderCell: (p) => p.row.dia.split("-").reverse().join("/"),
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
              key: `${i}.nominal`,
              name: `NOMINAL`,
              renderCell: (props: any) => (
                <div className="text-right">
                  {" "}
                  {parseFloat(
                    String(_.get(props, `row.${i}.nominal`)),
                  ).toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})}
                </div>
              ),
              renderSummaryCell(props: any) {
                return (
                  <div className="text-right font-bold">
                    {sumBy(data, `${i}.nominal`).toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})}
                  </div>
                );
              },
            },
            {
              key: `${i}.corrigido`,
              name: `CORRIGIDO`,
              renderCell: (props: any) => (
                <div className="text-right">
                  {" "}
                  {parseFloat(
                    String(_.get(props, `row.${i}.corrigido`)),
                  ).toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})}
                </div>
              ),
              renderSummaryCell(props: any) {
                return (
                  <div className="text-right font-bold">
                    {sumBy(data, `${i}.corrigido`).toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})}
                  </div>
                );
              },
            },
          ],
        })),
      ]}
      rows={data}
    />
  );
}
