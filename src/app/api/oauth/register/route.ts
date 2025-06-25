import { randomBytes } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { database } from '@/lib/db';
import { clients } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { client_name, redirect_uris } = body;

  if (!client_name || !redirect_uris) {
    const response = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  }

  const clientSecret = randomBytes(32).toString('hex');

  try {
    const now = new Date();
    const [newClient] = await database
      .insert(clients)
      .values({
        name: client_name,
        redirectUris: redirect_uris,
        clientSecret: clientSecret, // This should be hashed in a real app
        userId: null, // Allow unauthenticated clients
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const response = NextResponse.json({
      client_id: newClient.clientId,
      client_secret: clientSecret, // This is the only time the secret is sent
      redirect_uris: redirect_uris,
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (e) {
    console.error(e);
    const response = NextResponse.json({ error: 'Error creating client' }, { status: 500 });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  }
}

export async function OPTIONS(_request: NextRequest) {
  const response = new NextResponse('OK', { status: 200 });

  // Add CORS headers for preflight requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
