import { cookies } from 'next/headers';
import { User } from '@/services/api';

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) return null;

    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        // Attempt to fetch from real backend
        const res = await fetch(`${backendUrl}/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 0 }
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

            life: 100,
            stamina: 100,
            addiction: 0,
            karma: 50,

            strength: 10,
            intelligence: 80,
            charisma: 25,

            money: 500,
            burnout: 0,
        };
    }

    return null;
}
