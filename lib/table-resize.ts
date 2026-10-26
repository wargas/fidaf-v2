import { CSSProperties } from "react"

export function useTableResize(tableLines: number) {

    const rowHeight = 30
    const maxHeight = (rowHeight * tableLines) + (tableLines + 5)

    const style: CSSProperties = {
        height: '100%',
        maxHeight: `${maxHeight}px`
    }

    return {
        style,
        rowHeight: 30
    }

}

//const tableLines = data.length + 3
// const rowHeight = 30
// const maxHeight = (rowHeight * tableLines) + (tableLines + 5)