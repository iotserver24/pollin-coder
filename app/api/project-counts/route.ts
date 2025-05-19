import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = getPrisma();
    const [generatedAppsCount, chatsCount] = await Promise.all([
      prisma.generatedApp.count(),
      prisma.chat.count()
    ]);
    
    return NextResponse.json({
      totalApps: generatedAppsCount,
      totalChats: chatsCount,
      totalProjects: generatedAppsCount + chatsCount
    });
  } catch (error) {
    console.error('Error fetching project counts:', error);
    return NextResponse.json({
      totalApps: 0,
      totalChats: 0,
      totalProjects: 0
    });
  }
} 