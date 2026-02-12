import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully', success: true },
      { status: 200 }
    );

    response.cookies.set('admin_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during logout', success: false },
      { status: 500 }
    );
  }
}
