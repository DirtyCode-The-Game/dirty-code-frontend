'use server'

import { cookies } from 'next/headers';

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

    cookieStore.set('dirty_user_info', JSON.stringify(userData), {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

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

    const currentUserCookie = cookieStore.get('dirty_user_info')?.value;
    if (currentUserCookie) {
        try {
            const userData = JSON.parse(currentUserCookie);
            userData.activeAvatar = avatarData;
            cookieStore.set('dirty_user_info', JSON.stringify(userData), {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
        } catch (e) {
            console.error("Failed to update user cookie", e);
        }
    }

    return avatarData;
}

export async function increaseAttributeAction(attribute: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const attributeMapping: { [key: string]: string } = {
        'FOR': 'STRENGTH',
        'INT': 'INTELLIGENCE',
        'CHA': 'CHARISMA',
        'DIS': 'STEALTH'
    };

    const backendAttribute = attributeMapping[attribute] || attribute;

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/v1/avatars/attributes/increase?attribute=${backendAttribute}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to increase attribute");
    }

    const avatarData = await res.json();

    const currentUserCookie = cookieStore.get('dirty_user_info')?.value;
    if (currentUserCookie) {
        try {
            const userData = JSON.parse(currentUserCookie);
            userData.activeAvatar = avatarData;
            cookieStore.set('dirty_user_info', JSON.stringify(userData), {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
        } catch (e) {
            console.error("Failed to update user cookie", e);
        }
    }

    return avatarData;
}

export async function leaveTimeoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/v1/actions/timeout/leave?payForFreedom=false`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to leave timeout");
    }

    return await res.json();
}

export async function buyFreedomAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/v1/actions/timeout/leave?payForFreedom=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to buy freedom");
    }

    return await res.json();
}

export async function checkAvatarNameAction(name: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/v1/avatars/check-name?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        return { available: true };
    }

    return await res.json();
}
