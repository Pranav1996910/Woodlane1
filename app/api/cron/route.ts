import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // 1. Verify the request is coming from Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createClient()
    
    // 2. Query the 'doors' table as shown in your schema
    // We only select the 'id' of one row to keep the request fast and small
    const { data, error } = await supabase
      .from("doors")
      .select("id")
      .limit(1)

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: "Supabase pinged successfully using 'doors' table" 
    })
  } catch (error) {
    console.error("Cron Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to reach Supabase" 
    }, { status: 500 })
  }
}