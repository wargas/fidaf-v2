'use client'
import { useDataGrid } from "@/hooks/use-data-grid";
import { ano_atual } from "@/lib/constants";

import { DataGrid as ReactDataGrid } from "react-data-grid"
import 'react-data-grid/lib/styles.css';

const ano_anterior = ano_atual - 1

type Row = { mes: string, [ano_atual]: number | string, [ano_anterior]: number | string }

export function DataGridIPCA({ meses }: { meses: Row[] }) {

    const { table, ...props } = useDataGrid({
        columns: [
            { accessorKey: "mes", header: "MES" },
            { accessorKey: ano_anterior },
            { accessorKey: ano_atual },
        ],
        data: meses
    })

    return <ReactDataGrid style={{height: '80vh'}} columns={[
        { key: "mes", name: "MES", width: 100 },
        { key: ano_anterior.toString(), name: ano_anterior.toString(), width: 100},
        { key: ano_atual.toString(), name: ano_atual.toString(), width: 100, editable: true},
        
    ]} rows={meses} />
}