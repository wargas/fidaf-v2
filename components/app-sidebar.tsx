import Link from "next/link";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "./ui/sidebar";
import { Calculator, Calendar1Icon, ChartLine, DollarSign, HomeIcon } from "lucide-react";

export function AppSidebar() {
    return <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <span className="font-bold text-2xl">FIDAF</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>MENU</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href={`/dashboard`}>
                                <HomeIcon />
                                Dashboard</Link>} />
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href={`/calculo`}>
                                <Calculator />
                                Cálculo</Link>} />
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href={`/receitas`}>
                                <DollarSign />
                                Receitas diarias</Link>} />
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href={`/mensal`}>
                                <Calendar1Icon />
                                Resumo mensal</Link>} />
                        </SidebarMenuItem>
                        <SidebarSeparator />
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href={`/ipca`}>
                                <ChartLine />
                                IPCA</Link>} />
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
}