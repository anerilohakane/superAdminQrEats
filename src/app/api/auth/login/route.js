import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || "admin@cafeneesh.in";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "yash@baban";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (email === ADMIN_ID && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: 'super_admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      const response = NextResponse.json(
        { message: 'Login successful', success: true },
        { status: 200 }
      );

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Invalid credentials', success: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login', success: false },
      { status: 500 }
    );
  }
}
