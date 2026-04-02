import LegalLayout from '@/components/legal/LegalLayout'

export default function PrivacyPage() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      subtitle="Last Updated: October 2023. This policy outlines how Zarizo collects and handles your personal data."
    >
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us (e.g., name, email, phone number, address) when you register as a business, agent, or place an order as a customer.</p>

      <h2>2. Use of Information</h2>
      <p>We use your data to facilitate order fulfillment, process agent commissions, send platform updates, and prevent fraudulent activity on our network.</p>

      <h2>3. Data Retention</h2>
      <p>We retain your personal data for as long as your account is active or as needed to provide our services and comply with legal obligations.</p>

      <h2>4. Data Sharing</h2>
      <p>We share necessary information (Name, Phone, Address) with Businesses to let them fulfill your orders. We do NOT sell your personal data to third parties.</p>

      <h2>5. Cookies & Tracking</h2>
      <p>Zarizo uses cookies to remember your login session and to attribute sales to the correct agents based on our 30-day cookie policy.</p>

      <h2>6. Security</h2>
      <p>We employ industry-standard security measures, including SSL encryption and secure password hashing, to protect your data from unauthorized access.</p>
    </LegalLayout>
  )
}
