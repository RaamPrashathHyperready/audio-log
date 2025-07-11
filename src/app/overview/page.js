"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, Table, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

export default function CallAnalysisOverview() {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState({
    actionMetrics: false,
    opportunity: false,
    threat: false,
    neutral: false,
  })

  // Dashboard data (copied from original)
  const dashboardStats = {
    totalCalls: 1603,
    uniqueTopics: 216,
    languages: 10,
    totalDuration: "2 days 4 hours 36 minutes 6 seconds",
  }

  const topicCardData = [
    { name: "Online Purchase Process", percentage: 24.32, color: "#6366F1" },
    { name: "Payment Methods and Failures", percentage: 13.51, color: "#6366F1" },
    { name: "Coupon Code Usage and Discounts", percentage: 10.81, color: "#6366F1" },
    { name: "Product Availability (Online vs. In-Store)", percentage: 10.81, color: "#6366F1" },
    { name: "Order Tracking and Delivery Status", percentage: 10.81, color: "#6366F1" },
    { name: "Refunds and Price Adjustments", percentage: 10.81, color: "#6366F1" },
    { name: "Jewelry Schemes and Pre-Booked Orders", percentage: 8.11, color: "#6366F1" },
    { name: "Account Issues (Login and Registration)", percentage: 8.11, color: "#6366F1" },
    { name: "Product Authenticity and Quality Assurance", percentage: 8.11, color: "#6366F1" },
    { name: "Customer Support Experience and Follow-Ups", percentage: 8.11, color: "#6366F1" },
  ]

  const pieChartData = [
    { name: "English", value: 38, color: "#3B82F6" },
    { name: "Hindi", value: 30, color: "#F59E0B" },
    { name: "Telugu", value: 10, color: "#10B981" },
    { name: "Kannada", value: 8, color: "#8B5CF6" },
    { name: "Tamil", value: 7, color: "#EC4899" },
    { name: "Malayalam", value: 4, color: "#F97316" },
    { name: "Marathi", value: 2, color: "#14B8A6" },
    { name: "Others", value: 1, color: "#6B7280" },
  ]

  const actionMetricsData = {
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
      ],
    },
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
      ],
    },
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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-full mx-auto px-2">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">←</button>
              <h1 className="text-xl md:text-2xl font-semibold">Deep Dive Analysis - Overview</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-purple-600 hover:text-purple-800"
            >
              <Table className="w-5 h-5 mr-2" />
              View Calls Table
            </Button>
          </div>
          <p className="text-gray-600 mb-6">Inside Sales Team Call Recordings - Overview</p>

          {/* Statistics Cards */}
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
                <div className="flex flex-col items-center justify-center gap-2 text-sm mt-10">
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

          {/* Action Metrics Section */}
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
                          <ChevronUp className="w-4 h-4 mr-1" />
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
        </div>
      </div>
    </div>
  )
}