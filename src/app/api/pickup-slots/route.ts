import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PickupSlot from '@/models/PickupSlot';

export async function GET() {
  try {
    await dbConnect();
    // For MVP, just return all available slots
    const slots = await PickupSlot.find({ status: 'AVAILABLE' }).sort({ startTime: 1 });
    return NextResponse.json({ slots });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching pickup slots' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Seed functionality
    if (data.seed) {
      await PickupSlot.create([
        { startTime: '1:00 PM', endTime: '1:10 PM', maxOrders: 15, currentOrders: 14 },
        { startTime: '1:10 PM', endTime: '1:20 PM', maxOrders: 15, currentOrders: 7 },
        { startTime: '1:20 PM', endTime: '1:30 PM', maxOrders: 15, currentOrders: 3 },
      ]);
      return NextResponse.json({ message: 'Pickup slots seeded' }, { status: 201 });
    }

    const slot = await PickupSlot.create(data);
    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating pickup slot' }, { status: 500 });
  }
}
