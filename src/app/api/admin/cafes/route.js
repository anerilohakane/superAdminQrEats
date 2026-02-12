import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Cafe from '@/models/Cafe';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let cafeQuery = {};
    let userQuery = {};

    if (status && status !== 'all') {
      cafeQuery.status = status;
      userQuery.status = status;
    }

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      cafeQuery.$or = [
        { name: regex },
        { ownerName: regex },
        { email: regex },
      ];
      userQuery.$or = [
        { cafeName: regex },
        { username: regex },
      ];
    }

    // Fetch from both collections
    const [cafes, users] = await Promise.all([
      Cafe.find(cafeQuery).sort({ createdAt: -1 }),
      User.find(userQuery).sort({ createdAt: -1 }).lean()
    ]);

    // Format users to match cafe structure
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.cafeName,
      ownerName: user.username,
      email: user.username, // Assuming username is email
      phone: user.phone || 'N/A',
      address: user.address || 'No address provided',
      status: user.status || 'pending',
      createdAt: user.createdAt,
      source: 'integrated',
    }));

    const allData = [...cafes, ...formattedUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, data: allData }, { status: 200 });
  } catch (error) {
    console.error('Fetch cafes error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch cafes' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const cafe = await Cafe.create(body);
    return NextResponse.json({ success: true, data: cafe }, { status: 201 });
  } catch (error) {
    console.error('Create cafe error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create cafe' }, { status: 400 });
  }
}
