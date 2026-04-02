import LegalLayout from '@/components/legal/LegalLayout'

export default function PayoutPolicyPage() {
  return (
    <LegalLayout 
      title="Payout Policy" 
      subtitle="Last Updated: October 2023. This policy outlines when and how agents receive their commissions."
    >
      <h2>1. Payout Minimum</h2>
      <p>Agents may request a payout once their "Approved Earnings" reach a minimum of <strong>₦5,000 (Five Thousand Naira)</strong>.</p>
      
      <h2>2. Validation Period</h2>
      <p>Commissions are initially marked as "Pending" upon successful payment. They are move to "Approved" 72 hours after the customer confirms receipt of the product, provided no dispute has been raised.</p>

      <h2>3. Payout Schedule</h2>
      <p>Payouts are processed <strong>Twice Weekly</strong> (Tuesdays and Fridays). Requests made before 5:00 PM on the day before a payout day will be included in the next cycle.</p>

      <h2>4. Withdrawal Fees</h2>
      <p>Zarizo does not charge additional fees for withdrawals. However, bank transfer charges by your financial institution may apply.</p>

      <h2>5. Prohibited Payouts</h2>
      <p>Earnings generate from fraudulent orders, self-referrals, or accounts under investigation for TOS violations will be withheld.</p>

      <h2>6. Bank Information</h2>
      <p>Ensuring your bank details are correct in your profile is your responsibility. Zarizo is not liable for payments successfully sent to an incorrect account provided by the user.</p>
    </LegalLayout>
  )
}
