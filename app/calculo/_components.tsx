"use client";

import _ from "lodash";
import { DataGrid as ReactDataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";


type Row = { label: string; value: string };

const impostos = ["iss", "iptu", "itbi", "adicional", "total"];

export function DataGridCalculo({ data }: { data: Row[] }) {
  return (
    <ReactDataGrid
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
