import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import PickupSlot from '@/models/PickupSlot';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    jwt.verify(token, JWT_SECRET);
    
    await dbConnect();
    const order = await Order.findById(params.id).populate('pickupSlotId');
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
  }
}
