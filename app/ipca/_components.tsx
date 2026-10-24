"use client";
import { useDataGrid } from "@/hooks/use-data-grid";
import { useState } from "react";

import { DataGrid as ReactDataGrid, SelectColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";



type Row = {
  mes: string;
  ano_atual: number | string;
  ano_anterior: number | string;
};

export function DataGridIPCA({ meses, ano_atual }: { meses: Row[], ano_atual: number }) {

  const ano_anterior = ano_atual - 1

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
            key: 'ano_anterior',
            name: 'ano_anterior',
            width: 100,
          },
          {
            key: 'ano_atual',
            name: 'ano_atual',
            width: 100,
            editable: true,
          },
        ]}
        rows={meses}
      />
    </div>
  );
}
