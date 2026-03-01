import type { Metadata } from 'next';
import { Footer } from '../_components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use | ProductLens.ai',
  description: 'Terms of Use for productlens.ai - Please read these terms carefully before accessing or using the Services.',
};

const listBullet = 'list-disc space-y-1 pl-6 text-gray-800 text-xl';
const sectionClass = 'space-y-4';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="w-full space-y-8 text-gray-800 text-xl">
          <header className="space-y-2 pt-[200px] text-left w-full">
            <h1 className="text-5xl font-bold text-foreground sm:text-6xl">
              TERMS OF USE
            </h1>
            <p className="text-2xl font-medium text-foreground">productlens.ai</p>
            <p className="text-xl text-gray-600">Last Updated: February 2026</p>
            <p className="text-xl text-gray-600">© 2026 ProductLens. All rights reserved.</p>
          </header>

          <p className="text-xl leading-relaxed">
            PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE ACCESSING OR USING PRODUCTLENS.AI. BY ACCESSING THIS WEBSITE, CREATING AN ACCOUNT, OR USING ANY PART OF THE SERVICES, YOU UNCONDITIONALLY AGREE TO BE LEGALLY BOUND BY THESE TERMS IN THEIR ENTIRETY. IF YOU DO NOT AGREE, YOU MUST IMMEDIATELY CEASE ALL ACCESS AND USE. YOUR CONTINUED USE CONSTITUTES CONCLUSIVE AND IRREVOCABLE ACCEPTANCE.
          </p>

          <p className="text-xl leading-relaxed">
            These Terms of Use (&quot;Terms&quot;) constitute a binding legal agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and ProductLens (&quot;ProductLens&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your access to and use of productlens.ai and all associated services, features, and content (collectively, the &quot;Services&quot;). These Terms are supplemented by our Privacy Policy (productlens.ai/privacy-policy), which is incorporated herein by reference.
          </p>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">1. Interpretation and Definitions</h2>
            <div className="space-y-3 text-xl">
              <p><strong>1.1</strong> &quot;Consequential Loss&quot; means any indirect, special, incidental, punitive, or consequential loss or damage, including loss of revenue, profit, business, data, or goodwill, whether or not foreseeable.</p>
              <p><strong>1.2</strong> &quot;Content&quot; means all text, graphics, images, logos, audio, video, software, data, code, and other material available on or through productlens.ai.</p>
              <p><strong>1.3</strong> &quot;Intellectual Property Rights&quot; means all patents, trade marks, service marks, trade names, registered designs, copyrights, database rights, and all other intellectual property rights, whether registered or unregistered, worldwide.</p>
              <p><strong>1.4</strong> &quot;ProductLens Parties&quot; means ProductLens and its officers, directors, employees, shareholders, agents, affiliates, subsidiaries, successors, and assigns.</p>
              <p><strong>1.5</strong> &quot;User Content&quot; means any data, text, files, or other material submitted or uploaded by you through the Services.</p>
              <p><strong>1.6</strong> &quot;Services&quot; means all products, features, platforms, and services offered by ProductLens through productlens.ai, as updated from time to time at ProductLens&apos; sole and absolute discretion.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">2. Acceptance and Binding Effect</h2>
            <div className="space-y-3 text-xl">
              <p><strong>2.1</strong> By accessing or using this website, you unconditionally accept these Terms in their entirety. These Terms form a legally binding contract between you and ProductLens.</p>
              <p><strong>2.2</strong> If you are accessing the Services on behalf of an organisation, you represent and warrant that you have authority to bind that organisation to these Terms, and references to &quot;you&quot; include both you personally and that organisation, each of which shall be jointly and severally bound.</p>
              <p><strong>2.3</strong> ProductLens reserves the right to amend these Terms at any time at its sole discretion. Amended Terms take effect immediately upon posting on productlens.ai. YOUR CONTINUED USE OF THE SERVICES FOLLOWING POSTING CONSTITUTES UNCONDITIONAL ACCEPTANCE. If you do not accept any amendment, your sole remedy is to immediately cease use of the Services. ProductLens shall not be liable to you for any loss arising from amendments to these Terms.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">3. Conditions of Use</h2>
            <div className="space-y-3 text-xl">
              <p><strong>3.1</strong> You may use the Services solely for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className={listBullet}>
                <li>(a) use the Services in any manner that violates any applicable Singapore law, regulation, or court order;</li>
                <li>(b) use the Services to transmit, upload, or distribute viruses, malware, ransomware, or other harmful code;</li>
                <li>(c) attempt to gain unauthorised access to any part of the Services, other accounts, or computer systems;</li>
                <li>(d) use automated tools (bots, scrapers, crawlers) to access or extract data from the Services without prior written consent;</li>
                <li>(e) use the Services to harass, defame, or infringe the rights of any person;</li>
                <li>(f) impersonate any person or entity or misrepresent your affiliation with any person or entity;</li>
                <li>(g) transmit unsolicited commercial communications (spam) through or in connection with the Services; or</li>
                <li>(h) use the Services in any manner that could damage, disable, overburden, or impair our infrastructure.</li>
              </ul>
              <p><strong>3.2</strong> You are solely responsible for your use of the Services and all User Content you submit. ProductLens shall not be liable for any User Content or for any consequences arising from your use of the Services.</p>
              <p><strong>3.3</strong> ProductLens may, at its sole discretion and without notice or liability, suspend, restrict, or terminate your access to the Services for any reason, including any actual or suspected breach of these Terms.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">4. ProductLens&apos; Rights</h2>
            <div className="space-y-3 text-xl">
              <p><strong>4.1</strong> ProductLens reserves the right, at any time and without prior notice or liability, to:</p>
              <ul className={listBullet}>
                <li>(i) modify, suspend, discontinue, or restrict the Services or any feature thereof for any reason;</li>
                <li>(j) monitor, screen, review, edit, or remove any User Content or activity on the Services;</li>
                <li>(k) investigate suspected violations and take any action ProductLens deems appropriate;</li>
                <li>(l) restrict or deny access to any person for any reason at ProductLens&apos; sole discretion; and</li>
                <li>(m) report suspected unlawful activity to relevant authorities and cooperate with investigations.</li>
              </ul>
              <p><strong>4.2</strong> Exercise of any right in this Clause 4 shall not give rise to any claim, liability, or obligation of ProductLens to you or any third party.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">5. Disclaimer of Warranties</h2>
            <div className="space-y-3 text-xl">
              <p><strong>5.1</strong> THE SERVICES AND ALL CONTENT ARE PROVIDED STRICTLY ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT ANY WARRANTY OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.</p>
              <p><strong>5.2</strong> To the fullest extent permitted by applicable Singapore law, the ProductLens Parties expressly disclaim all warranties, including but not limited to:</p>
              <ul className={listBullet}>
                <li>(n) warranties of merchantability, satisfactory quality, and fitness for a particular purpose;</li>
                <li>(o) warranties of title, accuracy, completeness, reliability, or non-infringement;</li>
                <li>(p) warranties that the Services will be uninterrupted, error-free, secure, or virus-free;</li>
                <li>(q) warranties that defects will be corrected or that the Services will meet your requirements; and</li>
                <li>(r) warranties as to the security of data transmitted to or from productlens.ai.</li>
              </ul>
              <p><strong>5.3</strong> YOU ACKNOWLEDGE THAT YOUR USE OF THE SERVICES IS ENTIRELY AT YOUR OWN RISK. PRODUCTLENS MAKES NO REPRESENTATION THAT THE SERVICES ARE APPROPRIATE OR AVAILABLE FOR USE IN ANY PARTICULAR JURISDICTION.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">6. Exclusion and Limitation of Liability</h2>
            <div className="space-y-3 text-xl">
              <p><strong>6.1 TOTAL EXCLUSION.</strong> To the fullest extent permitted by applicable Singapore law, the ProductLens Parties shall have no liability whatsoever — whether in contract, tort (including negligence and breach of statutory duty), equity, or otherwise — for any loss or damage of any nature arising out of or in connection with:</p>
              <ul className={listBullet}>
                <li>(i) your access to, use of, or inability to access or use the Services;</li>
                <li>(ii) any reliance you place on any Content or information available through the Services;</li>
                <li>(iii) any interruption, delay, suspension, or termination of the Services;</li>
                <li>(iv) any unauthorised access to or alteration of your data or User Content;</li>
                <li>(v) any conduct or content of any third party on or through the Services;</li>
                <li>(vi) any products, services, or content obtained from or through the Services or any linked site;</li>
                <li>(vii) any security incident, data breach, or loss of data; or</li>
                <li>(viii) any other matter relating to the Services, howsoever arising.</li>
              </ul>
              <p><strong>6.2 CONSEQUENTIAL LOSS EXCLUDED.</strong> IN NO EVENT SHALL THE PRODUCTLENS PARTIES BE LIABLE FOR ANY CONSEQUENTIAL LOSS, EVEN IF PRODUCTLENS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH LOSS.</p>
              <p><strong>6.3 AGGREGATE CAP.</strong> Where any liability of the ProductLens Parties cannot be wholly excluded under mandatory law, the total aggregate liability of the ProductLens Parties to you in respect of all claims arising under or in connection with these Terms or the Services shall not exceed the greater of: (a) SGD 500; or (b) the total fees paid by you to ProductLens in the six (6) months immediately preceding the event giving rise to the claim.</p>
              <p><strong>6.4</strong> The exclusions and limitations in this Clause 6 reflect a reasonable and fair allocation of risk, constitute a fundamental element of the basis of the bargain between you and ProductLens, and shall apply notwithstanding any failure of essential purpose of any limited remedy. ProductLens would not offer the Services without these limitations.</p>
              <p><strong>6.5</strong> Nothing in these Terms excludes or limits liability for: (a) death or personal injury caused by ProductLens&apos; gross negligence; or (b) fraud or fraudulent misrepresentation; to the extent such exclusion is prohibited under mandatory Singapore law.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">7. User Indemnification</h2>
            <div className="space-y-3 text-xl">
              <p><strong>7.1</strong> You agree to fully indemnify, defend at ProductLens&apos; election, and hold harmless the ProductLens Parties from and against any and all claims, demands, actions, proceedings, judgments, losses, damages, liabilities, fines, penalties, costs, and expenses (including legal fees on a full indemnity basis and costs of investigation) arising out of or in connection with:</p>
              <ul className={listBullet}>
                <li>(s) your use of or access to the Services, including any User Content you submit;</li>
                <li>(t) your breach of any provision of these Terms or any applicable law or regulation;</li>
                <li>(u) your infringement of any Intellectual Property Rights or other rights of any person or entity;</li>
                <li>(v) any misrepresentation made by you to ProductLens or any third party;</li>
                <li>(w) any claim by a third party arising from or related to your use of the Services; or</li>
                <li>(x) any act, omission, or negligence by you or any person acting on your behalf.</li>
              </ul>
              <p><strong>7.2</strong> ProductLens reserves the right to assume exclusive control of the defence of any matter subject to indemnification by you. You shall not settle any such matter without ProductLens&apos; prior written consent. You shall cooperate fully with ProductLens in asserting available defences at your cost.</p>
              <p><strong>7.3</strong> Your indemnification obligations under this Clause 7 are independent of and not subject to any limitations on ProductLens&apos; liability set out in Clause 6.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">8. User Content</h2>
            <div className="space-y-3 text-xl">
              <p><strong>8.1</strong> You retain ownership of User Content you submit. However, by submitting User Content, you grant ProductLens a perpetual, irrevocable, worldwide, royalty-free, sub-licensable licence to use, reproduce, adapt, modify, publish, translate, distribute, and exploit such User Content for any purpose in connection with the Services.</p>
              <p><strong>8.2</strong> You represent and warrant that: (a) you own or have all necessary rights to the User Content you submit; (b) the User Content does not infringe the Intellectual Property Rights or other rights of any third party; and (c) the User Content does not violate any applicable law.</p>
              <p><strong>8.3</strong> ProductLens does not endorse User Content and shall not be liable for any User Content, including its accuracy, legality, or appropriateness.</p>
              <p><strong>8.4</strong> ProductLens may review, edit, or remove any User Content at any time at its sole discretion without liability or notice.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">9. Intellectual Property Rights</h2>
            <div className="space-y-3 text-xl">
              <p><strong>9.1</strong> All Intellectual Property Rights in the Services, Content, and productlens.ai are owned by or licensed to ProductLens. Nothing in these Terms transfers any Intellectual Property Rights to you.</p>
              <p><strong>9.2</strong> Subject to these Terms, ProductLens grants you a limited, non-exclusive, non-transferable, non-sub-licensable, revocable licence to access and use the Services for your personal or internal business purposes. This licence does not include the right to:</p>
              <ul className={listBullet}>
                <li>(y) reproduce, distribute, adapt, or create derivative works of any Content;</li>
                <li>(z) reverse engineer, decompile, or disassemble any software underlying the Services;</li>
                <li>(aa) use any Content for commercial purposes without ProductLens&apos; prior written consent;</li>
                <li>(bb) frame or mirror any Content on any other website; or</li>
                <li>(cc) remove or alter any proprietary notices or labels on Content.</li>
              </ul>
              <p><strong>9.3</strong> Any unauthorised use of the Services or Content terminates this licence automatically and may give rise to legal liability.</p>
              <p><strong>9.4</strong> All trade marks, service marks, and logos are the property of ProductLens or their respective owners. No right or licence to use any trade mark is granted by these Terms or by access to the Services. This Clause 9 survives termination of these Terms.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">10. Feedback and Submissions</h2>
            <div className="space-y-3 text-xl">
              <p><strong>10.1</strong> Any feedback, ideas, or suggestions you submit to ProductLens shall be deemed non-confidential and become the property of ProductLens immediately upon submission. By submitting, you grant ProductLens a perpetual, irrevocable, royalty-free, worldwide licence to use such material for any purpose, without obligation of confidentiality or compensation to you.</p>
              <p><strong>10.2</strong> ProductLens is under no obligation to review, implement, or preserve any submission, and accepts no liability for any similarity between any submission and ProductLens&apos; existing or future products or services.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">11. Third-Party Links and Services</h2>
            <div className="space-y-3 text-xl">
              <p><strong>11.1</strong> The Services may contain links to third-party websites and services. Such links are provided for convenience only and do not constitute an endorsement by ProductLens. ProductLens has no control over third-party sites and accepts no responsibility or liability for their content, products, services, or privacy practices.</p>
              <p><strong>11.2</strong> Your access to and use of any third-party website is at your sole risk and subject solely to that party&apos;s terms. ProductLens shall not be liable for any loss or damage suffered by you or any third party in connection with third-party sites.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">12. Data Privacy</h2>
            <div className="space-y-3 text-xl">
              <p><strong>12.1</strong> Your use of the Services is subject to our Privacy Policy (productlens.ai/privacy-policy), which is incorporated into these Terms by reference. By using the Services, you consent to the collection, use, and disclosure of your personal data as described in the Privacy Policy.</p>
              <p><strong>12.2</strong> ProductLens&apos; liability in relation to personal data is subject to the exclusions and limitations set out in the Privacy Policy and in Clause 6 of these Terms.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">13. Suspension and Termination</h2>
            <div className="space-y-3 text-xl">
              <p><strong>13.1</strong> ProductLens may, at its sole discretion and without prior notice or liability, immediately suspend or terminate your access to all or any part of the Services for any reason, including any actual or suspected breach of these Terms or any applicable law.</p>
              <p><strong>13.2</strong> Upon termination: (a) all licences granted to you under these Terms cease immediately; (b) you must immediately cease all use of the Services; and (c) ProductLens may delete your account and User Content without liability.</p>
              <p><strong>13.3</strong> Termination shall not affect: (a) any accrued rights or remedies of ProductLens; (b) any provisions of these Terms that are expressed or intended to survive termination, including Clauses 6, 7, 9, 10, 15, and 16.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">14. Electronic Communications</h2>
            <p className="text-xl"><strong>14.1</strong> In accordance with the Electronic Transactions Act 2010 (Singapore), electronic records and communications transmitted through or in connection with the Services have the same legal force and effect as written communications. You consent to receive notices and communications from ProductLens electronically.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">15. Dispute Resolution</h2>
            <div className="space-y-3 text-xl">
              <p><strong>15.1 Good Faith Negotiation.</strong> Any dispute, controversy, or claim arising out of or in connection with these Terms or the Services (&quot;Dispute&quot;) shall first be referred to good faith negotiation between the parties for thirty (30) days following written notice specifying the Dispute.</p>
              <p><strong>15.2 Mediation.</strong> If not resolved by negotiation, either party may refer the Dispute to mediation at the Singapore Mediation Centre (SMC). Costs shall be shared equally unless otherwise agreed. Mediation shall be conducted in Singapore in English.</p>
              <p><strong>15.3 Litigation.</strong> If the Dispute remains unresolved sixty (60) days after referral to mediation, either party may pursue the Dispute before the courts of Singapore pursuant to Clause 16.</p>
              <p><strong>15.4 Injunctive Relief.</strong> Notwithstanding this Clause 15, ProductLens may seek urgent injunctive or other equitable relief from any competent court at any time without first complying with the negotiation or mediation requirements.</p>
              <p><strong>15.5 Class Action Waiver.</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE TO RESOLVE ANY DISPUTE WITH PRODUCTLENS ON AN INDIVIDUAL BASIS. YOU WAIVE ANY RIGHT TO BRING OR PARTICIPATE IN ANY CLASS, CONSOLIDATED, REPRESENTATIVE, OR COLLECTIVE ACTION OR PROCEEDING AGAINST PRODUCTLENS.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">16. Governing Law and Jurisdiction</h2>
            <div className="space-y-3 text-xl">
              <p><strong>16.1</strong> These Terms are governed exclusively by and construed in accordance with the laws of the Republic of Singapore, without regard to conflict of laws principles.</p>
              <p><strong>16.2</strong> Subject to Clause 15, you irrevocably submit to the exclusive jurisdiction of the courts of Singapore in respect of any Dispute, and waive any objection to the laying of venue or to jurisdiction in Singapore.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-4xl font-semibold text-foreground">17. General Provisions</h2>
            <div className="space-y-3 text-xl">
              <p><strong>17.1 Entire Agreement.</strong> These Terms, together with the Privacy Policy and all incorporated notices and policies, constitute the entire agreement between you and ProductLens regarding the Services and supersede all prior agreements, representations, and understandings.</p>
              <p><strong>17.2 Severability.</strong> If any provision is held unlawful, invalid, or unenforceable, it shall be severed and the remaining provisions shall continue in full force. If any limitation or exclusion in Clause 6 is held inapplicable, all other limitations and exclusions shall remain in full force.</p>
              <p><strong>17.3 No Waiver.</strong> Failure or delay by ProductLens to exercise any right or remedy under these Terms shall not constitute a waiver of that right or remedy.</p>
              <p><strong>17.4 No Partnership.</strong> Nothing in these Terms creates any partnership, joint venture, agency, franchise, or employment relationship between you and ProductLens.</p>
              <p><strong>17.5 Assignment.</strong> ProductLens may assign or transfer these Terms or any rights or obligations hereunder to any third party without your consent, including in connection with any merger, acquisition, or sale of assets. You may not assign or transfer any rights or obligations under these Terms without ProductLens&apos; prior written consent, and any purported assignment without such consent is void.</p>
              <p><strong>17.6 Language.</strong> These Terms are in English. In the event of any inconsistency between the English version and any translation, the English version shall prevail.</p>
              <p><strong>17.7 Electronic Transactions Act.</strong> These Terms are made under and are subject to the Electronic Transactions Act 2010 (Singapore).</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
