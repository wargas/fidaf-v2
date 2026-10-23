import { redirect } from "next/navigation";

export default async function Home(props: PageProps<"/">) {
  redirect("/dashboard");
}
