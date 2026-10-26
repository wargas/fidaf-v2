import { user } from "@/drizzle/schema"
import { db } from "@/lib/db"
import { DataGridUsers, FormUser } from "./_components"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function UsersPage({ searchParams}: PageProps<"/users">) {
    
    await searchParams;

    const users = await db.select().from(user)

    return <div>
        <div className="flex items-center justify-end p-4">
            <Button variant={`outline`} render={<Link href={`users?action=add`}>Adicionar</Link>} />
        </div>
        <DataGridUsers data={users} />
        <FormUser />
    </div>
}