import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const chatCount = await prisma.chat.count();
    
    return NextResponse.json({ count: chatCount });
  } catch (error) {
    console.error("Error fetching project count:", error);
    return NextResponse.json(
      { error: "Failed to fetch project count" },
      { status: 500 }
    );
  }
} 