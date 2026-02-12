import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Cafe from '@/models/Cafe';

export async function GET() {
  try {
    console.log('[Stats API] Starting data fetch...');
    await dbConnect();
    console.log('[Stats API] Database connected');

    // Fetch stats in parallel from both collections
    const [
      localCafes,
      pendingCafes,
      approvedCafes,
      totalUsers,
      pendingUsers,
      approvedUsers,
      recentCafes,
      recentUsers
    ] = await Promise.all([
      Cafe.countDocuments(),
      Cafe.countDocuments({ status: 'pending' }),
      Cafe.countDocuments({ status: 'approved' }),
      User.countDocuments(),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ status: 'approved' }),
      Cafe.find().sort({ createdAt: -1 }).limit(5).lean(),
      User.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    console.log('[Stats API] Cafe counts - Total:', localCafes, 'Pending:', pendingCafes, 'Approved:', approvedCafes);
    console.log('[Stats API] User counts - Total:', totalUsers, 'Pending:', pendingUsers, 'Approved:', approvedUsers);
    console.log('[Stats API] Recent cafes:', recentCafes.length);
    console.log('[Stats API] Recent users:', recentUsers.length);

    const totalCafes = localCafes + totalUsers;
    const totalPending = pendingCafes + pendingUsers;
    const totalApproved = approvedCafes + approvedUsers;

    console.log('[Stats API] Combined - Total:', totalCafes, 'Pending:', totalPending, 'Approved:', totalApproved);

    // Format recent requests (merge and sort)
    const formattedRecentUsers = recentUsers.map(user => ({
      _id: user._id,
      name: user.cafeName,
      ownerName: user.username,
      status: user.status || 'pending',
      createdAt: user.createdAt,
      source: 'integrated'
    }));

    const recentRequests = [...recentCafes, ...formattedRecentUsers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    console.log('[Stats API] Recent requests:', recentRequests.length);

    // Simple revenue calculation logic (example: 5k per approved cafe)
    const estimatedRevenue = totalApproved * 5000;
    const formattedRevenue = `₹${(estimatedRevenue / 100000).toFixed(1)}L`;

    const response = {
      success: true,
      data: {
        totalCafes,
        pendingApprovals: totalPending,
        activeSubscribers: totalApproved,
        totalRevenue: formattedRevenue,
        recentRequests
      }
    };

    console.log('[Stats API] Sending response:', JSON.stringify(response));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch statistics' }, { status: 500 });
  }
}
