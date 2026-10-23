import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/lib/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, school, city, country } = body;

    // Validate required fields
    if (!name || !email || !password || !school || !city) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Attempt to check email uniqueness (auto-creating tables if not initialized yet)
    let existing = null;
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);
      existing = results[0];
    } catch (err: any) {
      if (err?.message?.includes('does not exist')) {
        await ensureDatabaseTables();
      } else {
        throw err;
      }
    }

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        school: school.trim(),
        city: city.trim(),
        country: (country || 'Morocco').trim(),
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
