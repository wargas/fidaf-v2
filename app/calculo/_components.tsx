"use client";

import { useTableResize } from "@/lib/table-resize";
import _ from "lodash";
import { useTheme } from "next-themes";
import { DataGrid as ReactDataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";


type Row = { label: string; value: string };


export function DataGridCalculo({ data }: { data: Row[] }) {
  const props = useTableResize(data.length + 3)
  const { theme } = useTheme()


  return (
    <ReactDataGrid
      {...props}
      className={`rdg-${theme}`}
      style={{ height: "70vh" }}
      columns={[
        {
          key: "label",
          name: "LABEL",
          frozen: "start",
          width: 250,

          resizable: true,
        },
        {
          key: "value",
          name: "VALOR",
          width: 250,
        },
      ]}
      rows={data}
    />
  );
}
