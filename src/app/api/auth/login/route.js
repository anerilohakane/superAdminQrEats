import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import SuperAdmin from '@/models/SuperAdmin';
import User from '@/models/User';

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

    // First, try to find in SuperAdmin collection
    let admin = await SuperAdmin.findOne({ email: email.toLowerCase() });
    let isPasswordValid = false;
    let isSuperAdmin = true;

    if (admin) {
      // Verify bcrypt password for SuperAdmin
      isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log(`[SuperAdmin Login] Found in SuperAdmin collection`);
    } else {
      // Fallback: Check User collection (cafe owners) with plain text password
      console.log(`[SuperAdmin Login] Not found in SuperAdmin, checking User collection...`);
      const user = await User.findOne({ username: email });
      
      if (user && user.password === password) {
        // Create admin object from user for consistency
        admin = {
          _id: user._id,
          email: user.username,
          name: user.cafeName || user.username,
        };
        isPasswordValid = true;
        isSuperAdmin = false;
        console.log(`[SuperAdmin Login] Found in User collection (cafe owner)`);
      }
    }

    if (!admin) {
      console.log(`[SuperAdmin Login] Failed: Account not found - ${email}`);
      return NextResponse.json(
        { message: 'Invalid credentials', success: false },
        { status: 401 }
      );
    }

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
        role: 'super_admin',
        source: isSuperAdmin ? 'superadmin' : 'user'
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`[SuperAdmin Login] Success: ${email} (source: ${isSuperAdmin ? 'SuperAdmin' : 'User'})`);

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
