'use client'
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  Calculator,
  Calendar1Icon,
  ChartLine,
  DollarSign,
  HomeIcon,
  Settings2Icon,
  User2Icon,
} from "lucide-react";
import { NavUser } from "./nav-user";
import { authClient } from "@/lib/auth-client";

export function AppSidebar() {

  const { data } = authClient.useSession()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
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
                <SidebarMenuButton
                  render={
                    <Link href={`/dashboard`}>
                      <HomeIcon />
                      Dashboard
                    </Link>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href={`/calculo`}>
                      <Calculator />
                      Cálculo
                    </Link>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href={`/receitas`}>
                      <DollarSign />
                      Receitas diarias
                    </Link>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href={`/mensal`}>
                      <Calendar1Icon />
                      Resumo mensal
                    </Link>
                  }
                />
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href={`/ipca`}>
                      <ChartLine />
                      IPCA
                    </Link>
                  }
                />
              </SidebarMenuItem>
              {!!data?.user && (
                <>
                <SidebarSeparator />
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={
                        <Link href={`/settings`}>
                          <Settings2Icon />
                          Preferencias
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={
                        <Link href={`/users`}>
                          <User2Icon />
                          Usuarios
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

        <NavUser />

      </SidebarFooter>
    </Sidebar>
  );
}
