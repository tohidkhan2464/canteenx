import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'STAFF' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await dbConnect();
    // Fetch active orders
    const orders = await Order.find({ status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] } })
      .populate('pickupSlotId')
      .sort({ createdAt: 1 });
    
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching staff orders' }, { status: 500 });
  }
}
