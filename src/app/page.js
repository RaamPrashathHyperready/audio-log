"use client"

import { useState, useEffect } from "react"
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import CallDetailsModal from "@/app/components/call-details-modal"
import AudioPlayer from "@/app/components/audio-player"

export default function CallAnalysisDashboard() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [purchaseIntentFilter, setPurchaseIntentFilter] = useState("all")
  const [timelineFilter, setTimelineFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // ============================================================================
  // DASHBOARD DATA - MODIFY THESE VALUES TO UPDATE THE DASHBOARD
  // ============================================================================

  // Main statistics cards - Update these numbers as needed (ICONS REMOVED)
  const dashboardStats = {
    totalCalls: 1603,
    uniqueTopics: 216,
    languages: 10,
    totalDuration: "2 days 4 hours 36 minutes 6 seconds",
  }

  // Bar chart data - Add/remove/modify entries as needed (NOW 10 ENTRIES)
  const topicCardData = [
    { name: "Online Purchase Process", percentage: 24.32, color: "#6366F1" }, // ~9/37
    { name: "Payment Methods and Failures", percentage: 13.51, color: "#6366F1" }, // ~5/37
    { name: "Coupon Code Usage and Discounts", percentage: 10.81, color: "#6366F1" }, // ~4/37
    { name: "Product Availability (Online vs. In-Store)", percentage: 10.81, color: "#6366F1" }, // ~4/37
    { name: "Order Tracking and Delivery Status", percentage: 10.81, color: "#6366F1" }, // ~4/37
    { name: "Refunds and Price Adjustments", percentage: 10.81, color: "#6366F1" }, // ~4/37
    { name: "Jewelry Schemes and Pre-Booked Orders", percentage: 8.11, color: "#6366F1" }, // ~3/37
    { name: "Account Issues (Login and Registration)", percentage: 8.11, color: "#6366F1" }, // ~3/37
    { name: "Product Authenticity and Quality Assurance", percentage: 8.11, color: "#6366F1" }, // ~3/37
    { name: "Customer Support Experience and Follow-Ups", percentage: 8.11, color: "#6366F1" }, // ~3/37
  ]

  // Pie chart data - Modify percentages and add/remove categories
  const pieChartData = [
   { name: "English", value: 38, color: "#3B82F6" },     // Blue
  { name: "Hindi", value: 30, color: "#F59E0B" },       // Amber (unchanged)
  { name: "Telugu", value: 10, color: "#10B981" },      // Emerald
  { name: "Kannada", value: 8, color: "#8B5CF6" },      // Violet
  { name: "Tamil", value: 7, color: "#EC4899" },        // Pink
  { name: "Malayalam", value: 4, color: "#F97316" },    // Orange
  { name: "Marathi", value: 2, color: "#14B8A6" },      // Teal
  { name: "Others", value: 1, color: "#6B7280" }  
  ]

  // Action Metrics Data - Four categories with single progress bar each
  const actionMetricsData = {
    // Action Metrics (Red) - Overall: 32.0%
    actionMetrics: {
      title: "Action Metrics",
      color: "red",
      percentage: 32.0,
      items: [
  "Investigate the customer’s scheme status and options for managing it from out of state.",
  "Confirm if employee names can be printed on certificates for company-paid gold coin purchases.",
  "Check if refund timelines differ for PhonePe and net banking payment failures.",
  "Validate if loyalty points can be redeemed on discounted items.",
  "Ensure the address entered during checkout matches billing records for invoice accuracy.",
  "Verify stock availability before confirming same-day dispatch.",
  "Confirm whether the displayed pendant includes a chain by default.",
  "Clarify GST breakdown for bulk corporate jewelry orders.",
  "Assist customer in updating contact details linked to their order.",
  "Cross-check if coupon stacking is supported on festive offers.",
  "Validate if custom engraving is supported for online ring purchases.",
  "Confirm whether online orders can be edited post-payment.",
  "Check if insurance coverage includes in-transit and in-store incidents.",
  "Clarify whether scheme redemption is allowed for diamond jewelry.",
  "Ensure accurate price reflection after coupon application on cart page.",
  "Confirm the return eligibility for personalized jewelry items.",
  "Provide timelines for out-of-stock products expected to return.",
  "Investigate discrepancies in invoice tax fields across platforms.",
  "Ensure uniform product specifications between app and website.",
  "Check eligibility for EMI on low-weight gold purchases.",
  "Verify the packaging type for silver coins ordered online.",
  "Cross-verify Hallmark presence before dispatch from warehouse.",
  "Ensure call-back commitments are met within promised time.",
  "Confirm availability of express delivery for metro cities.",
  "Assist in linking existing store account with online profile.",
  "Validate authenticity certificate format for gemstone jewelry.",
  "Check policy for modifying delivery address after order placement.",
  "Confirm operating hours of customer support during weekends.",
  "Verify offer validity for returning customers using previous email IDs.",
  "Ensure payment success is reflected in backend before order confirmation.",
  "Track delays in courier handoff post-warehouse dispatch.",
  "Confirm if customer can club two active gold schemes into one.",
  "Validate if ring size modifications are possible after placing order.",
  "Ensure customers receive SMS and email for every transaction update.",
  "Check if store pickup option is disabled for high-value items.",
  "Verify whether video call consultation is available for platinum items.",
  "Confirm terms for refund on partial order cancellation.",
  "Validate coupon code limit per user for seasonal promotions.",
  "Ensure gift messages are included in order packaging where applicable.",
  "Confirm if e-gift cards can be used in physical stores.",
  "Verify if exchange of old gold can be initiated online.",
  "Check if customers are eligible for free polishing post-delivery.",
  "Confirm courier partner contact details for tracking delays.",
  "Clarify time taken to reflect wallet refunds post cancellation.",
  "Validate if international cards are accepted for payment.",
  "Ensure the app and web both support visual try-on feature.",
  "Verify the process for sharing cart links with others.",
  "Confirm whether store executives can see online cart items during in-person visit."
]
,
    },
    // Opportunity (Green) - Overall: 32.0%
    opportunity: {
      title: "Opportunity",
      color: "green",
      percentage: 32.0,
      items: [
  "Check the availability of the Intwind Love Diamond and Gemstone Pendant at a nearby Bangalore store.",
  "Assist the customer with applying the ₹1000 BHIM CANDIR coupon code during checkout.",
  "Guide the customer through PhonePe UPI payment retry after failure.",
  "Verify if the product labeled as 'metal' is indeed gold and communicate that clearly.",
  "Share the complete delivery address of the selected Kalyan Jewellers store in Bangalore.",
  "Provide assurance about product insurance and refund policy during online purchase.",
  "Send the payment link via WhatsApp when PhonePe fails during checkout.",
  "Help the customer register a new account to complete the purchase.",
  "Explain the 15-day no-questions-asked return policy to increase buyer confidence.",
  "Clarify that the product selected is available only through online booking.",
  "Inform the customer that the design will not be available at physical stores due to exclusivity.",
  "Provide step-by-step assistance to apply multiple coupons during a transaction.",
  "Confirm that the customer will receive an order receipt via SMS, email, and WhatsApp.",
  "Follow up with the customer post-call to ensure payment completion through alternate link.",
  "Ensure the proper order amount adjustment is reflected after applying the discount.",
  "Dispatch the ready-to-ship product earlier than the initially promised delivery date.",
  "Process refund for the excess amount paid after price correction.",
  "Verify backend payment confirmation even when customer receives success message.",
  "Resolve login/registration issues when email or mobile number is not recognized.",
  "Check if the item added to cart reflects the updated price with coupon.",
  "Assist customer in gift wrapping options and confirm no extra cost involved.",
  "Guide customer through secure checkout flow after coupon redemption.",
  "Help customer understand why website has limited in-store stock overlap.",
  "Explain how Kalyan's online catalogue supports 4500+ exclusive designs.",
  "Highlight that store pickup is possible for online orders if preferred.",
  "Clarify availability of hallmark certification with product delivery.",
  "Support customer with payment retry steps using net banking fallback.",
  "Ensure real-time WhatsApp assistance is offered after failed payment.",
  "Confirm that product will arrive in a proper jewelry box with branding.",
  "Explain the system-triggered order timeout period for incomplete payments.",
  "Proactively offer order status update when confirmation isn't reflected online.",
  "Handle concerns over UPI errors by verifying real-time payment logs.",
  "Guide customer to use 'Check Offers' section for extra hidden discounts.",
  "Confirm customer has received order and payment confirmation emails.",
  "Call back customers who were promised a follow-up but didn't receive it.",
  "Apply time-sensitive coupons before expiration and confirm application.",
  "Ensure email ID registration doesn't conflict with previous login attempts.",
  "Provide clear refund timelines for canceled or failed payment attempts.",
  "Send new payment link after detecting PhonePe security-based decline.",
  "Support customer by walking them through mobile checkout vs. desktop.",
  "Explain product categorization (metal vs. gold) to avoid confusion.",
  "Inform customer about the packaging quality of chain with pendant sets.",
  "Ensure call recordings are referenced to reassure verbal promises.",
  "Clarify why actual product will shine better than website images.",
  "Offer to escalate to senior agents when customer needs reassurance.",
  "Update customer records with school address for proper delivery.",
  "Verify coupon stacking eligibility before final checkout.",
  "Ensure delivery timeline is aligned with customer expectations.",
  "Track order in backend if customer does not see it in their account.",
  "Reassure customer about online exclusivity when visiting physical stores.",
  "Inform customer proactively about failed payment before they follow up."
]
,
    },
    // Threat (Orange) - Overall: 2.0%
    threat: {
      title: "Threat",
      color: "orange",
      percentage: 2.0,
      items: [
  "Customer threatened to report to the consumer forum due to repeated unsolicited calls over 3 months.",
  "Customer's pre-booked item under the gold scheme was changed without consent after a price hike.",
  "Order was marked as delivered but the customer never received the product.",
  "Customer received a broken product (chain) and experienced delays in resolution.",
  "Website frequently crashes or becomes unresponsive during checkout, causing purchase abandonment.",
  "Customer payment through PhonePe was declined for security reasons, despite multiple attempts.",
  "Delay in promised callback led to customer frustration and lack of trust in support promises."
],
    },
    // Neutral (Blue) - Overall: 33.0%
    neutral: {
      title: "Neutral",
      color: "blue",
      percentage: 33.0,
      items: [
  "Provide customer with the correct contact number for diamond jewelry inquiries.",
  "Ensure consistent information about making charges on gold coins across all channels.",
  "Clarify that the term 'metal' in the product description refers to gold.",
  "Verify if the customer's preferred product is available in fast shipping (FS) category.",
  "Assist customer in finding the 'Check Offers' section on the website.",
  "Confirm that the coupon code 'MONSOON' has been automatically applied in the cart.",
  "Provide clarity on the difference between gold weight and gross weight in product details.",
  "Inform customer about packaging type (e.g., pendant box vs. chain box).",
  "Confirm customer’s delivery address before dispatching order.",
  "Explain the process of email and WhatsApp confirmation after successful order placement.",
  "Reiterate that all online products come with BIS hallmarking certification.",
  "Clarify that some coupon codes are time-limited and non-stackable.",
  "Verify if the order appears under 'My Orders' section post-purchase.",
  "Support customer in reattempting payment after a session timeout.",
  "Confirm store pickup option for customers who prefer offline delivery."
],
    },
  }

  // ============================================================================
  // END OF DASHBOARD DATA
  // ============================================================================

  const [expandedSections, setExpandedSections] = useState({
    actionMetrics: false,
    opportunity: false,
    threat: false,
    neutral: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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
          <p className="text-gray-600 mb-6">Inside Sales Team Call Recordings- {calls.length} calls analyzed</p>

          {/* ============================================================================ */}
          {/* DASHBOARD STATISTICS SECTION - NEW ADDITION */}
          {/* ============================================================================ */}

          {/* Statistics Cards - ICONS REMOVED */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-xl font-bold text-gray-600">Total Calls</p>
                  <p className="text-xl font-medium text-gray-900">{dashboardStats.totalCalls}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Topics</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.uniqueTopics}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Languages</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.languages}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalDuration}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {topicCardData.map((topic, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-700">{topic.name}</p>
                      <p className="text-lg font-bold" style={{ color: topic.color }}>
                        {topic.percentage.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            

            {/* Pie Chart */}
            <Card> 
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-sm  mt-10">
                  {pieChartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-700">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Metrics Section - 2x2 Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Action Metrics (Red) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-700">{actionMetricsData.actionMetrics.title}</CardTitle>
                  <span className="text-lg font-bold text-red-700">{actionMetricsData.actionMetrics.percentage}%</span>
                </div>
                <Progress
                  value={actionMetricsData.actionMetrics.percentage}
                  className="h-2 [&>div]:bg-red-700"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(expandedSections.actionMetrics
                    ? actionMetricsData.actionMetrics.items
                    : actionMetricsData.actionMetrics.items.slice(0, 2)
                  ).map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  {actionMetricsData.actionMetrics.items.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("actionMetrics")}
                      className="w-full mt-3 text-red-600 hover:text-red-800"
                    >
                      {expandedSections.actionMetrics ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View All {actionMetricsData.actionMetrics.items.length} Examples
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opportunity (Green) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-700">{actionMetricsData.opportunity.title}</CardTitle>
                  <span className="text-lg font-bold text-green-700">{actionMetricsData.opportunity.percentage}%</span>
                </div>
                <Progress
                  value={actionMetricsData.opportunity.percentage}
                  className="h-2 [&>div]:bg-green-700"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(expandedSections.opportunity
                    ? actionMetricsData.opportunity.items
                    : actionMetricsData.opportunity.items.slice(0, 2)
                  ).map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  {actionMetricsData.opportunity.items.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("opportunity")}
                      className="w-full mt-3 text-green-600 hover:text-green-800"
                    >
                      {expandedSections.opportunity ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View All {actionMetricsData.opportunity.items.length} Examples
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Threat (Orange) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-600">{actionMetricsData.threat.title}</CardTitle>
                  <span className="text-lg font-bold text-orange-600">{actionMetricsData.threat.percentage}%</span>
                </div>
                <Progress
                  value={actionMetricsData.threat.percentage}
                  className="h-2 [&>div]:bg-orange-600"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(expandedSections.threat
                    ? actionMetricsData.threat.items
                    : actionMetricsData.threat.items.slice(0, 2)
                  ).map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  {actionMetricsData.threat.items.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("threat")}
                      className="w-full mt-3 text-orange-600 hover:text-orange-800"
                    >
                      {expandedSections.threat ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1 " />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View All {actionMetricsData.threat.items.length} Examples
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Neutral (Blue) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-700">{actionMetricsData.neutral.title}</CardTitle>
                  <span className="text-lg font-bold text-blue-700">{actionMetricsData.neutral.percentage}%</span>
                </div>
                <Progress
                  value={actionMetricsData.neutral.percentage}
                  className="h-2 [&>div]:bg-blue-700"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(expandedSections.neutral
                    ? actionMetricsData.neutral.items
                    : actionMetricsData.neutral.items.slice(0, 2)
                  ).map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  {actionMetricsData.neutral.items.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("neutral")}
                      className="w-full mt-3 text-blue-600 hover:text-blue-800"
                    >
                      {expandedSections.neutral ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View All {actionMetricsData.neutral.items.length} Examples
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================================================ */}
          {/* END OF DASHBOARD STATISTICS SECTION */}
          {/* ============================================================================ */}

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
