import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import SuperAdmin from '@/models/SuperAdmin';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields', success: false },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters', success: false },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin with this email already exists', success: false },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await SuperAdmin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log(`[SuperAdmin Registration] New admin created: ${email}`);

    return NextResponse.json(
      { 
        message: 'Super Admin account created successfully', 
        success: true,
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SuperAdmin Registration] Error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration', success: false },
      { status: 500 }
    );
  }
}
