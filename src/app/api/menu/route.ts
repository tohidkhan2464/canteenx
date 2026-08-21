import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    // Populate category if needed, for MVP we can just fetch all
    const items = await MenuItem.find({ isAvailable: true }).populate('categoryId');
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching menu items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Quick seed functionality for MVP
    if (data.seed) {
      const category = await Category.create({ name: 'Snacks' });
      await MenuItem.create([
        { categoryId: category._id, name: 'Veg Sandwich', description: 'Fresh grilled vegetable sandwich.', price: 40 },
        { categoryId: category._id, name: 'Cold Coffee', description: 'Refreshing cold coffee.', price: 50 },
        { categoryId: category._id, name: 'Burger', description: 'Classic veg burger.', price: 60 }
      ]);
      return NextResponse.json({ message: 'Menu seeded' }, { status: 201 });
    }

    let categoryId = data.categoryId;
    if (!categoryId) {
      let defaultCategory = await Category.findOne({ name: 'General' });
      if (!defaultCategory) {
        defaultCategory = await Category.create({ name: 'General' });
      }
      categoryId = defaultCategory._id;
    }

    const newItem = await MenuItem.create({ ...data, categoryId });
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item', error);
    return NextResponse.json({ message: 'Error creating menu item' }, { status: 500 });
  }
}
