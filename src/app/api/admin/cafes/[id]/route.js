import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cafe from '@/models/Cafe';
import User from '@/models/User';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { status } = await req.json();
    const { id } = await params;

    if (!['approved', 'rejected', 'pending', 'paused'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    // Use direct database access to bypass stale Mongoose schema validation
    const { ObjectId } = (await import('mongodb'));
    const conn = await dbConnect();
    // Handle both Mongoose instance and Connection object
    const db = conn.connection ? conn.connection.db : conn.db;
    
    let item;

    // Try Cafe collection first
    console.log(`[PATCH] Attempting update: ID=${id}, Status=${status}`);
    const cafeResult = await db.collection('cafes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    item = cafeResult;

    if (item) {
      console.log(`[PATCH] Success: Updated Cafe record`);
    } else {
      console.log(`[PATCH] ID not found in Cafe collection, trying direct User collection update...`);
      const userResult = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: 'after' }
      );
      
      item = userResult;
      if (item) {
        console.log(`[PATCH] Success: Updated User via direct collection access: ${item.username || id}`);
      }
    }

    if (!item) {
      console.log(`[PATCH] Error: No record found with ID ${id} in either collection`);
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    console.error('Update cafe status error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update cafe status' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    let item = await Cafe.findByIdAndDelete(id);

    if (!item) {
      const User = (await import('@/models/User')).default;
      item = await User.findByIdAndDelete(id);
    }

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete cafe error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete cafe' }, { status: 500 });
  }
}
