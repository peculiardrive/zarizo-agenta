import LegalLayout from '@/components/legal/LegalLayout'

export default function CommissionPolicyPage() {
  return (
    <LegalLayout 
      title="Commission Policy" 
      subtitle="Last Updated: October 2023. This policy outlines how commissions are calculated and attributed."
    >
      <h2>1. Commission Types</h2>
      <p>There are two primary ways a business can set a commission on Zarizo:</p>
      <ul>
        <li><strong>Percentage (%):</strong> A commission based on a percentage of the product's selling price (e.g., 15%).</li>
        <li><strong>Fixed Amount (₦):</strong> A specific amount awarded to the agent regardless of order quantity (e.g., ₦2,000 per sale).</li>
      </ul>

      <h2>2. Attribution Rule</h2>
      <p>Sales are attributed based on a <strong>30-day Cookie Policy</strong>. If a customer clicks an agent's link and makes a purchase within 30 days using the same browser, the agent receives credit.</p>

      <h2>3. Multiple Referrals</h2>
      <p>We use a <strong>Last-Click Attribution</strong> model. The last agent whose link was clicked by the customer before the purchase is the one who receives the commission.</p>

      <h2>4. Cancelled & Refunded Orders</h2>
      <p>If an order is cancelled or a full refund is processed for a valid reason (e.g., product defect), the corresponding commission will be deducted from the agent's balance.</p>

      <h2>5. Self-Referral Prevention</h2>
      <p>Agents are strictly prohibited from using their own referral links to make personal purchases. Our system uses advanced fraud detection to identify and automatically invalidate self-referral commissions.</p>
    </LegalLayout>
  )
}
