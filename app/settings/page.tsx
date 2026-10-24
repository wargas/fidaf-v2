import { FormLoading } from "@/components/form-loading"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { auth } from "@/lib/auth"
import { getConfig, setConfig } from "@/lib/config"
import { revalidatePath } from "next/cache"
import Form from "next/form"
import { headers } from "next/headers"
import { Suspense } from "react"

export const instant = false

export default async function SettingsPage() {

    return <Suspense>
        <BodyPreferencies />
    </Suspense>
}

async function BodyPreferencies() {
    const session = await auth.api.getSession({
        headers: await headers()
    })


    return <div className="">
        <Suspense fallback={<span>carregando...</span>}>
            {!session ? (
                <div className="flex items-center justify-center min-h-40">Usuario nao logado</div>
            ) : (

                <Suspense fallback={<span>carregando...</span>}>
                    <FormPreferencias />
                </Suspense>
            )}
        </Suspense>
    </div>
}

async function FormPreferencias() {
    const config = await getConfig()

    async function action(data: FormData) {
        'use server'
        const refis = data.get("refis")?.toString()
            .replace(/[^\d,]/g, "")
            .replace(/,/g, ".")

        const ano = data.get("ano")?.toString()

        await setConfig({
            ano: parseInt(ano!),
            refis: parseFloat(refis!)
        })

        revalidatePath('')
    }
    return <Form action={action} className="flex flex-col">
        <Item size={'xs'}>
            <ItemContent>
                <ItemTitle>Ano de referencia</ItemTitle>
                <ItemDescription>Ano atual para o calculo do FIDAF</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Input defaultValue={config.ano} className="max-w-90" name="ano" />
            </ItemActions>
        </Item>
        <ItemSeparator />
        <Item size={`xs`}>
            <ItemContent>
                <ItemTitle>Valor REFIS</ItemTitle>
                <ItemDescription>Valor total do refis apurado no ano de referencia</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Input defaultValue={config.refis.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} className="max-w-90" name="refis" />
            </ItemActions>
        </Item>
        <ItemSeparator />
        <div className="flex justify-end p-4">
            <Button type="submit">
                <FormLoading />
                Salvar Alteracoes</Button>
        </div>
    </Form>
}