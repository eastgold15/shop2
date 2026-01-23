import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

function TermsPage() {
  return (
    <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last Updated: January 1, 2024
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p>
              Welcome to this cross-border e-commerce platform (hereinafter referred to as "the Platform" or "we"). By accessing or using the services of this Platform, you confirm that you have read, understood, and agreed to be bound by these Terms of Service (hereinafter referred to as "Terms"). If you do not agree to these Terms, please do not use the services of this Platform.
            </p>
            <p>
              This Platform provides cross-border e-commerce procurement services to global customers. As a user, you may use this Platform as an exporter, purchaser, or other business entity. Please ensure that you have the corresponding legal capacity and business qualifications before using this Platform.
            </p>
          </section>

          {/* 2. Account Registration and Security */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              2. Account Registration and Security
            </h2>
            <p className="mb-3">
              <strong>2.1 Account Registration</strong>
            </p>
            <p className="mb-4">
              To use certain features of this Platform, you must create an account. The information you provide during registration must be true, accurate, and complete. You are responsible for updating this information when it changes.
            </p>
            <p className="mb-3">
              <strong>2.2 Account Security</strong>
            </p>
            <p className="mb-4">
              You are responsible for all activities that occur under your account, whether or not these activities are authorized by you. If you discover any unauthorized use of your account, please notify us immediately. We will not be liable for any losses or damages caused by your failure to protect your account information.
            </p>
            <p className="mb-3">
              <strong>2.3 Business Accounts</strong>
            </p>
            <p>
              For business users, you declare and guarantee that you have the authority to accept these Terms on behalf of the business and bind the business to these Terms.
            </p>
          </section>

          {/* 3. Product and Service Descriptions */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              3. Product and Service Descriptions
            </h2>
            <p className="mb-3">
              <strong>3.1 Product Information</strong>
            </p>
            <p className="mb-4">
              We strive to ensure that the product information displayed on this Platform (including images, descriptions, specifications, etc.) is accurate. However, we make no express or implied warranties regarding the completeness, accuracy, or reliability of the products. Due to the nature of cross-border trade, products may have minor variations.
            </p>
            <p className="mb-3">
              <strong>3.2 Product Availability</strong>
            </p>
            <p className="mb-4">
              All product supplies are subject to actual inventory. We reserve the right to limit order quantities, refuse orders, or restrict delivery to any customer, region, or address based on supply conditions.
            </p>
            <p className="mb-3">
              <strong>3.3 Custom Products</strong>
              </p>
            <p>
              For custom or special order products, once production has begun, you will not be able to cancel the order or receive a refund, unless the product is defective.
            </p>
          </section>

          {/* 4. Pricing and Payment Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              4. Pricing and Payment Terms
            </h2>
            <p className="mb-3">
              <strong>4.1 Price Display</strong>
            </p>
            <p className="mb-4">
              All prices displayed on this Platform are listed in the specified currency (such as USD, CNY, etc.). Unless otherwise stated, prices do not include taxes, shipping fees, insurance, and other cross-border charges.
            </p>
            <p className="mb-3">
              <strong>4.2 Exchange Rate Fluctuations</strong>
            </p>
            <p className="mb-4">
              For cross-border transactions, the actual amount paid may vary depending on the exchange rate at the time of payment processing. This Platform is not responsible for differences caused by exchange rate fluctuations.
            </p>
            <p className="mb-3">
              <strong>4.3 Taxes and Duties</strong>
            </p>
            <p className="mb-4">
              Cross-border procurement may involve import taxes, value-added taxes, customs duties, or other government fees. These fees are the responsibility of the recipient, and the specific amount depends on the regulations of the destination country/region. Please understand the import regulations of your country/region before placing an order.
            </p>
            <p className="mb-3">
              <strong>4.4 Payment Methods</strong>
            </p>
            <p>
              We accept multiple payment methods, including credit cards, debit cards, bank transfers, etc. We reserve the right to add or remove payment methods at any time. All payments will be processed through secure third-party payment service providers.
            </p>
          </section>

          {/* 5. International Shipping and Delivery */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              5. International Shipping and Delivery
            </h2>
            <p className="mb-3">
              <strong>5.1 Shipping Time</strong>
            </p>
            <p className="mb-4">
              International shipping times may vary depending on destination, customs clearance speed, weather conditions, and shipping method. The estimated delivery times we provide are for reference only and do not constitute a guarantee.
            </p>
            <p className="mb-3">
              <strong>5.2 Shipping Risk</strong>
            </p>
            <p className="mb-4">
              Once products are delivered to the shipping company, the risk transfers to you. We strongly recommend that you purchase shipping insurance to protect your goods during transit.
            </p>
            <p className="mb-3">
              <strong>5.3 Address Accuracy</strong>
            </p>
            <p className="mb-4">
              Please ensure that you provide an accurate and complete shipping address. Delays, losses, or additional fees caused by incorrect or incomplete addresses are your responsibility.
            </p>
            <p className="mb-3">
              <strong>5.4 Shipping Restrictions</strong>
            </p>
            <p>
              Certain products may be subject to import restrictions or prohibitions in the destination country/region. You are responsible for ensuring that the products you order can be legally imported into your country/region.
            </p>
          </section>

          {/* 6. Customs and Import Compliance */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              6. Customs and Import Compliance
            </h2>
            <p className="mb-3">
              <strong>6.1 Import Licenses</strong>
            </p>
            <p className="mb-4">
              Certain products may require import licenses or other government approvals. You are responsible for obtaining all necessary import licenses and approval documents.
            </p>
            <p className="mb-3">
              <strong>6.2 Customs Clearance</strong>
            </p>
            <p className="mb-4">
              We will provide necessary documents (such as commercial invoices, packing lists, certificates of origin, etc.) to assist with customs clearance. However, we do not guarantee that products will successfully pass through customs, nor are we responsible for customs detention or delays.
            </p>
            <p className="mb-3">
              <strong>6.3 Compliance Responsibility</strong>
            </p>
            <p>
              You are responsible for ensuring that your procurement activities comply with the laws and regulations of your country/region, including but not limited to product safety standards, certification requirements, environmental regulations, etc.
            </p>
          </section>

          {/* 7. Return and Refund Policy */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              7. Return and Refund Policy
            </h2>
            <p className="mb-3">
              <strong>7.1 Product Defects</strong>
            </p>
            <p className="mb-4">
              If the product you received has quality defects or does not match the order description, please contact us within 7 days of receiving the product. We will provide replacement, repair, or refund services based on the specific situation.
            </p>
            <p className="mb-3">
              <strong>7.2 Return Restrictions</strong>
            </p>
            <p className="mb-4">
              Cross-border returns involve high shipping costs and complex customs procedures. Unless the product has quality issues, we generally do not accept returns without reason. For custom products, once production has begun, returns or refunds are not accepted.
            </p>
            <p className="mb-3">
              <strong>7.3 Return Process</strong>
            </p>
            <p>
              For returns, you must first obtain our return authorization (RMA). Unauthorized returns will be rejected. The shipping costs and risks for returns are your responsibility, unless the return is due to our error.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              8. Intellectual Property
            </h2>
            <p className="mb-3">
              <strong>8.1 Platform Content</strong>
            </p>
            <p className="mb-4">
              All content on this Platform, including but not limited to text, images, logos, software, code, etc., is protected by intellectual property laws. Without our prior written consent, you may not use, copy, modify, or distribute this content in any way.
            </p>
            <p className="mb-3">
              <strong>8.2 Product Intellectual Property</strong>
            </p>
            <p className="mb-4">
              Trademarks, patents, copyrights, and other intellectual property rights displayed on products belong to the product manufacturer or brand owner. You may not use these products in a manner that infringes on intellectual property rights.
            </p>
            <p className="mb-3">
              <strong>8.3 User Content</strong>
            </p>
            <p>
              By submitting any content through this Platform (such as reviews, feedback, images, etc.), you grant us a worldwide, royalty-free, irrevocable license to use such content to improve our services and for marketing activities.
            </p>
          </section>

          {/* 9. User Conduct */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              9. User Conduct
            </h2>
            <p className="mb-3">
              When using this Platform, you agree that you will not:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
              <li>Provide false, inaccurate, or incomplete information</li>
              <li>Impersonate another person or entity</li>
              <li>Interfere with or disrupt the operation or security of this Platform</li>
              <li>Use automated tools (such as crawlers, bots) to access this Platform</li>
              <li>Engage in fraud, money laundering, or other illegal activities</li>
              <li>Violate any applicable international trade sanctions or export control laws</li>
              <li>Infringe on the intellectual property or other rights of others</li>
              <li>Post or transmit viruses, malicious code, or other harmful content</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your account if you violate these rules.
            </p>
          </section>

          {/* 10. Limitation of Liability */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              10. Limitation of Liability
            </h2>
            <p className="mb-3">
              <strong>10.1 Disclaimer</strong>
            </p>
            <p className="mb-4">
              The services of this Platform are provided on an "as is" and "available" basis. We make no warranties regarding the continuity, timeliness, security, or error-free nature of the services.
            </p>
            <p className="mb-3">
              <strong>10.2 Indirect Damages Disclaimer</strong>
            </p>
            <p className="mb-4">
              To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profit, data loss, or loss of business opportunities.
            </p>
            <p className="mb-3">
              <strong>10.3 Liability Cap</strong>
            </p>
            <p>
              In no event shall our total liability exceed the amount you paid to us for the relevant products or services.
            </p>
          </section>

          {/* 11. Dispute Resolution */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              11. Dispute Resolution
            </h2>
            <p className="mb-3">
              <strong>11.1 Negotiated Resolution</strong>
            </p>
            <p className="mb-4">
              If any dispute arises between you and us, we recommend first resolving it through friendly negotiation. You can contact us through our customer service department.
            </p>
            <p className="mb-3">
              <strong>11.2 Governing Law</strong>
            </p>
            <p className="mb-4">
              These Terms are governed by the laws of the People's Republic of China and are interpreted in accordance with such laws (without regard to conflict of law principles).
            </p>
            <p className="mb-3">
              <strong>11.3 Dispute Resolution Method</strong>
            </p>
            <p>
              Any dispute arising from these Terms shall be submitted to the people's court with jurisdiction in the location where this Platform is based.
            </p>
          </section>

          {/* 12. Modification of Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              12. Modification of Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. The modified Terms will be posted on this page with the update date indicated. Significant changes will be notified to you via email or other means. Continued use of this Platform after modifications indicates your acceptance of the modified Terms.
            </p>
          </section>

          {/* 13. Miscellaneous Provisions */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              13. Miscellaneous Provisions
            </h2>
            <p className="mb-3">
              <strong>13.1 Entire Agreement</strong>
            </p>
            <p className="mb-4">
              These Terms constitute the entire agreement between you and us regarding the use of this Platform, superseding all prior oral or written agreements.
            </p>
            <p className="mb-3">
              <strong>13.2 Severability</strong>
            </p>
            <p className="mb-4">
              If any provision of these Terms is deemed invalid or unenforceable, that provision shall be deemed severable, and the remaining provisions shall remain in effect.
            </p>
            <p className="mb-3">
              <strong>13.3 Waiver</strong>
            </p>
            <p>
              Our failure to exercise or enforce any right or provision of these Terms does not constitute a waiver of such right or provision.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              14. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions or comments about these Terms of Service, or need to contact us regarding any matter, please contact us via the following methods:
            </p>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="mb-2">
                <strong>Email:</strong> support@example.com
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> +86-XXX-XXXX-XXXX
              </p>
              <p className="mb-2">
                <strong>Working Hours:</strong> Monday to Friday 9:00-18:00 (GMT+8)
              </p>
              <p>
                <strong>Address:</strong> Shenzhen, Guangdong Province, China
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsPage;
