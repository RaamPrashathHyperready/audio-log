"use client"

import { useState, useEffect } from "react"
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CallDetailsModal from "./components/call-details-modal"
import AudioPlayer from "./components/audio-player"

export default function CallAnalysisDashboard() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [purchaseIntentFilter, setPurchaseIntentFilter] = useState("all")
  const [timelineFilter, setTimelineFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const getCallQualityColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      const response = await fetch("/api/calls")
      const result = await response.json()
      if (result.success) {
        setCalls(result.data)
      }
    } catch (error) {
      console.error("Error fetching calls:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCallData = (call) => {
    const data = call.my_key || {}
    return {
      id: call._id,
      audiofile_name: data.audiofile_name || "",
      transcript: data.transcript || "",
      language_code: data.language_code || "",
      diarized_transcript: data.diarized_transcript || "",
      result: data.result || {},
    }
  }

  const getPurchaseIntentColor = (intent) => {
    switch (intent?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimelineColor = (timeline) => {
    switch (timeline?.toLowerCase()) {
      case "immediate":
        return "bg-purple-100 text-purple-800"
      case "within 1 week":
        return "bg-blue-100 text-blue-800"
      case "within 1 month":
        return "bg-indigo-100 text-indigo-800"
      case "future":
        return "bg-gray-100 text-gray-800"
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
    }
    return colors[lang] || "bg-gray-100 text-gray-800"
  }

  const getLanguageLabel = (lang) => {
    const labels = {
      "hi-IN": "Hindi",
      "en-IN": "English",
      "ta-IN": "Tamil",
      "ml-IN": "Malayalam",
    }
    return labels[lang] || lang
  }

  const filteredCalls = calls.filter((call) => {
    const callData = getCallData(call)
    const result = callData.result

    // Strict search - exact match for customer number (audiofile_name)
    const matchesSearch =
      !searchTerm ||
      callData.audiofile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callData.audiofile_name.split(".")[0].slice(-10).includes(searchTerm)

    const matchesPurchaseIntent =
      purchaseIntentFilter === "all" ||
      result.conversation_overview?.purchase_intent?.toLowerCase() === purchaseIntentFilter.toLowerCase()

    const matchesTimeline =
      timelineFilter === "all" ||
      result.conversation_overview?.expected_timeline?.toLowerCase() === timelineFilter.toLowerCase()

    return matchesSearch && matchesPurchaseIntent && matchesTimeline
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCalls = filteredCalls.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="w-8 h-8"
          >
            {i}
          </Button>,
        )
      }
    } else {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="w-8 h-8"
        >
          1
        </Button>,
      )

      if (currentPage > 3) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>,
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="w-8 h-8"
          >
            {i}
          </Button>,
        )
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>,
        )
      }

      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="w-8 h-8"
        >
          {totalPages}
        </Button>,
      )
    }

    return buttons
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading call analysis data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-full mx-auto px-2">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">←</button>
            <h1 className="text-xl md:text-2xl font-semibold">Deep Dive Analysis</h1>
          </div>
          <p className="text-gray-600 mb-6">Kalyan 527 Calls - {calls.length} calls analyzed</p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={timelineFilter} onValueChange={setTimelineFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Expected Timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timelines</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="within 1 week">Within 1 week</SelectItem>
                <SelectItem value="within 1 month">Within 1 month</SelectItem>
                <SelectItem value="future">Future</SelectItem>
              </SelectContent>
            </Select>

            <Select value={purchaseIntentFilter} onValueChange={setPurchaseIntentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Purchase Intent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intents</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customer number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_2.5fr_0.5fr] gap-4 px-4 py-3 border-b bg-gray-50 font-medium text-sm text-gray-700">
                <div>CUSTOMER NUMBER</div>
                <div>PRODUCTS DISCUSSED</div>
                <div>PURCHASE INTENT</div>
                <div>EXPECTED TIMELINE</div>
                <div>CALL QUALITY</div>
                <div>CONVERSATION TOPIC</div>
                <div>ACTIONS</div>
              </div>

              {currentCalls.map((call) => {
                const callData = getCallData(call)
                const result = callData.result
                const conversationOverview = result.conversation_overview || {}
                const products = conversationOverview.products_discussed || []
                // Use the audiofile_name without extension as the job_id
                const jobId = callData.audiofile_name.split(".")[0]

                return (
                  <div
                    key={call._id}
                    className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_2.5fr_0.5fr] gap-4 px-4 py-4 border-b hover:bg-gray-50 items-start"
                  >
                    <div className="space-y-2">
                      {/* Customer number and language on top */}
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{jobId}</div>
                        <Badge variant="outline" className={getLanguageColor(callData.language_code)}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {getLanguageLabel(callData.language_code)}
                        </Badge>
                      </div>
                      {/* Audio player below */}
                      <div className="w-full">
                        <AudioPlayer jobId={jobId} />
                      </div>
                    </div>

                    <div>
                      {products.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {products.slice(0, 2).map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-blue-600">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              </svg>
                              {product}
                            </Badge>
                          ))}
                          {products.length > 2 && (
                            <span className="text-sm text-gray-500">+{products.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No products discussed</span>
                      )}
                    </div>

                    <div>
                      <Badge className={getPurchaseIntentColor(conversationOverview.purchase_intent)}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {conversationOverview.purchase_intent || "Unknown"}
                      </Badge>
                    </div>

                    <div>
                      <Badge className={getTimelineColor(conversationOverview.expected_timeline)}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 00-1 1v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {conversationOverview.expected_timeline || "Unknown"}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {result.call_quality?.quality_score || 0}%
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            (result.call_quality?.quality_score || 0) >= 80
                              ? "bg-green-500"
                              : (result.call_quality?.quality_score || 0) >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      {result.call_quality?.issues_detected?.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {result.call_quality.issues_detected.length} issue
                          {result.call_quality.issues_detected.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-700">
                      {conversationOverview.topic || result.top_topics?.[0] || "General conversation"}
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCall(callData)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {filteredCalls.length === 0 && (
            <div className="text-center py-8 text-gray-500">No calls found matching your criteria.</div>
          )}

          {/* Pagination */}
          {filteredCalls.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t bg-gray-50">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="text-sm text-gray-700">Show</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">entries</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedCall && <CallDetailsModal call={selectedCall} onClose={() => setSelectedCall(null)} />}
    </div>
  )
}
