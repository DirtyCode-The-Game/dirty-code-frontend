'use server'

import { cookies } from 'next/headers';
import { User } from '@/services/api';

const getBackendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/dirty-code';

export async function createAvatarAction(data: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/v1/avatars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create avatar");
    }

    const avatarData = await res.json();

    const currentUserCookie = cookieStore.get('dirty_user_info')?.value;
    let userData: any = {};

    if (currentUserCookie) {
        try {
            userData = JSON.parse(currentUserCookie);
        } catch (e) {
            console.error("Failed to parse existing user cookie", e);
        }
    }

    // Update activeAvatar with the response from createAvatar
    userData.activeAvatar = avatarData;

    return avatarData;
}

export async function updateAvatarAction(data: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const backendUrl = getBackendUrl();

    // Assuming PUT /v1/avatars updates the current user's active avatar or generic avatar update
    // If the backend requires an ID, we might need to change this URL. 
    // Usually PUT /v1/avatars implies updating the current one or we pass the whole object.
    const res = await fetch(`${backendUrl}/v1/avatars`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update avatar");
    }

    const avatarData = await res.json();
    return avatarData;
}
