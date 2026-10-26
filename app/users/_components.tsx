"use client";
import { useTableResize } from "@/lib/table-resize";
import { cn } from "cn";
import _, { sumBy } from "lodash";
import { DataGrid as ReactDataGrid, SelectColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { user } from '../../drizzle/schema'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Form from "next/form";
import { useForm } from 'react-hook-form'
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { email, z } from "zod";
import { Trash2 } from "lucide-react";


type Row = typeof user.$inferInsert

export function DataGridUsers({ data }: { data: Row[] }) {

  const props = useTableResize(data.length + 3)

  async function deleteUser(user: Row) {

    

    toast.add({
      description: `user deletado com sucesso`
    })
  }

  return (
    <ReactDataGrid
      style={props.style}
      rowHeight={props.rowHeight}
      columns={[
        { key: 'id', name: 'ID', resizable: true },
        { key: 'name', name: 'NOME' },
        { key: 'email', name: 'Email' },
        { key: 'id', name: '', renderCell: props => <div className="flex justify-end">
          <Button onClick={() => deleteUser(props.row)} variant={'ghost'}><Trash2 /></Button>
        </div>}
      ]}
      rows={data}
    />
  );
}

const schemaUser = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
})

type User = z.infer<typeof schemaUser>

export function FormUser() {

  const params = useSearchParams()
  const router = useRouter()

  const form = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
    
  })

  async function handleSubmit(data: User) {

    const input = schemaUser.safeParse(data)

    if(input.error) {
      toast.add({
        type: 'error',
        description: input.error.message
      })

      router.push("/users")
      form.reset()

      return;
    }

    const insert = await authClient.signUp.email({
      email: data.email,
      name: data.name,
      password: data.password,
    })

    if(insert.error) {
      toast.add({
        type: 'error',
        description: insert.error.message
      })

      router.push("/users")
      form.reset()

      return;
    }

    toast.add({
      description: "Adicionado com sucesso",
      type: "success"
    })

    router.push("/users")
    form.reset()
  }

  return <Dialog open={params.get("action") == "add"} onOpenChange={() => router.push("/users")}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Salvar Usuario</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col" onSubmit={form.handleSubmit(handleSubmit)}>
        <Field>
          <FieldLabel>Nome</FieldLabel>
          <Input {...form.register("name")} />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input {...form.register("email")} />
        </Field>
        <Field>
          <FieldLabel>Senha</FieldLabel>
          <Input {...form.register("password")} />
        </Field>
      </form>
      <DialogFooter>
        <Button onClick={form.handleSubmit(handleSubmit)}>Salvar</Button>
      </DialogFooter>
    </DialogContent>

  </Dialog>
}