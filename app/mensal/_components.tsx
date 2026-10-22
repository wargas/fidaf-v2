'use client'
import { DataGrid } from "@/components/data-grid/data-grid";
import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDataGrid } from "@/hooks/use-data-grid";
import { ano_atual } from "@/lib/constants";
import { DataGridFeatures } from "@/lib/data-grid-features";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "cn";
import { formatDate, parse, isValid } from "date-fns";
import _, { sumBy } from "lodash";
import { ArrowDown, ArrowUpZa, CalendarIcon, SortDesc } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataGrid as ReactDataGrid, renderHeaderCell } from "react-data-grid"
import 'react-data-grid/lib/styles.css';

const ano_anterior = ano_atual - 1

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
    diferenca: number
}

const impostos = ["iss", "iptu", "itbi", "adicional", "total"]


export function DataGridMensal({ data }: { data: Row[] }) {

    return <ReactDataGrid
        style={{ height: '70vh' }}
        bottomSummaryRows={[
            {
                id: "total-0",
                total: 0
            }
        ]}
        columns={[
            {
                key: "mes", name: "MES", renderCell: p => p.row.mes,
                renderSummaryCell(props) {
                    return <div className="font-bold">TOTAL</div>
                },                
                frozen: "start",                
            },
            ...impostos.map(i => ({
                key: `${i}.nominal`, 
                name: i.toUpperCase(),
                children: [
                    {
                        key: `${i}.anterior`,
                        name: `ANTERIOR`,
                        renderHeaderCell: () => <div className="text-center">{ano_anterior}</div>,
                        renderCell: (props: any) => <div className="text-right"> {parseFloat(String(_.get(props, `row.${i}.anterior`))).toLocaleString()}</div>,
                        renderSummaryCell(props: any) {
                            return <div className="text-right font-bold">{sumBy(data, `${i}.anterior`).toLocaleString()}</div>
                        },
                    },
                    {
                        key: `${i}.corrente`,
                        name: `CORRENTE`,
                        renderHeaderCell: () => <div className="text-center">{ano_atual}</div>,
                        renderCell: (props: any) => <div className="text-right"> {parseFloat(String(_.get(props, `row.${i}.corrente`))).toLocaleString()}</div>,
                        renderSummaryCell(props: any) {
                            return <div className="text-right font-bold">{sumBy(data, `${i}.corrente`).toLocaleString()}</div>
                        },
                    },

                ],
            })),
            {
                key: 'diferenca', name: 'INCREMENTO',
                renderCell: (props: any) => {
                    const total = parseFloat(String(_.get(props, `row.diferenca`)))
                    return <div className={cn("text-right font-bold", {'text-red-600': total < 0})}>
                        
                         {total.toLocaleString()}</div>
                },
                renderSummaryCell(props: any) {
                    const total = sumBy(data, `diferenca`)
                    return <div className={cn("text-right font-bold", {'text-red-600': total < 0})}>{total.toLocaleString()}</div>
                },
                frozen: "end"
            }

        ]} rows={data} />
}




