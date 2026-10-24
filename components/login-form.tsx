'use client'
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Spinner } from "./ui/spinner"
import { toast } from "./ui/toast"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [form, setForm] = useState({ email: '', password: '', isLoading: false })

  const { data } = authClient.useSession()

  const router = useRouter()


  async function makeLogin() {
    setForm(f => ({ ...f, isLoading: true }))
    const { error, data } = await authClient.signIn.email({
      email: form.email,
      password: form.password
    })

    if (error) {
      toast.add({
        title: 'Erro',
        description: error.message,
        type: 'error'
      })
    } else {
      toast.add({
        title: 'Sucesso!',
        description: `Logado com sucesso: ${data.user.name}`,
        type: 'success'
      })

      router.refresh()
    }
    // console.log(user.)


    

    setForm(f => ({ ...f, isLoading: false }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="email@examplo.com"
              value={form.email}
              onChange={ev => setForm(f => ({ ...f, email: ev.target.value }))}
              required
            />
          </Field>
          <Field>

            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input id="password"
              type="password"
              required
              value={form.password}
              onChange={ev => setForm(f => ({ ...f, password: ev.target.value }))} />
          </Field>
          <Field>
            <Button onClick={makeLogin} type="button">
              {form.isLoading && (
                <Spinner />
              )}
              Login</Button>
            {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
            {/* <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription> */}
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
