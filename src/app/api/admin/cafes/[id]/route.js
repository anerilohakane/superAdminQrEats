import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cafe from '@/models/Cafe';
import User from '@/models/User';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { status } = await req.json();
    const { id } = await params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    let item;
    
    // Try Cafe collection first
    console.log(`[PATCH] Attempting update: ID=${id}, Status=${status}`);
    item = await Cafe.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (item) {
      console.log(`[PATCH] Success: Updated Cafe record`);
    } else {
      console.log(`[PATCH] ID not found in Cafe collection, trying direct User collection update...`);
      // Use direct collection access to bypass potential model mismatches
      const { ObjectId } = (await import('mongodb'));
      const db = (await dbConnect()).connection.db;
      const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: 'after' }
      );
      
      item = result;
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
