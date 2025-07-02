import { MongoClient } from "mongodb"

const uri =
  "mongodb+srv://raamprashatht:qiw24dSeWKhXOSKR@audiocluster.zcrdmjx.mongodb.net/?retryWrites=true&w=majority&appName=audioClusteri"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const database = client.db("audio")
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
