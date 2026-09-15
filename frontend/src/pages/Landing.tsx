// =============================================================================
// VeilCommerce — Landing Page
// -----------------------------------------------------------------------------
// "Trade globally. Reveal less."
// =============================================================================

import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-veil-50 via-white to-accent-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-veil-100 text-veil-700 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              Private Financial Infrastructure for Global Commerce
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-veil-900 tracking-tight mb-6 animate-slide-up">
              Trade globally.{' '}
              <span className="text-accent-600">Reveal less.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-veil-600 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Verify counterparties. Fund transactions. Lock payments in escrow. 
              Prove delivery. Finance invoices. Settle securely.
              <br />Without exposing your entire financial life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/trade" className="btn-primary text-lg px-8 py-3">
                Create Transaction
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center">
            {[
              { icon: CheckIcon, label: 'Business verified', check: true },
              { icon: CheckIcon, label: 'Funds sufficient', check: true },
              { icon: CheckIcon, label: 'Inventory verified', check: true },
              { icon: CheckIcon, label: 'Compliance satisfied', check: true },
              { icon: CheckIcon, label: 'Delivery verified', check: true },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: `${300 + i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-veil-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-veil-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-veil-900 mb-4">How VeilCommerce Works</h2>
            <p className="text-lg text-veil-600 max-w-2xl mx-auto">
              One seamless flow: verify → trade → escrow → deliver → invoice → finance → settle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Verify Counterparties',
                desc: 'Private business credentials prove identity, authorization, jurisdiction, and compliance without revealing corporate records.',
                icon: ShieldCheckIcon,
              },
              {
                step: '02',
                title: 'Create Purchase Order',
                desc: 'Buyer specifies terms privately. ZK proofs verify funds sufficiency and seller eligibility without exposing balances.',
                icon: DocumentTextIcon,
              },
              {
                step: '03',
                title: 'Fund Private Escrow',
                desc: 'Buyer locks funds with programmable release conditions. Seller ships. Delivery proof triggers ZK-verified settlement.',
                icon: LockClosedIcon,
              },
              {
                step: '04',
                title: 'Verify Delivery',
                desc: 'Cryptographic delivery attestation proves shipment completion. Escrow releases only when conditions are met.',
                icon: TruckIcon,
              },
              {
                step: '05',
                title: 'Settle & Invoice',
                desc: 'Automated settlement creates verified private receivable. Invoice commitment recorded without exposing amounts.',
                icon: CheckCircleIcon,
              },
              {
                step: '06',
                title: 'Finance Invoice',
                desc: 'Seller requests financing. Investors verify risk via ZK proofs. Funds disbursed against verified receivable.',
                icon: CurrencyDollarIcon,
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-veil-100 text-veil-700 flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">{item.step}</span>
                    <h3 className="text-lg font-semibold text-veil-900 mt-1">{item.title}</h3>
                    <p className="text-veil-600 mt-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Without Disclosure */}
      <section className="py-20 bg-veil-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">VERIFIED WITHOUT DISCLOSURE</h2>
            <p className="text-lg text-veil-300 max-w-2xl mx-auto">
              What the blockchain sees vs. what stays private
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-veil-800 border-veil-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Public (On-Chain)
              </h3>
              <ul className="space-y-3 text-veil-300">
                {[
                  'Transaction commitments',
                  'Escrow state (Funded/Released)',
                  'Invoice commitments & status',
                  'Verification results (✓/✗)',
                  'Nullifiers (replay protection)',
                  'Timestamps & contract state',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded border border-green-500 text-green-500 flex items-center justify-center text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card bg-veil-800 border-veil-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-veil-500" />
                Private (Off-Chain)
              </h3>
              <ul className="space-y-3 text-veil-300">
                {[
                  'Exact bank balances',
                  'Inventory levels',
                  'Order quantities & pricing',
                  'Customer/supplier identities',
                  'Corporate documents',
                  'Credit scores & financials',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded border border-veil-500 text-veil-400 flex items-center justify-center text-xs">🔒</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-veil-900 mb-4">
            The world runs on trust. Trust shouldn't require total transparency.
          </h2>
          <p className="text-lg text-veil-600 mb-8 max-w-2xl mx-auto">
            Join businesses using private financial infrastructure for global commerce.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/trade" className="btn-primary text-lg px-8 py-3">
              Start Trading Privately
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
              Explore Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-veil-900 text-veil-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-veil-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-white">VeilCommerce</span>
              </Link>
              <p className="text-sm">Private financial infrastructure for global business.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/trade" className="hover:text-white">Trade</Link></li>
                <li><Link to="/escrow" className="hover:text-white">Escrow</Link></li>
                <li><Link to="/invoices" className="hover:text-white">Invoices</Link></li>
                <li><Link to="/financing" className="hover:text-white">Financing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-veil-800 text-center text-sm">
            Built on Midnight · Trust without total transparency
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
function ShieldCheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function DocumentTextIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function LockClosedIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function TruckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m12 0a2 2 0 104 0" /></svg>;
}
function CheckCircleIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function CurrencyDollarIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}