"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const competitiveIntelligence = result.competitive_intelligence || {}

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-lg md:text-xl font-semibold">
            Call Analytics - {call.audiofile_name?.split(".")[0] || "Unknown"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Call Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Call Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Source Language</div>
                  <Badge variant="outline" className="mt-1">
                    {callDetails.source_language || call.language_code || "Unknown"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Conversation Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Conversation Overview</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Customer Intent</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Key Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Key Feedback</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Key Discussion Points</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Top Topics</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Action Items</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Product Information</CardTitle>
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
                <CardTitle className="text-base md:text-lg">Call Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Quality Score</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      {callQuality.quality_score || 85}%
                    </div>
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

          {/* Translated Conversation - Moved to the end */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base md:text-lg">
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
  )
}
