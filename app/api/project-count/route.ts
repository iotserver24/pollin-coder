import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = getPrisma();
    
    // Test database connectivity first
    await prisma.$connect();
    
    // Get the count with additional validation
    const count = await prisma.chat.count();
    
    // Log the count for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Project count fetched: ${count}`);
    }
    
    // Set cache control headers to prevent caching
    const response = NextResponse.json({ 
      count,
      timestamp: new Date().toISOString(),
      source: 'database'
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching project count:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = NextResponse.json({ 
      count: 0, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return errorResponse;
  } finally {
    // Ensure we disconnect from the database
    try {
      const prisma = getPrisma();
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 