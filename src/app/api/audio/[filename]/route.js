import { supabase } from "@/lib/supabase"

export async function GET(request, { params }) {
  try {
    const { filename } = await params

    console.log("Fetching audio for filename:", filename)

    // Get the public URL for the audio file
    const { data } = supabase.storage.from("audio").getPublicUrl(`${filename}.mp3`)

    console.log("Supabase response:", data)

    if (!data?.publicUrl) {
      console.error("No public URL returned for:", filename)
      return Response.json({ success: false, error: "Audio file not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      audioUrl: data.publicUrl,
    })
  } catch (error) {
    console.error("Error fetching audio:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
