import RegularBG from "../background/RegularBg";

export default function TermsConditions() {
  return (
    <RegularBG>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* En-tête */}
          <header className="border-b border-slate-900/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-sm italic text-slate-600">
              Last updated August 04, 2026
            </p>
          </header>
		  <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 bg-slate-100/60 p-3 rounded-lg border border-slate-900/10">
		    <span className="text-slate-900 font-semibold">Related Policies:</span>
		    <a href="/terms_conditions" className="text-red-600 hover:text-red-700 underline transition-colors">
		      Terms & Conditions
		    </a>
		    <span className="text-slate-400">•</span>
		    <a href="/private_policy" className="text-red-600 hover:text-red-700 underline transition-colors">
		      Privacy Policy
		    </a>
		    <span className="text-slate-400">•</span>
		    <a href="/cookies_policy" className="text-red-600 hover:text-red-700 underline transition-colors">
		      Cookie Policy
		    </a>
		  </div>
		  <div className="bg-slate-100/90 border border-slate-900/10 p-4 rounded-lg my-6 text-sm text-slate-700 space-y-2">
		    <div className="flex items-center space-x-2 text-slate-900 font-semibold uppercase text-xs tracking-wider">
		      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		      </svg>
		      <span>Quick Reading Guide</span>
		    </div>
		    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
		      <li><strong className="text-slate-900">(a), (b), (1), (2)...:</strong> Used to simply list conditions or examples within a single sentence.</li>
		      <li><strong className="text-slate-900">Submissions:</strong> Refers to your messages, feature suggestions, or feedback sent to our team.</li>
		      <li><strong className="text-slate-900">Services:</strong> Refers to our website, APIs, and the entire 42 Belgium Free Assets platform.</li>
		    </ul>
		  </div>

          {/* Contenu principal */}
          <div className="space-y-6 text-base leading-relaxed text-slate-800">
            
            {/* Agreement Section */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide">
                Agreement to Our Legal Terms
              </h2>
              <p>
                We are Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux ("Company," "we," "us," "our").
              </p>
              <p>
                We operate{' '}
                <a 
                  href="https://free-assets.42belgium.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-red-600 hover:text-red-700 underline transition-colors"
                >
                  https://free-assets.42belgium.com
                </a>
                , as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
              </p>
              <p>
                You can contact us by email at{' '}
                <a 
                  href="mailto:contact@42belgium.be" 
                  className="font-semibold text-red-600 hover:text-red-700 underline transition-colors"
                >
                  contact@42belgium.be
                </a>.
              </p>
              <p>
                These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms.
              </p>
              
              <div className="bg-slate-100/80 p-4 rounded-lg border-l-4 border-slate-900 text-sm font-semibold uppercase text-slate-900">
                IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </div>

              <p>
                Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates.
              </p>
              <p>
                We recommend that you print a copy of these Legal Terms for your records.
              </p>
            </section>

            <hr className="border-slate-900/10 my-8" />

            {/* TABLE OF CONTENTS */}
            <section className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-900/5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide">
                Table of Contents
              </h2>
              <ol className="list-decimal list-inside space-y-1.5 font-medium text-slate-700">
                <li><a href="#section-1" className="hover:text-red-600 transition-colors">OUR SERVICES</a></li>
                <li><a href="#section-2" className="hover:text-red-600 transition-colors">INTELLECTUAL PROPERTY RIGHTS</a></li>
                <li><a href="#section-3" className="hover:text-red-600 transition-colors">USER REPRESENTATIONS</a></li>
                <li><a href="#section-4" className="hover:text-red-600 transition-colors">PROHIBITED ACTIVITIES</a></li>
                <li><a href="#section-5" className="hover:text-red-600 transition-colors">USER GENERATED CONTRIBUTIONS</a></li>
                <li><a href="#section-6" className="hover:text-red-600 transition-colors">CONTRIBUTION LICENSE</a></li>
                <li><a href="#section-7" className="hover:text-red-600 transition-colors">SERVICES MANAGEMENT</a></li>
                <li><a href="#section-8" className="hover:text-red-600 transition-colors">TERM AND TERMINATION</a></li>
                <li><a href="#section-9" className="hover:text-red-600 transition-colors">MODIFICATIONS AND INTERRUPTIONS</a></li>
                <li><a href="#section-10" className="hover:text-red-600 transition-colors">GOVERNING LAW</a></li>
                <li><a href="#section-11" className="hover:text-red-600 transition-colors">DISPUTE RESOLUTION</a></li>
                <li><a href="#section-12" className="hover:text-red-600 transition-colors">CORRECTIONS</a></li>
                <li><a href="#section-13" className="hover:text-red-600 transition-colors">DISCLAIMER</a></li>
                <li><a href="#section-14" className="hover:text-red-600 transition-colors">LIMITATIONS OF LIABILITY</a></li>
                <li><a href="#section-15" className="hover:text-red-600 transition-colors">INDEMNIFICATION</a></li>
                <li><a href="#section-16" className="hover:text-red-600 transition-colors">USER DATA</a></li>
                <li><a href="#section-17" className="hover:text-red-600 transition-colors">ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</a></li>
                <li><a href="#section-18" className="hover:text-red-600 transition-colors">MISCELLANEOUS</a></li>
                <li><a href="#section-19" className="hover:text-red-600 transition-colors">CONTACT US</a></li>
              </ol>
            </section>

            <hr className="border-slate-900/10 my-8" />

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                1. OUR SERVICES
              </h2>
              <p>
                The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                2. INTELLECTUAL PROPERTY RIGHTS
              </h2>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Our intellectual property</h3>
                <p>
                  We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                </p>
                <p>
                  Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.
                </p>
                <p>
                  The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
                </p>
              </div>

              <div className="space-y-2 pt-2">
			    <h3 className="text-lg font-semibold text-slate-900">Your use of our Services & Free Assets</h3>
			    <p>
			      Subject to your compliance with these Legal Terms, we grant you a non-exclusive, worldwide, royalty-free license to:
			    </p>
			    <ul className="list-disc list-inside space-y-1 pl-4 text-slate-800">
			      <li>Access and use the Services;</li>
			      <li>Download, copy, modify, and use the digital assets provided on the platform for both personal and commercial projects.</li>
			    </ul>
			    <p className="pt-2">
			      <strong className="text-slate-900">Restrictions:</strong> You may not redistribute, resell, or compile the raw assets into a competing asset library or marketplace without our express written consent.
			    </p>
			    <p>
			      If you have any questions regarding asset licensing or specific permissions, please contact us at:{' '}
			      <a href="mailto:contact@42belgium.be" className="font-semibold text-red-600 hover:text-red-700 underline transition-colors">
			        contact@42belgium.be
			      </a>.
			    </p>
			  </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-semibold text-slate-900">Your submissions</h3>
                <p>
                  Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.
                </p>
                <p>
                  <strong className="text-slate-900">Submissions:</strong> By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission.
                </p>
                <p>
                  <strong className="text-slate-900">You are responsible for what you post or upload:</strong> By sending us Submissions through any part of the Services you:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-slate-800">
                  <li>confirm that you have read and agree with our "PROHIBITED ACTIVITIES";</li>
                  <li>to the extent permissible by applicable law, waive any and all moral rights;</li>
                  <li>warrant that any such Submission are original to you or that you have the necessary licenses; and</li>
                  <li>warrant and represent that your Submissions do not constitute confidential information.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                3. USER REPRESENTATIONS
              </h2>
              <p>
                By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                4. PROHIBITED ACTIVITIES
              </h2>
              <p>
                You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-800 text-sm">
                <li>Systematically retrieve data or other content from the Services to create or compile a collection or database without written permission from us.</li>
                <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information.</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
                <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
                <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
                <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                <li>Upload or transmit viruses, Trojan horses, or spam material.</li>
                <li>Engage in any automated use of the system, such as using scripts, robots, or data mining tools.</li>
                <li>Attempt to impersonate another user or person.</li>
                <li>Interfere with, disrupt, or create an undue burden on the Services or connected networks.</li>
                <li>Attempt to bypass any measures of the Services designed to prevent or restrict access.</li>
                <li>Reverse engineer, decipher, decompile, or disassemble any of the software comprising the Services.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                5. USER GENERATED CONTRIBUTIONS
              </h2>
              <p>
                The Services do not offer users to submit or post content publicly. However, if you provide or submit any Contributions, you represent and warrant that they do not infringe any third-party proprietary rights, are not false or misleading, and comply with all applicable legal requirements.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                6. CONTRIBUTION LICENSE
              </h2>
              <p>
                You and Services agree that we may access, store, process, and use any information and personal data that you provide and your choices (including settings).
              </p>
              <p>
                We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights associated with them.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                7. SERVICES MANAGEMENT
              </h2>
              <p>
                We reserve the right, but not the obligation, to monitor the Services for violations of these Legal Terms and take appropriate legal action against anyone who violates the law or these terms.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                8. TERM AND TERMINATION
              </h2>
              <p>
                These Legal Terms shall remain in full force and effect while you use the Services. WE RESERVE THE RIGHT TO DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON WITHOUT NOTICE OR LIABILITY.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                9. MODIFICATIONS AND INTERRUPTIONS
              </h2>
              <p>
                We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We cannot guarantee the Services will be available at all times.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="section-10" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                10. GOVERNING LAW
              </h2>
              <p>
                These Legal Terms shall be governed by and defined following the laws of Belgium. Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux and yourself irrevocably consent that the courts of Brussels shall have exclusive jurisdiction to resolve any dispute.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                11. DISPUTE RESOLUTION
              </h2>
              <p>
                <strong className="text-slate-900">Informal Negotiations:</strong> To expedite resolution, the Parties agree to first attempt to negotiate any Dispute informally for at least 30 days before initiating arbitration.
              </p>
              <p>
                <strong className="text-slate-900">Binding Arbitration:</strong> Any dispute shall be finally resolved by arbitration in accordance with the UNCITRAL Arbitration Rules. The seat of arbitration shall be Brussels, Belgium.
              </p>
            </section>

            {/* SECTION 12 */}
            <section id="section-12" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                12. CORRECTIONS
              </h2>
              <p>
                We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="section-13" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                13. DISCLAIMER
              </h2>
              <p>
                THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="section-14" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                14. LIMITATIONS OF LIABILITY
              </h2>
              <p>
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="section-15" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                15. INDEMNIFICATION
              </h2>
              <p>
                You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim, or demand due to or arising out of your use of the Services or breach of these Legal Terms.
              </p>
            </section>

            {/* SECTION 16 */}
            <section id="section-16" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                16. USER DATA
              </h2>
              <p>
                We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. You are solely responsible for all data that you transmit.
              </p>
            </section>

            {/* SECTION 17 */}
            <section id="section-17" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                17. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
              </h2>
              <p>
                Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications.
              </p>
            </section>

            {/* SECTION 18 */}
            <section id="section-18" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                18. MISCELLANEOUS
              </h2>
              <p>
                These Legal Terms constitute the entire agreement between you and us. Our failure to exercise or enforce any right shall not operate as a waiver.
              </p>
            </section>

            {/* SECTION 19 */}
            <section id="section-19" className="space-y-3 pt-4 border-t border-slate-900/10">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                19. CONTACT US
              </h2>
              <p>
                In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
              </p>
              <address className="not-italic bg-slate-50 p-4 rounded-lg border border-slate-900/10 space-y-1 font-mono text-sm text-slate-800">
                <p className="font-semibold text-slate-900">Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux</p>
                <p>Cantersteen 12</p>
                <p>Bruxelles 1000</p>
                <p>Belgium</p>
                <p className="pt-2">
                  Email:{' '}
                  <a href="mailto:contact@42belgium.be" className="font-semibold text-red-600 hover:text-red-700 underline transition-colors">
                    contact@42belgium.be
                  </a>
                </p>
              </address>
            </section>

          </div>
        </div>
      </div>
    </RegularBG>
  );
}