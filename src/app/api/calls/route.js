import { MongoClient } from "mongodb"

const uri =
  "mongodb+srv://fastapi:uHxu5.bHEkW-ECc@clusters0.v1ogl.mongodb.net/"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const database = client.db("audio_candere")
    const collection = database.collection("call_analysis")

    const calls = await collection.find({}).toArray()

    return Response.json({ success: true, data: calls })
  } catch (error) {
    console.error("Database connection error:", error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    await client.close()
  }
}
