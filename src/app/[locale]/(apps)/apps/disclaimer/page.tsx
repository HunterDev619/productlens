import type { Metadata } from 'next';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: 'Legal Disclaimer | ProductLens.ai',
  description:
    'Full legal disclaimer, terms of use, and privacy & data protection clauses for ProductLens.ai under Singapore jurisdiction.',
};

const lastUpdated = '20th November 2025';

const listBullet = 'list-disc space-y-2 pl-6 text-black';

export default function DisclaimerPage() {
  return (
    <div className={cn('px-4 py-12 md:px-8', 'text-base text-black', 'bg-background')}>
      <article className={cn('mx-auto w-full max-w-4xl p-8 space-y-8 rounded-2xl border border-border shadow-sm backdrop-blur', 'bg-card/80')}>
        <header className={cn('space-y-2', 'text-center')}>
          <p className={cn('text-sm', 'tracking-wide', 'uppercase', 'text-black')}>
            Full Legal Disclaimer, Terms of Use & Privacy Notice
          </p>
          <h1 className="text-3xl font-semibold">ProductLens.ai</h1>
          <p className="text-black">Singapore Jurisdiction — PDPA Compliant</p>
          <p className="text-sm text-black">
            Last Updated:
            {' '}
            {lastUpdated}
          </p>
        </header>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">1. General Disclaimer</h2>
          <p>
            ProductLens.ai (&quot;Platform&quot;) delivers automated and semi-automated product intelligence and sustainability
            analytics outputs, including LCA estimations, carbon footprints, supply-chain mapping, and compliance insights
            (&quot;Services&quot;). All information and generated outputs (&quot;Output&quot;) are provided strictly on an
          </p>
          <p>
            <strong>“as-is”, “as-available”, and “with all faults”</strong>
            {' '}
            basis.
          </p>
          <p>ProductLens.ai does not warrant and expressly disclaims responsibility for:</p>
          <ul className={listBullet}>
            <li>Accuracy, completeness, reliability, or timeliness of Output.</li>
            <li>Variations caused by third-party sources, incomplete datasets, estimations, or machine-learning models.</li>
            <li>Decisions made or actions taken based on any Output.</li>
            <li>Compliance or non-compliance of any product, supplier, or user with environmental, safety, or regulatory requirements.</li>
          </ul>
          <p>Nothing produced by the Platform constitutes legal, environmental, engineering, financial, or compliance advice.</p>
          <p className="text-black">
            Users remain solely responsible for independently verifying all Output before relying on it for commercial, regulatory,
            procurement, investor, disclosure, or operational decisions.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">2. Terms of Use</h2>
          <p>By accessing or using ProductLens.ai, the user (&quot;User&quot;) agrees to the following terms.</p>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">2.1 Permitted Use</h3>
            <p>Use the Platform solely for lawful purposes and for internal analysis, reporting, due diligence, and sustainability evaluation.</p>
            <p>Users shall not:</p>
            <ul className={listBullet}>
              <li>Copy, resell, or redistribute the Platform or Output except for internal use.</li>
              <li>Reverse-engineer, scrape, mine, or extract datasets or algorithms.</li>
              <li>Bypass security or misuse the Platform in any manner.</li>
              <li>Upload unlawful, infringing, or unlicensed data.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">2.2 Third-Party Sources</h3>
            <p>Some information originates from manufacturers, public datasets, commercial databases, government sources, or AI/ML models.</p>
            <p className="text-black">
              ProductLens.ai is not responsible for errors, omissions, changes, or inaccuracies in third-party information.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">2.3 No Guarantee of Compliance</h3>
            <p>The Platform does not guarantee compliance with:</p>
            <ul className={listBullet}>
              <li>ISO 14040/14044 or ISO 14067 LCA requirements.</li>
              <li>Extended Producer Responsibility (EPR) regulations.</li>
              <li>Circularity or reparability frameworks.</li>
              <li>Trade compliance laws.</li>
              <li>Sustainability reporting frameworks (ESRS, GRI, IFRS, SEC, etc.).</li>
            </ul>
            <p>Users must validate all results before filing, publishing, submitting, or disclosing.</p>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">3. Indemnity Clause</h2>
          <p>
            The User agrees to
            {' '}
            <strong>indemnify, defend, and hold harmless</strong>
            {' '}
            ProductLens.ai, its owners, directors, officers, employees, affiliates, agents, and data partners (&quot;Indemnified Parties&quot;)
            against all claims, losses, liabilities, damages, penalties, expenses, or costs (including legal fees on an indemnity basis) arising from:
          </p>
          <ul className={listBullet}>
            <li>Access to or use of the Platform or Output.</li>
            <li>Breaches of these Terms of Use or privacy obligations.</li>
            <li>Reliance on, publication of, or distribution of Output.</li>
            <li>Inaccuracies in data supplied by the User.</li>
            <li>Disclosure or misuse of Output by the User.</li>
            <li>Violations of third-party rights, including IP or confidentiality.</li>
            <li>Regulatory, compliance, environmental, or sustainability claims based on Output.</li>
          </ul>
          <p>This indemnity survives termination or suspension of Platform access.</p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">4. Limitation of Liability (Singapore Law)</h2>
          <p>To the fullest extent permitted under Singapore law, ProductLens.ai is not liable for:</p>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">4.1 Excluded Damages</h3>
            <ul className={listBullet}>
              <li>Indirect, consequential, incidental, special, punitive, or exemplary damages.</li>
              <li>Loss of profits, revenue, business, anticipated savings, or goodwill.</li>
              <li>Loss, corruption, or inaccuracy of data.</li>
              <li>Business interruption or downtime.</li>
              <li>Environmental, sustainability, or regulatory penalties arising from reliance on Output.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">5. Privacy &amp; Data Protection (PDPA-Compliant Notice)</h2>
          <p>ProductLens.ai adheres to the Personal Data Protection Act 2012 (PDPA) and all applicable regulations.</p>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.1 Personal Data We Collect</h3>
            <ul className={listBullet}>
              <li>Name, email, employer, and contact information.</li>
              <li>Login details and authentication data.</li>
              <li>Usage logs, device information, cookies.</li>
              <li>Documents, datasets, or information uploaded by the User.</li>
              <li>Product input data for analysis or LCA modelling.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.2 Purpose of Collection</h3>
            <ul className={listBullet}>
              <li>Provision of Services and generation of Output.</li>
              <li>Customer support and account management.</li>
              <li>Analytics, model improvement, and system optimisation.</li>
              <li>Billing and transaction processing.</li>
              <li>Verifying misuse, fraud, or security breaches.</li>
              <li>Compliance with regulatory or legal requirements.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.3 Disclosure of Data</h3>
            <p>Data may be disclosed to:</p>
            <ul className={listBullet}>
              <li>Hosting service providers.</li>
              <li>Payment processors.</li>
              <li>Analytics vendors.</li>
              <li>Regulatory or government authorities (where required by law).</li>
              <li>Business partners involved in service delivery.</li>
            </ul>
            <p className="text-black">No personal data is sold or traded.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.4 Cross-Border Transfers</h3>
            <p>
              ProductLens.ai ensures that any transfer of data outside Singapore is made to jurisdictions with comparable protection standards
              per PDPA regulations.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.5 Retention</h3>
            <p>Data is retained only as long as necessary for business or legal purposes.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">5.6 Access, Correction &amp; Withdrawal of Consent</h3>
            <p>Users may request access, correction, or withdrawal of consent (subject to consequences) by contacting:</p>
            <p className="font-semibold text-black">contact@productlens.ai</p>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">6. Governing Law &amp; Jurisdiction</h2>
          <p>
            This Disclaimer, Terms of Use, and Privacy Notice are governed by the laws of the Republic of Singapore. All disputes are subject to
            the exclusive jurisdiction of the Singapore courts.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">7. Acceptance</h2>
          <p>
            By using ProductLens.ai, the User signifies acceptance of this Disclaimer, Terms of Use, and Privacy &amp; Data Protection Notice.
            Continued use of the Platform constitutes ongoing consent to these terms.
          </p>
        </section>
      </article>
    </div>
  );
}
