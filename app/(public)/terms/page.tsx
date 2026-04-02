import LegalLayout from '@/components/legal/LegalLayout'

export default function TermsPage() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      subtitle="Last Updated: October 2023. These terms govern your use of the Zarizo Marketplace and Agent Network."
    >
      <h2>1. Introduction</h2>
      <p>Welcome to Zarizo. By accessing our platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

      <h2>2. User Roles</h2>
      <p>Zarizo provides services to two main categories of users:</p>
      <ul>
        <li><strong>Businesses:</strong> Entity that lists products for sale and provides order fulfillment.</li>
        <li><strong>Agents:</strong> Individuals who promote business products and earn commissions on verified sales.</li>
      </ul>

      <h2>3. Account Registration</h2>
      <p>All users must provide accurate and complete information during registration. Accounts are subject to admin review and approval. We reserve the right to suspend any account that provides false data or violates our community guidelines.</p>

      <h2>4. Prohibited Activities</h2>
      <p>Users may not engage in fraud, spam, or any activity that compromises the integrity of the referral tracking system. Automated scripts, "self-referrals," and misleading advertising are strictly prohibited.</p>

      <h2>5. Modification of Terms</h2>
      <p>Zarizo reserves the right to modify these terms at any time. Significant changes will be notified via email or platform notification.</p>

      <h2>6. Limitation of Liability</h2>
      <p>Zarizo acts as a marketplace infrastructure. We are not responsible for the quality of products listed by businesses or for lost earnings due to external payment failures.</p>
    </LegalLayout>
  )
}
