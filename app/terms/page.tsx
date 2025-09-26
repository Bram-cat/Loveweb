export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using Lovelock, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use Lovelock for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on Lovelock are provided on an &quot;as is&quot; basis. Lovelock makes no warranties, expressed or implied.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Contact Information</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, please contact us at support@lovelock.com
          </p>
        </section>
      </div>
    </div>
  )
}