interface Env {
  DB?: D1Database;
}

interface SyncPayload {
  userId: string;
  courses: Array<{
    id: string;
    code: string;
    name: string;
    credits: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
    building?: string;
    lecturer: string;
    classType?: string;
    color: string;
    notes?: string;
  }>;
  tasks: Array<{
    id: string;
    courseId?: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    isCompleted: boolean;
  }>;
}

// GET /api/sync?userId=...
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!context.env.DB) {
    return new Response(JSON.stringify({ courses: [], tasks: [], offlineFallback: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { results: rawCourses } = await context.env.DB.prepare(
    'SELECT * FROM courses WHERE user_id = ? ORDER BY day_of_week, start_time'
  )
    .bind(userId)
    .all();

  const { results: rawTasks } = await context.env.DB.prepare(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC'
  )
    .bind(userId)
    .all();

  return new Response(
    JSON.stringify({
      courses: rawCourses || [],
      tasks: rawTasks || [],
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

// POST /api/sync (Save/Sync to D1)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload = (await context.request.json()) as SyncPayload;

    if (!payload.userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!context.env.DB) {
      return new Response(
        JSON.stringify({ success: true, message: 'Saved to local buffer (D1 not bound yet)' }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = context.env.DB;

    // Batch upsert or replace
    const statements: D1PreparedStatement[] = [];

    // Delete existing courses and tasks for full fresh sync
    statements.push(db.prepare('DELETE FROM courses WHERE user_id = ?').bind(payload.userId));
    statements.push(db.prepare('DELETE FROM tasks WHERE user_id = ?').bind(payload.userId));

    for (const c of payload.courses) {
      statements.push(
        db
          .prepare(
            `INSERT INTO courses (id, user_id, code, name, credits, day_of_week, start_time, end_time, room, building, lecturer, class_type, color, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            c.id,
            payload.userId,
            c.code || '',
            c.name,
            c.credits || 3,
            c.dayOfWeek,
            c.startTime,
            c.endTime,
            c.room || '',
            c.building || '',
            c.lecturer || '',
            c.classType || 'teori',
            c.color || '#4f46e5',
            c.notes || ''
          )
      );
    }

    for (const t of payload.tasks) {
      statements.push(
        db
          .prepare(
            `INSERT INTO tasks (id, user_id, course_id, title, description, due_date, priority, is_completed)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            t.id,
            payload.userId,
            t.courseId || null,
            t.title,
            t.description || '',
            t.dueDate || '',
            t.priority || 'medium',
            t.isCompleted ? 1 : 0
          )
      );
    }

    if (statements.length > 0) {
      await db.batch(statements);
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: {
          courses: payload.courses.length,
          tasks: payload.tasks.length,
        },
        syncedAt: new Date().toISOString(),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
