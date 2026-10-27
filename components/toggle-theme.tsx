'use client'

import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { MoonIcon } from "lucide-react"

export function ToggleTheme() {
    const { setTheme, theme } = useTheme()

    return <Button variant={'ghost'} onClick={(t) => setTheme(t => t == "dark" ? "light" : "dark")}>
        <MoonIcon />
    </Button>
}