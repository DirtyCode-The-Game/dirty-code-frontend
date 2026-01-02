import { cookies } from 'next/headers';

type User = {
    id: string;
    name: string;
    level: number;
    energy: number;
    money: number;
    reputation: number;
    burnout: number;
};

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) return null;

    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        // Attempt to fetch from real backend
        const res = await fetch(`${backendUrl}/user/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 0 } // Don't cache user profile aggressively
        });

        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.warn("Failed to fetch user from backend, falling back to mock or null");
    }

    // Fallback Mock for Development if Backend is not reachable
    // Remove this in production if strict auth is required
    if (process.env.NODE_ENV === 'development') {
        return {
            id: "1",
            name: "Leo Dev (Server)",
            level: 1,
            energy: 100,
            money: 500,
            reputation: 0,
            burnout: 0,
        };
    }

    return null;
}
