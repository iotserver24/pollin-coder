import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = getPrisma();
    const count = await prisma.chat.count();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching project count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
} 