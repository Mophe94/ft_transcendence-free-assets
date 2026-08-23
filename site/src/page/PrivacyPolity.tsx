import RegularBG from "../background/RegularBg";

export default function PrivacyPolity() {
	return (
    <RegularBG>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <header className="border-b border-slate-900/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              Privacy Policy
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

          <div className="space-y-6 text-base leading-relaxed text-slate-800">
            
            <p>
              This Privacy Notice for Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </p>

            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-800">
              <li>
                Visit our website at{' '}
                <a 
                  href="https://free-assets.42belgium.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-red-600 hover:text-red-700 underline transition-colors"
                >
                  https://free-assets.42belgium.com
                </a>{' '}
                or any website of ours that links to this Privacy Notice
              </li>
              <li>
                Engage with us in other related ways, including any marketing or events
              </li>
            </ul>

            <div className="bg-slate-100/80 p-4 rounded-lg border-l-4 border-slate-900 text-sm">
              <strong className="text-slate-900 font-bold">Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
              <a 
                href="mailto:contact@42belgium.be" 
                className="font-semibold text-red-600 hover:text-red-700 underline transition-colors"
              >
                contact@42belgium.be
              </a>.
            </div>

            <hr className="border-slate-900/10 my-8" />

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide">
                Summary of Key Points
              </h2>
              <p className="text-slate-600 italic">
                This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2">
                <li><strong className="text-slate-900">What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</li>
                <li><strong className="text-slate-900">Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
                <li><strong className="text-slate-900">Do we collect any information from third parties?</strong> We may collect information from public databases, marketing partners, social media platforms, and other outside sources.</li>
                <li><strong className="text-slate-900">How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process your information only when we have a valid legal reason to do so.</li>
                <li><strong className="text-slate-900">In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</li>
                <li><strong className="text-slate-900">How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information.</li>
                <li><strong className="text-slate-900">What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</li>
                <li><strong className="text-slate-900">How do you exercise your rights?</strong> Contacting us directly.</li>
              </ul>
            </section>

            <hr className="border-slate-900/10 my-8" />

            <section className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-900/5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide">
                Table of Contents
              </h2>
              <ol className="list-decimal list-inside space-y-1.5 font-medium text-slate-700">
                <li><a href="#section-1" className="hover:text-red-600 transition-colors">WHAT INFORMATION DO WE COLLECT?</a></li>
                <li><a href="#section-2" className="hover:text-red-600 transition-colors">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
                <li><a href="#section-3" className="hover:text-red-600 transition-colors">WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a></li>
                <li><a href="#section-4" className="hover:text-red-600 transition-colors">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
                <li><a href="#section-5" className="hover:text-red-600 transition-colors">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
                <li><a href="#section-6" className="hover:text-red-600 transition-colors">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
                <li><a href="#section-7" className="hover:text-red-600 transition-colors">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
                <li><a href="#section-8" className="hover:text-red-600 transition-colors">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
                <li><a href="#section-9" className="hover:text-red-600 transition-colors">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
                <li><a href="#section-10" className="hover:text-red-600 transition-colors">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
                <li><a href="#section-11" className="hover:text-red-600 transition-colors">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
                <li><a href="#section-12" className="hover:text-red-600 transition-colors">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
                <li><a href="#section-13" className="hover:text-red-600 transition-colors">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
              </ol>
            </section>

            <hr className="border-slate-900/10 my-8" />

            <section id="section-1" className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Personal information you disclose to us</h3>
                <p className="text-sm italic text-slate-600">
                  <strong>In Short:</strong> We collect personal information that you provide to us.
                </p>
                <p>
                  We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                </p>
                
                <p><strong className="text-slate-900">Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-slate-800">
                  <li>Email addresses</li>
                  <li>Usernames</li>
                  <li>Passwords</li>
                  <li>42 API profile data (user photo and coalition information)</li>
                </ul>

                <p><strong className="text-slate-900">Sensitive Information.</strong> We do not process sensitive information.</p>
                
                <p><strong className="text-slate-900">Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account.</p>
                
                <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-semibold text-slate-900">Information collected from other sources</h3>
                <p className="text-sm italic text-slate-600">
                  <strong>In Short:</strong> We may collect limited data from public databases, marketing partners, social media platforms, and other outside sources.
                </p>
              </div>
            </section>

            <section id="section-2" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
              </p>
              <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-slate-900">To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order. <em>(Retention period: for the duration of the contract; 3 years from last contact)</em>.
                </li>
                <li>
                  <strong className="text-slate-900">To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service. <em>(Retention period: for the duration of the contract and stored in the database thereafter)</em>.
                </li>
                <li>
                  <strong className="text-slate-900">To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.
                </li>
              </ul>
            </section>

            <section id="section-3" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We only process your personal information when we believe it is necessary and we have a valid legal reason under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.
              </p>
              <p>
                The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong className="text-slate-900">Consent:</strong> We may process your information if you have given us permission to use your personal information for a specific purpose.</li>
                <li><strong className="text-slate-900">Performance of a Contract:</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you.</li>
                <li><strong className="text-slate-900">Legal Obligations:</strong> We may process your information where we believe it is necessary for compliance with our legal obligations.</li>
                <li><strong className="text-slate-900">Vital Interests:</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party.</li>
              </ul>
            </section>

            <section id="section-4" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We may share information in specific situations described in this section.
              </p>
              <p>We may need to share your personal information in the following situations:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>
                  <strong className="text-slate-900">Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </li>
              </ul>
            </section>

            <section id="section-5" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.
              </p>
              <p>
                We use them to maintain security, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
              </p>
            </section>

            <section id="section-6" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.
              </p>
              <p>
                When you register using a social media account, we may receive profile information such as your name, email address, friends list, and profile picture from your provider.
              </p>
            </section>

            <section id="section-7" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                7. HOW LONG DO WE KEEP YOUR INFORMATION?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
              </p>
            </section>

            <section id="section-8" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                8. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
              </p>
            </section>

            <section id="section-9" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                9. WHAT ARE YOUR PRIVACY RIGHTS?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Switzerland, you have rights that allow you greater access to and control over your personal information.
              </p>
              <p>
                You can request access, rectification, erasure, restriction of processing, or data portability.
              </p>
              <p>
                <strong className="text-slate-900">Email for contact:</strong>{' '}
                <a 
                  href="mailto:contact@42belgium.be" 
                  className="font-semibold text-red-600 hover:text-red-700 underline transition-colors"
                >
                  contact@42belgium.be
                </a>
              </p>
            </section>

            <section id="section-10" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                10. CONTROLS FOR DO-NOT-TRACK FEATURES
              </h2>
              <p>
                At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals.
              </p>
            </section>

            <section id="section-11" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                11. DO WE MAKE UPDATES TO THIS NOTICE?
              </h2>
              <p className="text-sm italic text-slate-600">
                <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
              </p>
            </section>

            <section id="section-12" className="space-y-3 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </h2>
              <p>
                If you have questions or comments about this notice, you may email us at{' '}
                <a 
                  href="mailto:contact@42belgium.be" 
                  className="font-semibold text-red-600 hover:text-red-700 underline transition-colors"
                >
                  contact@42belgium.be
                </a>{' '}
                or contact us by post at:
              </p>
              <address className="not-italic bg-slate-50 p-4 rounded-lg border border-slate-900/10 space-y-1 font-mono text-sm text-slate-800">
                <p className="font-semibold text-slate-900">Bertrand Martin, Kevin Prist, Simon Tempels, Aurore Galand, Dylan Bajeux</p>
                <p>Cantersteen 12</p>
                <p>Bruxelles 1000</p>
                <p>Belgium</p>
              </address>
            </section>

            <section id="section-13" className="space-y-3 pt-4 border-t border-slate-900/10">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
              </h2>
              <p>
                To request to review, update, or delete your personal information, please contact us directly via email.
              </p>
            </section>

          </div>
        </div>
      </div>
    </RegularBG>
  );
}