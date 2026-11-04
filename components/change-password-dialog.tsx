'use client'

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "./ui/spinner"
import { toast } from "./ui/toast"

const MIN_PASSWORD_LENGTH = 8

const initialForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  revokeOtherSessions: true,
  isLoading: false,
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState(initialForm)

  const tooShort = form.newPassword.length > 0 && form.newPassword.length < MIN_PASSWORD_LENGTH
  const mismatch = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword
  const canSubmit = !!form.currentPassword
    && form.newPassword.length >= MIN_PASSWORD_LENGTH
    && form.newPassword === form.confirmPassword
    && !form.isLoading

  function handleOpenChange(value: boolean) {
    if (!value) setForm(initialForm)
    onOpenChange(value)
  }

  async function changePassword(ev: React.FormEvent) {
    ev.preventDefault()
    if (!canSubmit) return

    setForm(f => ({ ...f, isLoading: true }))
    const { error } = await authClient.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      revokeOtherSessions: form.revokeOtherSessions,
    })

    if (error) {
      toast.add({
        title: 'Erro',
        description: error.message,
        type: 'error'
      })
      setForm(f => ({ ...f, isLoading: false }))
      return
    }

    toast.add({
      title: 'Sucesso!',
      description: 'Senha alterada com sucesso',
      type: 'success'
    })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Informe sua senha atual e escolha uma nova senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={changePassword}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current-password">Senha atual</FieldLabel>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={form.currentPassword}
                onChange={ev => setForm(f => ({ ...f, currentPassword: ev.target.value }))}
              />
            </Field>
            <Field data-invalid={tooShort || undefined}>
              <FieldLabel htmlFor="new-password">Nova senha</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={tooShort || undefined}
                value={form.newPassword}
                onChange={ev => setForm(f => ({ ...f, newPassword: ev.target.value }))}
              />
              {tooShort && (
                <FieldError>A senha deve ter pelo menos {MIN_PASSWORD_LENGTH} caracteres</FieldError>
              )}
            </Field>
            <Field data-invalid={mismatch || undefined}>
              <FieldLabel htmlFor="confirm-password">Confirmar nova senha</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={mismatch || undefined}
                value={form.confirmPassword}
                onChange={ev => setForm(f => ({ ...f, confirmPassword: ev.target.value }))}
              />
              {mismatch && (
                <FieldError>As senhas não coincidem</FieldError>
              )}
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="revoke-other-sessions"
                checked={form.revokeOtherSessions}
                onCheckedChange={checked => setForm(f => ({ ...f, revokeOtherSessions: checked }))}
              />
              <FieldLabel htmlFor="revoke-other-sessions" className="font-normal">
                Encerrar sessões em outros dispositivos
              </FieldLabel>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {form.isLoading && (
                <Spinner />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
