'use client'
import { useFormStatus } from "react-dom";
import { Spinner } from "./ui/spinner";

export function FormLoading() {
    const status = useFormStatus()

    if(!status.pending) return null

    return <Spinner />
}