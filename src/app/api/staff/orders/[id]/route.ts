import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';
// In a real app we might use Pusher or a global instance of io, 
// but Next.js API routes with socket.io can be tricky. We will assume the frontend 
// handles the socket connection and polling can be used as a fallback.

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'STAFF' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await dbConnect();
    const data = await req.json();
    
    const order = await Order.findByIdAndUpdate(
      params.id, 
      { status: data.status }, 
      { new: true }
    );

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}
