"use client";
import { useDataGrid } from "@/hooks/use-data-grid";
import { ano_atual } from "@/lib/constants";
import { useState } from "react";

import { DataGrid as ReactDataGrid, SelectColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";

const ano_anterior = ano_atual - 1;

type Row = {
  mes: string;
  [ano_atual]: number | string;
  [ano_anterior]: number | string;
};

export function DataGridIPCA({ meses }: { meses: Row[] }) {
  return (
    <div className="h-full">
      <ReactDataGrid
        // selectedRows={selecteds}
        // onSelectedRowsChange={rows => setSelecteds(rows)}
        style={{ height: "100%" }}
        rowKeyGetter={(row) => parseInt(row.mes)}
        columns={[
          // SelectColumn,
          { key: "mes", name: "MES", width: 100, sortable: true },
          {
            key: ano_anterior.toString(),
            name: ano_anterior.toString(),
            width: 100,
          },
          {
            key: ano_atual.toString(),
            name: ano_atual.toString(),
            width: 100,
            editable: true,
          },
        ]}
        rows={meses}
      />
    </div>
  );
}
