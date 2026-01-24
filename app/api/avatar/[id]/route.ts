import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('dirty_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8080/dirty-code';

    try {
        const res = await fetch(`${backendUrl}/v1/avatars/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: res.status });
        }

        const avatarData = await res.json();
        return NextResponse.json(avatarData);
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
