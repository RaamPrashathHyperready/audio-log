"use client"

import { X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AudioPlayer from "./audio-player"

export default function CallDetailsModal({ call, onClose }) {
  if (!call) return null

  const result = call.result || {}
  const callDetails = result.call_details || {}
  const conversationOverview = result.conversation_overview || {}
  const customerIntent = result.customer_intent || {}
  const sentimentAnalysis = result.sentiment_analysis || {}
  const actionItems = result.action_items || []
  const callQuality = result.call_quality || {}
  const productInfo = result.product_info || []

  // Get job ID from audiofile_name
  const jobId = call.audiofile_name?.split(".")[0] || ""
  const customerNumber = jobId.slice(-10)

  const formatDiarizedTranscript = (transcript) => {
    if (!transcript) return []
    return transcript.split("\n").filter((line) => line.trim())
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case "ready to purchase":
        return "bg-green-100 text-green-800"
      case "support":
        return "bg-blue-100 text-blue-800"
      case "inquiry":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLanguageColor = (lang) => {
    const colors = {
      "hi-IN": "bg-orange-100 text-orange-800",
      "en-IN": "bg-blue-100 text-blue-800",
      "ta-IN": "bg-green-100 text-green-800",
      "ml-IN": "bg-purple-100 text-purple-800",
      "te-IN": "bg-purple-100 text-purple-800",
    }
    return colors[lang] || "bg-gray-100 text-gray-800"
  }

  const getLanguageLabel = (lang) => {
    const labels = {
      "hi-IN": "Hindi",
      "en-IN": "English",
      "ta-IN": "Tamil",
      "ml-IN": "Malayalam",
      "te-IN": "Telugu",
    }
    return labels[lang] || lang
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Mock duration - you can calculate this from audio metadata
  const mockDuration = "2 minutes 20 seconds"

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Call Analytics - Sureshkumar ({customerNumber})</h2>
              <p className="text-gray-600 mt-1">Detailed analysis of the selected call</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] rounded-b-lg">
          <div className="p-6 space-y-6">
            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Call Details */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Call Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Source Language</div>
                    <Badge className={getLanguageColor(call.language_code)}>
                      {getLanguageLabel(call.language_code)}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Duration</div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{mockDuration}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-3">Audio Playback</div>
                    <AudioPlayer jobId={jobId} variant="modal" />
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversation Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Topic</div>
                    <div className="mt-1 text-sm">{conversationOverview.topic || "General conversation"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Purchase Intent</div>
                    <Badge
                      className={`mt-1 ${conversationOverview.purchase_intent === "High" ? "bg-green-100 text-green-800" : conversationOverview.purchase_intent === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                    >
                      {conversationOverview.purchase_intent || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Expected Timeline</div>
                    <Badge variant="outline" className="mt-1">
                      {conversationOverview.expected_timeline || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Products Discussed</div>
                    <div className="mt-1 space-y-1">
                      {conversationOverview.products_discussed?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {conversationOverview.products_discussed.map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No products discussed</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Intent */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Intent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Stage</div>
                    <Badge className={`mt-1 ${getStageColor(customerIntent.stage)}`}>
                      {customerIntent.stage || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Timeline</div>
                    <Badge variant="outline" className="mt-1">
                      {customerIntent.timeline || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Language</div>
                    <Badge variant="outline" className="mt-1">
                      {customerIntent.language || "Unknown"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Positive Points</div>
                    {sentimentAnalysis.key_feedback?.positive_points?.length > 0 ? (
                      <ul className="space-y-1">
                        {sentimentAnalysis.key_feedback.positive_points.map((point, idx) => (
                          <li key={idx} className="text-sm text-green-700">
                            • {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">No positive points identified</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Concerns</div>
                    {sentimentAnalysis.key_feedback?.concerns?.length > 0 ? (
                      <ul className="space-y-1">
                        {sentimentAnalysis.key_feedback.concerns.map((concern, idx) => (
                          <li key={idx} className="text-sm text-red-700">
                            • {concern}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">No concerns identified</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Key Discussion Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Discussion Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-gray-600 mb-2">Sub Section</div>
                  <div className="space-y-2">
                    {result.sub_sections?.map((section, idx) => (
                      <div key={idx} className="text-sm">
                        {section}
                      </div>
                    )) || <span className="text-sm text-gray-500">No discussion points available</span>}
                  </div>
                </CardContent>
              </Card>

              {/* Top Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.top_topics?.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{topic}</span>
                      </div>
                    )) || <span className="text-sm text-gray-500">No topics identified</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Action Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actionItems.length > 0 ? (
                    actionItems.map((item, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(item.urgency)}>{item.urgency || "Medium"}</Badge>
                        </div>
                        <div className="font-medium text-sm">{item.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.context}</div>
                        <div className="text-xs text-gray-400 mt-1">Category: {item.category}</div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No action items</span>
                  )}
                </CardContent>
              </Card>

              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-gray-600 mb-2">Product details</div>
                  {productInfo.length > 0 ? (
                    <div className="space-y-2">
                      {productInfo.map((product, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-600">{product.details}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No product information available</span>
                  )}
                </CardContent>
              </Card>

              {/* Call Quality */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Call Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Quality Score</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-2xl font-bold text-green-600">{callQuality.quality_score || 85}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Issues Detected</div>
                    {callQuality.issues_detected?.length > 0 ? (
                      <ul className="space-y-1">
                        {callQuality.issues_detected.map((issue, idx) => (
                          <li key={idx} className="text-sm text-red-700">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-green-700">No issues detected</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translated Conversation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  Translated Conversation
                  <Badge variant="outline">EN</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded text-sm">
                  {formatDiarizedTranscript(call.diarized_transcript).map((line, idx) => (
                    <div key={idx} className="text-sm">
                      {line}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
