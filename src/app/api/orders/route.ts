import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import PickupSlot from '@/models/PickupSlot';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await dbConnect();
    const data = await req.json();

    // Verify slot capacity
    const slot = await PickupSlot.findById(data.pickupSlotId);
    if (!slot) return NextResponse.json({ message: 'Slot not found' }, { status: 404 });
    if (slot.currentOrders >= slot.maxOrders) {
      return NextResponse.json({ message: 'Slot is full' }, { status: 400 });
    }

    const orderNumber = 'CX-' + Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      orderNumber,
      studentId: decoded.userId,
      items: data.items,
      totalAmount: data.totalAmount,
      pickupSlotId: data.pickupSlotId,
      status: 'PENDING',
      paymentStatus: 'PAID', // Mock payment
    });

    // Update slot
    slot.currentOrders += 1;
    if (slot.currentOrders >= slot.maxOrders) {
      slot.status = 'FULL';
    }
    await slot.save();

    return NextResponse.json({ order, message: 'Order created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await dbConnect();
    const orders = await Order.find({ studentId: decoded.userId }).populate('pickupSlotId').sort({ createdAt: -1 });
    
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
