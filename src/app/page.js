import { redirect } from "next/navigation";

/** Homepage always lands on the main player hub (journey + modes + tracks). */
export default function Home() {
  redirect("/inicio");
}
