'use client'
import { DataGrid } from "@/components/data-grid/data-grid";
import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDataGrid } from "@/hooks/use-data-grid";
import { ano_atual } from "@/lib/constants";
import { DataGridFeatures } from "@/lib/data-grid-features";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate, parse, isValid } from "date-fns";
import _, { sumBy } from "lodash";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataGrid as ReactDataGrid } from "react-data-grid"
import 'react-data-grid/lib/styles.css';

const ano_anterior = ano_atual - 1

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
}

const impostos = ["iss", "iptu", "itbi", "adicional", "total"]


export function DataGridReceitas({ data }: { data: Row[] }) {

    return <ReactDataGrid
        style={{height: '70vh'}}
        bottomSummaryRows={[
            {
                id: "total-0",
                total: 0
            }
        ]}
        columns={[
            {
                key: "dia", name: "DATA", renderCell: p => p.row.dia.split("-").reverse().join("/"),
                renderSummaryCell(props) {
                    return <div className="font-bold">TOTAL</div>
                },
                frozen: "start"
            },
            ...impostos.map(i => ({
                key: `${i}.nominal`, name: i.toUpperCase(),
                children: [
                    {
                        key: `${i}.nominal`,
                        name: `NOMINAL`,
                        renderCell: (props: any) => <div className="text-right"> {parseFloat(String(_.get(props, `row.${i}.nominal`))).toLocaleString()}</div>,
                        renderSummaryCell(props:any) {
                            return <div className="text-right font-bold">{sumBy(data, `${i}.nominal`).toLocaleString()}</div>
                        },
                    },
                    {
                        key: `${i}.corrigido`,
                        name: `CORRIGIDO`,
                        renderCell: (props: any) => <div className="text-right"> {parseFloat(String(_.get(props, `row.${i}.corrigido`))).toLocaleString()}</div>,
                        renderSummaryCell(props:any) {
                            return <div className="text-right font-bold">{sumBy(data, `${i}.corrigido`).toLocaleString()}</div>
                        },
                    },

                ],
            }))
            ,



        ]} rows={data} />
}




