"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogInIcon,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useState } from "react"
import { LoginForm } from "@/components/login-form"

export function NavUser() {
    const { isMobile } = useSidebar()
    const { data } = authClient.useSession()
    const router = useRouter()
    const [open, setOpen] = useState(false)


    const user = data?.user

    async function handleLogout() {
        await authClient.signOut()
        router.refresh()
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    {!user && (
                        <SidebarMenuButton onClick={() => setOpen(true)}>
                            <LogInIcon />
                            Entrar</SidebarMenuButton>
                    )}
                    {!!user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                                    <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>} />
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >


                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                                                <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{user.name}</span>
                                                <span className="truncate text-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    {/* <DropdownMenuSeparator />ß */}
                                    {/* <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem> */}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck />
                                        Conta
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem> */}
                                    <DropdownMenuItem>
                                        <Bell />
                                        Alertas
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </SidebarMenuItem>
            </SidebarMenu>

            <Dialog open={open && !user} onOpenChange={setOpen}>
                <DialogContent>

                    <DialogHeader>
                        <DialogTitle>Fazer Login</DialogTitle>
                    </DialogHeader>
                    <LoginForm />
                </DialogContent>
            </Dialog>
        </>
    )
}
