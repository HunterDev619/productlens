import type { Metadata } from 'next';
import { Footer } from '../_components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | ProductLens.ai',
  description: 'Privacy Policy for productlens.ai - Please read this policy carefully before accessing or using the Services.',
};

const listBullet = 'list-disc space-y-1 pl-6 text-gray-800 text-xl';
const sectionClass = 'space-y-4';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="w-full space-y-8 text-gray-800 text-xl">
          <header className="space-y-2 pt-[200px] text-left w-full">
            <h1 className="text-5xl font-bold text-foreground sm:text-6xl">
              PRIVACY POLICY
            </h1>
            <p className="text-2xl font-medium text-foreground">productlens.ai</p>
            <p className="text-xl text-gray-600">Last Updated: February 2026</p>
            <p className="text-xl text-gray-600">© 2026 ProductLens. All rights reserved.</p>
          </header>

          <p className="text-xl leading-relaxed">
            PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY ACCESSING OR USING PRODUCTLENS.AI, CREATING AN ACCOUNT, OR SUBMITTING ANY INFORMATION TO PRODUCTLENS, YOU UNCONDITIONALLY ACCEPT AND AGREE TO BE LEGALLY BOUND BY THIS POLICY IN ITS ENTIRETY. IF YOU DO NOT AGREE, YOU MUST IMMEDIATELY CEASE ALL USE OF THIS WEBSITE AND OUR SERVICES. YOUR CONTINUED USE CONSTITUTES CONCLUSIVE EVIDENCE OF YOUR ACCEPTANCE.
          </p>

          <p className="text-xl leading-relaxed">
            This Privacy Policy constitutes a binding legal agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and ProductLens (&quot;ProductLens&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing the collection, use, disclosure, and protection of Personal Data in connection with productlens.ai and all associated services. This Policy is supplemented by our Terms of Use, which are incorporated herein by reference.
          </p>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">1. Interpretation and Definitions</h2>
            <div className="space-y-3 text-xl">
              <p><strong>1.1</strong> In this Policy, the following definitions apply:</p>
              <ul className={listBullet}>
                <li>&quot;Aggregate Data&quot; means data that has been de-identified and combined with data of other users such that no individual can be identified, and which ProductLens may use without restriction.</li>
                <li>&quot;Consequential Loss&quot; means any indirect, special, incidental, punitive, or consequential loss or damage of any kind, including loss of revenue, profit, business, data, or goodwill, whether or not foreseeable and howsoever arising.</li>
                <li>&quot;Personal Data&quot; has the meaning given in the PDPA: data, whether true or not, about an individual who can be identified from that data alone or in combination with other information to which ProductLens has or is likely to have access.</li>
                <li>&quot;PDPA&quot; means the Personal Data Protection Act 2012 (No. 26 of 2012) of Singapore, as amended from time to time, together with all subsidiary legislation and PDPC advisory guidelines.</li>
                <li>&quot;PDPC&quot; means the Personal Data Protection Commission of Singapore.</li>
                <li>&quot;Services&quot; means all products, features, platforms, and services offered by ProductLens through productlens.ai, as updated from time to time at ProductLens&apos; sole discretion.</li>
              </ul>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">2. Scope, Application, and Deemed Consent</h2>
            <div className="space-y-3 text-xl">
              <p><strong>2.1</strong> This Policy applies to all Personal Data collected by or submitted to ProductLens in connection with the Services, whether collected online, offline, directly, or through third parties.</p>
              <p><strong>2.2 Deemed Consent.</strong> In addition to express consent, you are deemed to have consented to the collection, use, and disclosure of your Personal Data where: (a) you voluntarily provide Personal Data for a purpose that is obvious in the circumstances; (b) consent can be reasonably inferred from your conduct; or (c) such collection, use, or disclosure is necessary for a legitimate business purpose of ProductLens that is proportionate to any adverse effect on you, in accordance with section 15A of the PDPA.</p>
              <p><strong>2.3 Withdrawal of Consent.</strong> You may withdraw consent at any time by written notice to contact@productlens.ai, subject to legal and contractual restrictions. Withdrawal does not affect the lawfulness of any collection, use, or disclosure of Personal Data prior to withdrawal. ProductLens shall not be liable for any loss, inconvenience, or inability to provide Services resulting from your withdrawal of consent.</p>
              <p><strong>2.4 Third-Party Data.</strong> If you provide Personal Data relating to any third party, you represent, warrant, and undertake on an ongoing basis that you have obtained all necessary consents and authorisations from that individual. You agree to fully indemnify and hold harmless ProductLens from and against any claim, loss, liability, cost, or expense arising from your breach of this Clause 2.4.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">3. Personal Data Collected</h2>
            <div className="space-y-3 text-xl">
              <p><strong>3.1</strong> ProductLens collects only such Personal Data as is reasonably necessary for the purposes in Clause 4. Categories include:</p>
              <ul className={listBullet}>
                <li>(a) identification and contact data (name, email address, telephone number, address);</li>
                <li>(b) account credentials and profile data;</li>
                <li>(c) transactional and billing data;</li>
                <li>(d) device, technical, and usage data (IP address, browser type, operating system, cookies); and</li>
                <li>(e) any other information you voluntarily provide.</li>
              </ul>
              <p><strong>3.2</strong> ProductLens is not responsible for the accuracy of Personal Data you provide. You warrant that all Personal Data submitted is accurate, complete, and not misleading. ProductLens shall not be liable for any loss or damage resulting from inaccurate or incomplete Personal Data provided by you.</p>
              <p><strong>3.3</strong> ProductLens owns all Aggregate Data derived from your Personal Data. Aggregate Data is not Personal Data and is not subject to this Policy. ProductLens may use it for any lawful purpose without restriction or compensation to you.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">4. Purposes of Collection, Use, and Disclosure</h2>
            <div className="space-y-3 text-xl">
              <p><strong>4.1</strong> ProductLens collects, uses, and discloses Personal Data for the following purposes, which you acknowledge are reasonable:</p>
              <ul className={listBullet}>
                <li>(i) provision, operation, maintenance, and improvement of the Services;</li>
                <li>(ii) account creation, authentication, and management;</li>
                <li>(iii) transactional and service-related communications;</li>
                <li>(iv) analytics, research, and product development;</li>
                <li>(v) detecting, preventing, and investigating fraud, security incidents, and unlawful activity;</li>
                <li>(vi) enforcing the Terms of Use, this Policy, and all legal rights and remedies of ProductLens;</li>
                <li>(vii) complying with applicable laws, regulations, court orders, and regulatory requirements;</li>
                <li>(viii) facilitating any actual or proposed corporate transaction, including merger, acquisition, or asset sale; and</li>
                <li>(ix) any purpose reasonably incidental or ancillary to the foregoing.</li>
              </ul>
              <p><strong>4.2</strong> Where you have provided consent, ProductLens may use your Personal Data for marketing and personalisation. You may opt out at any time without affecting the lawfulness of prior processing.</p>
              <p><strong>4.3</strong> ProductLens shall not be liable to you or any third party for any consequences, losses, or damages arising from ProductLens&apos; use of Personal Data in accordance with this Policy.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">5. Disclosure of Personal Data</h2>
            <div className="space-y-3 text-xl">
              <p><strong>5.1</strong> ProductLens may disclose your Personal Data to the following recipients, without further notice beyond this Policy:</p>
              <ul className={listBullet}>
                <li>(x) related corporations, subsidiaries, and affiliates;</li>
                <li>(xi) service providers and agents performing functions on ProductLens&apos; behalf, subject to appropriate confidentiality obligations;</li>
                <li>(xii) professional advisers (lawyers, auditors, insurers, and consultants);</li>
                <li>(xiii) courts, regulators, government agencies, and law enforcement as required or permitted by law;</li>
                <li>(xiv) actual or prospective acquirers, investors, or business partners in connection with any corporate transaction; and</li>
                <li>(xv) any other party with your consent or as required by law.</li>
              </ul>
              <p><strong>5.2</strong> ProductLens does not sell Personal Data to third parties for commercial gain.</p>
              <p><strong>5.3</strong> ProductLens shall not be liable for the acts or omissions of any recipient of Personal Data disclosed in accordance with this Clause 5, including any unauthorised further disclosure by such recipients.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">6. Overseas Transfers of Personal Data</h2>
            <div className="space-y-3 text-xl">
              <p><strong>6.1</strong> ProductLens may transfer your Personal Data to recipients outside Singapore. Where required, ProductLens will take steps to ensure recipients provide comparable protection under Part X of the PDPA.</p>
              <p><strong>6.2</strong> You acknowledge and accept that: (a) certain overseas jurisdictions may afford lesser protection to Personal Data than Singapore; (b) ProductLens shall not be liable for acts or omissions of overseas recipients where ProductLens has complied with the PDPA transfer requirements; and (c) by using the Services, you consent to such transfers as described in this Clause 6.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">7. Data Accuracy and Retention</h2>
            <div className="space-y-3 text-xl">
              <p><strong>7.1</strong> ProductLens makes reasonable efforts to ensure Personal Data is accurate. You are responsible for notifying ProductLens promptly of any changes. ProductLens shall not be liable for any loss arising from your failure to provide accurate or updated Personal Data.</p>
              <p><strong>7.2</strong> ProductLens retains Personal Data for as long as necessary for the purposes in Clause 4, or as required by law (generally 7 years from the end of the relevant relationship). ProductLens may retain Personal Data beyond these periods where necessary to protect its legal rights, without liability to you.</p>
              <p><strong>7.3</strong> Upon expiry of the retention period, ProductLens will take reasonable steps to destroy or anonymise Personal Data. ProductLens shall not be liable for residual traces of Personal Data in backup systems arising from normal technical operations.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">8. Security of Personal Data</h2>
            <div className="space-y-3 text-xl">
              <p><strong>8.1</strong> ProductLens implements reasonable administrative, physical, and technical security measures to protect Personal Data against unauthorised access, disclosure, alteration, and destruction, in accordance with section 24 of the PDPA.</p>
              <p><strong>8.2</strong> HOWEVER, NO SECURITY SYSTEM IS IMPENETRABLE. PRODUCTLENS DOES NOT GUARANTEE THE ABSOLUTE SECURITY OF PERSONAL DATA. YOU TRANSMIT PERSONAL DATA AT YOUR OWN RISK. PRODUCTLENS SHALL NOT BE LIABLE FOR ANY UNAUTHORISED ACCESS, BREACH, OR DISCLOSURE OF PERSONAL DATA EXCEPT TO THE EXTENT SUCH LIABILITY CANNOT BE EXCLUDED UNDER MANDATORY APPLICABLE LAW.</p>
              <p><strong>8.3</strong> Compliance with statutory breach notification obligations under sections 26C to 26G of the PDPA shall constitute fulfilment of ProductLens&apos; entire obligation to you in respect of any data breach, and no further liability shall arise.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">9. Cookies and Tracking Technologies</h2>
            <div className="space-y-3 text-xl">
              <p><strong>9.1</strong> ProductLens and authorised service providers use cookies and similar tracking technologies when you visit productlens.ai. By using this website, you consent to such use.</p>
              <p><strong>9.2</strong> You may manage cookie preferences through your browser. Disabling cookies may impair functionality, and ProductLens shall not be liable for any resulting degradation.</p>
              <p><strong>9.3</strong> ProductLens shall not be liable for consequences arising from use of tracking technologies by authorised third-party providers, provided ProductLens has taken reasonable steps to ensure appropriate data protection standards.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">10. Third-Party Websites and Content</h2>
            <div className="space-y-3 text-xl">
              <p><strong>10.1</strong> productlens.ai may contain links to third-party websites and services. ProductLens has no control over and accepts no responsibility or liability for the privacy practices, content, or data handling of any third-party site. Your access to any third-party website is at your own risk and subject to that party&apos;s terms and policies.</p>
              <p><strong>10.2</strong> The inclusion of any link on productlens.ai does not constitute an endorsement, recommendation, or warranty by ProductLens.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">11. Exclusion and Limitation of Liability</h2>
            <div className="space-y-3 text-xl">
              <p><strong>11.1 MAXIMUM EXCLUSION.</strong> To the fullest extent permitted by applicable Singapore law, ProductLens and its officers, directors, employees, shareholders, agents, affiliates, subsidiaries, successors, and assigns (&quot;ProductLens Parties&quot;) shall not be liable — whether in contract, tort (including negligence), breach of statutory duty, equity, or otherwise — for:</p>
              <ul className={listBullet}>
                <li>(f) any Consequential Loss arising out of or in connection with this Policy or the collection, use, disclosure, or protection of Personal Data;</li>
                <li>(g) any loss resulting from unauthorised access to, interception of, or alteration of Personal Data;</li>
                <li>(h) any failure of a third-party provider, recipient, or overseas transferee to protect Personal Data;</li>
                <li>(i) any loss resulting from your reliance on information provided by ProductLens; or</li>
                <li>(j) any other loss or damage of any nature arising out of or in connection with this Policy.</li>
              </ul>
              <p><strong>11.2 AGGREGATE CAP.</strong> Where liability cannot be wholly excluded under mandatory law, the total aggregate liability of the ProductLens Parties to you shall not exceed SGD 500 or the total fees paid by you to ProductLens in the six (6) months preceding the event giving rise to the claim, whichever is lower.</p>
              <p><strong>11.3</strong> These limitations reflect a reasonable allocation of risk and are a fundamental basis of the arrangement between you and ProductLens. ProductLens would not offer the Services without them.</p>
              <p><strong>11.4</strong> Nothing herein excludes liability for: (a) death or personal injury caused by ProductLens&apos; gross negligence; or (b) fraud or fraudulent misrepresentation; to the extent such exclusion is prohibited under mandatory Singapore law.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">12. Indemnification by User</h2>
            <div className="space-y-3 text-xl">
              <p><strong>12.1</strong> You agree to fully indemnify, defend, and hold harmless the ProductLens Parties from and against any and all claims, demands, actions, proceedings, losses, damages, liabilities, costs, and expenses (including legal fees on a full indemnity basis) arising out of or in connection with:</p>
              <ul className={listBullet}>
                <li>(k) your breach of any provision of this Policy or the Terms of Use;</li>
                <li>(l) your provision of inaccurate, false, or misleading Personal Data;</li>
                <li>(m) your unlawful use of the Services or violation of applicable law;</li>
                <li>(n) your infringement of any third-party rights;</li>
                <li>(o) any claim by a third party arising from Personal Data you provided relating to that third party; or</li>
                <li>(p) any act or omission by you in connection with the Services.</li>
              </ul>
              <p><strong>12.2</strong> ProductLens may assume exclusive control of any matter subject to indemnification, in which case you shall cooperate fully at your cost.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">13. Individual Rights Under the PDPA</h2>
            <div className="space-y-3 text-xl">
              <p><strong>13.1</strong> Subject to the exceptions and conditions in the PDPA, you have the following rights:</p>
              <ul className={listBullet}>
                <li>(a) Right of Access (s.21 PDPA): to request confirmation of whether ProductLens holds your Personal Data and access to that data, subject to applicable administrative fees.</li>
                <li>(b) Right of Correction (s.22 PDPA): to request correction of inaccurate or incomplete Personal Data, subject to verification.</li>
                <li>(c) Right to Withdraw Consent: to withdraw consent at any time, subject to legal restrictions, with the consequences described in Clause 2.3.</li>
                <li>(d) Right to Data Portability (s.26H PDPA, where applicable): to request transmission of Personal Data in a machine-readable format, to the extent technically feasible.</li>
                <li>(e) Right to Complain: to lodge a complaint with the PDPC at pdpc.gov.sg.</li>
              </ul>
              <p><strong>13.2</strong> Requests must be submitted in writing to contact@productlens.ai. ProductLens will respond within 30 days or as required by law. ProductLens reserves the right to charge a reasonable administrative fee for access requests and to decline requests that are frivolous, vexatious, or excessive.</p>
              <p><strong>13.3</strong> ProductLens&apos; obligations upon receiving a valid request are limited to those prescribed under the PDPA. No additional obligation or liability arises from such requests.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">14. Data Protection Officer</h2>
            <div className="space-y-3 text-xl">
              <p><strong>14.1</strong> ProductLens has appointed a Data Protection Officer pursuant to section 11 of the PDPA. The DPO may be contacted at:</p>
              <p className="pl-4">Data Protection Officer — ProductLens<br />Email: contact@productlens.ai<br />Website: productlens.ai</p>
              <p><strong>14.2</strong> Contacting the DPO does not create any additional legal rights beyond those prescribed under the PDPA and does not constitute submission of a formal complaint or legal claim against ProductLens.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">15. Do Not Call (DNC) Registry</h2>
            <p className="text-xl"><strong>15.1</strong> ProductLens complies with Part IX of the PDPA regarding marketing messages to Singapore telephone numbers. You may withdraw marketing consent at any time by contacting contact@productlens.ai or using the unsubscribe function in any marketing communication. Withdrawal of marketing consent does not affect ProductLens&apos; right to send transactional or service communications.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">16. Dispute Resolution</h2>
            <div className="space-y-3 text-xl">
              <p><strong>16.1 Good Faith Negotiation.</strong> Any dispute arising out of or relating to this Policy (&quot;Dispute&quot;) shall first be subject to good faith negotiation for thirty (30) days following written notice from either party specifying the nature of the Dispute.</p>
              <p><strong>16.2 Mediation.</strong> If unresolved after thirty (30) days, either party may refer the Dispute to mediation at the Singapore Mediation Centre (SMC), with costs shared equally unless otherwise agreed.</p>
              <p><strong>16.3 Litigation.</strong> If unresolved by mediation within sixty (60) days of referral, either party may proceed before the courts of Singapore.</p>
              <p><strong>16.4 Injunctive Relief.</strong> Nothing in this Clause prevents ProductLens from seeking urgent injunctive or other equitable relief in any competent court at any time.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">17. Policy Updates and Modifications</h2>
            <div className="space-y-3 text-xl">
              <p><strong>17.1</strong> ProductLens may amend this Policy at any time at its sole discretion by posting the revised Policy on productlens.ai.</p>
              <p><strong>17.2</strong> YOUR CONTINUED USE OF PRODUCTLENS.AI FOLLOWING ANY AMENDMENT CONSTITUTES YOUR UNCONDITIONAL ACCEPTANCE OF THE AMENDED POLICY. If you do not accept an amendment, your sole remedy is to immediately cease all use of the Services and request deletion of your Personal Data.</p>
              <p><strong>17.3</strong> It is your responsibility to review this Policy regularly. ProductLens shall not be liable for any loss arising from your failure to review updated versions.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">18. Governing Law and Jurisdiction</h2>
            <div className="space-y-3 text-xl">
              <p><strong>18.1</strong> This Policy is governed exclusively by the laws of the Republic of Singapore.</p>
              <p><strong>18.2</strong> Subject to Clause 16, any Dispute proceeding to litigation shall be subject to the exclusive jurisdiction of the courts of Singapore. You irrevocably submit to such jurisdiction and waive any objection to the venue.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">19. General Provisions</h2>
            <div className="space-y-3 text-xl">
              <p><strong>19.1 Entire Agreement.</strong> This Policy, together with the Terms of Use and all incorporated policies, constitutes the entire agreement between you and ProductLens on privacy and data protection.</p>
              <p><strong>19.2 Severability.</strong> If any provision is held unlawful, invalid, or unenforceable, it shall be severed and the remaining provisions shall continue in full force.</p>
              <p><strong>19.3 No Waiver.</strong> Failure by ProductLens to enforce any provision shall not constitute a waiver of that or any other right.</p>
              <p><strong>19.4 Language.</strong> This Policy is in English. In any inconsistency with a translation, the English version prevails.</p>
              <p><strong>19.5 Assignment.</strong> ProductLens may assign this Policy or any rights hereunder without your consent. You may not assign any rights without ProductLens&apos; prior written consent.</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
