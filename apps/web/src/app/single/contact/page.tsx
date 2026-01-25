function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="mb-4 font-serif text-3xl italic md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          We are here to help! Whether you have questions about products,
          orders, shipping, or anything else, our team is ready to assist you.
        </p>
      </header>

      {/* Get in Touch */}
      <section className="mb-12">
        <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
          Get in Touch
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-lg">Email</h3>
            <a
              className="text-blue-600 underline hover:text-blue-800"
              href="mailto:info@dongqifootwear.com"
            >
              info@dongqifootwear.com
            </a>
            <p className="mt-3 text-gray-600 text-sm">
              We respond to all emails within 24 hours
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-lg">Phone</h3>
            <a
              className="text-blue-600 hover:text-blue-800"
              href="tel:+8615920611313"
            >
              +86 159-2061-1313
            </a>
            <p className="mt-3 text-gray-600 text-sm">
              Mon-Fri: 9:00 AM - 6:00 PM (China Standard Time)
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-lg">WhatsApp</h3>
            <a
              className="text-blue-600 hover:text-blue-800"
              href="https://wa.me/8615920611313"
              rel="noopener noreferrer"
              target="_blank"
            >
              +86 159-2061-1313
            </a>
            <p className="mt-3 text-gray-600 text-sm">
              Quick responses via WhatsApp
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-lg">Business Hours</h3>
            <p className="text-gray-700 text-sm">
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 9:00 AM - 12:00 PM
              <br />
              Sunday: Closed
            </p>
            <p className="mt-3 text-gray-600 text-sm">
              All times in China Standard Time (CST)
            </p>
          </div>
        </div>
      </section>

      {/* Office Address */}
      <section className="mb-12 border-gray-200 border-t pt-8">
        <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
          Our Office
        </h2>
        <div className="my-6 rounded-lg bg-gray-50 p-6">
          <p className="text-base text-gray-700 leading-relaxed">
            <strong>DONGQIFOOTWEAR Shoes Ltd.</strong>
            <br />
            Guangzhou, Guangdong Province
            <br />
            China
          </p>
        </div>
      </section>

      {/* How Can We Help */}
      <section className="mb-12 border-gray-200 border-t pt-8">
        <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
          How Can We Help?
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-lg">Product Inquiries</h3>
            <p className="text-gray-700 text-sm leading-relaxed md:text-base">
              Questions about our footwear collection, materials, sizing, or
              customization options? We are happy to provide detailed product
              information and recommendations.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg">Order Support</h3>
            <p className="text-gray-700 text-sm leading-relaxed md:text-base">
              Need help with an existing order? Track your package, modify your
              order, or inquire about delivery status. Please have your order
              number ready.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg">Shipping & Returns</h3>
            <p className="text-gray-700 text-sm leading-relaxed md:text-base">
              Questions about international shipping, customs, duties, or our
              return policy? Check our{" "}
              <a
                className="text-blue-600 underline hover:text-blue-800"
                href="/single/ship"
              >
                Shipping & Returns
              </a>{" "}
              page for detailed information.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg">
              Wholesale & B2B Inquiries
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed md:text-base">
              Interested in bulk orders or wholesale partnerships? We offer
              competitive pricing for retailers and distributors. Contact us for
              wholesale catalogs and pricing.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg">
              Customization Services
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed md:text-base">
              Looking for custom designs, private label manufacturing, or OEM
              services? Our team can help bring your footwear ideas to life.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="mb-12 border-gray-200 border-t pt-8">
        <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
          Frequently Asked Questions
        </h2>
        <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
          Before reaching out, you might find quick answers in our FAQ section
          covering common questions about:
        </p>
        <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Order tracking and delivery times</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Payment methods and security</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Size guides and how to measure your feet</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>International shipping and customs</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Return and exchange policies</span>
          </li>
        </ul>
      </section>

      {/* Response Time */}
      <section className="mb-12 border-gray-200 border-t pt-8">
        <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
          Response Time
        </h2>
        <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
          We strive to respond to all inquiries as quickly as possible:
        </p>
        <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Email:</strong> Within 24 hours on business days
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Phone/WhatsApp:</strong> Immediate during business hours
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Complex inquiries:</strong> May take 1-2 business days
            </span>
          </li>
        </ul>
        <div className="my-6 rounded-lg bg-blue-50 p-4">
          <p className="text-gray-700 text-sm">
            <strong>Tip:</strong> For faster assistance, please include your
            order number (if applicable) and detailed information about your
            inquiry in your message.
          </p>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
