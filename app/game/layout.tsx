
import { GameShell } from "@/components/GameShell";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function GameLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    // Double check: if middleware fails or backend validation fails implies invalid token
    // But middleware checks for cookie presence only.
    // If backend returns 401, getCurrentUser returns null.
    // So we should redirect if user is null.
    if (!user) {
        redirect('/');
    }

    return (
        <GameShell user={user}>
            {children}
        </GameShell>
    );
}
