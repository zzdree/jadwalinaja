-- D1 Database Migration: Initial Schema for JadwalinAja

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    semester_id TEXT,
    code TEXT,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    day_of_week INTEGER NOT NULL, -- 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu, 7 = Minggu
    start_time TEXT NOT NULL, -- HH:mm format, e.g. "08:00"
    end_time TEXT NOT NULL,   -- HH:mm format, e.g. "09:40"
    room TEXT,
    building TEXT,
    lecturer TEXT,
    class_type TEXT DEFAULT 'teori', -- 'teori', 'praktikum', 'seminar', 'online'
    color TEXT DEFAULT '#4f46e5',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT, -- YYYY-MM-DD or ISO string
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    is_completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
);

-- Indexing for high-speed edge lookups
CREATE INDEX IF NOT EXISTS idx_courses_user ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_day ON courses(user_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_course ON tasks(course_id);
