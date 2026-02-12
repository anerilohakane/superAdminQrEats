import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import SuperAdmin from '@/models/SuperAdmin';

const JWT_SECRET = process.env.JWT_SECRET || "qreats_super_admin_secret_key_2026";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log(`[SuperAdmin Login] Attempt: ${email}`);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password', success: false },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find admin by email
    const admin = await SuperAdmin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log(`[SuperAdmin Login] Failed: Admin not found - ${email}`);
      return NextResponse.json(
        { message: 'Invalid credentials', success: false },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      console.log(`[SuperAdmin Login] Failed: Invalid password for ${email}`);
      return NextResponse.json(
        { message: 'Invalid credentials', success: false },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'super_admin' 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`[SuperAdmin Login] Success: ${email}`);

    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        success: true,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        }
      },
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
  } catch (error) {
    console.error('[SuperAdmin Login] Error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login', success: false },
      { status: 500 }
    );
  }
}
