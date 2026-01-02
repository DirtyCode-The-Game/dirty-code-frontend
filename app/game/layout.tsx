
import { GameShell } from "@/components/GameShell";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function GameLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/');
    }

    return (
        <GameShell user={user}>
            {children}
        </GameShell>
    );
}
