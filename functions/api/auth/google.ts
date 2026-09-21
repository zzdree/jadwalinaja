interface Env {
  DB?: D1Database;
}

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { credential } = (await context.request.json()) as { credential?: string };

    if (!credential) {
      return new Response(JSON.stringify({ error: 'Token credential required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify token with Google's tokeninfo endpoint at edge
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: 'Token Google tidak valid' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = (await verifyRes.json()) as GoogleTokenPayload;

    const user = {
      id: `usr_${payload.sub}`,
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture || '',
    };

    // If Cloudflare D1 is bound, save/update user in database
    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT INTO users (id, google_id, email, name, picture, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(google_id) DO UPDATE SET
           name = excluded.name,
           picture = excluded.picture,
           updated_at = CURRENT_TIMESTAMP`
      )
        .bind(user.id, user.googleId, user.email, user.name, user.picture)
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        user,
        message: 'Berhasil terautentikasi dengan Google',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
