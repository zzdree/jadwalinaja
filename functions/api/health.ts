interface Env {
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'JadwalinAja Edge API',
      timestamp: new Date().toISOString(),
      d1Connected: !!context.env.DB,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};
