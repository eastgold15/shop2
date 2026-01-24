import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

function ContactPage() {
  return (
    <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl italic mb-4">
              Contact Us
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-700">
              We are here to help! Whether you have questions about products,
              orders, shipping, or anything else, our team is ready to assist you.
            </p>
          </header>

          {/* Get in Touch */}
          <section className="mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Email</h3>
                <a
                  href="mailto:info@dongqifootwear.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  info@dongqifootwear.com
                </a>
                <p className="mt-3 text-sm text-gray-600">
                  We respond to all emails within 24 hours
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Phone</h3>
                <a
                  href="tel:+8615920611313"
                  className="text-blue-600 hover:text-blue-800"
                >
                  +86 159-2061-1313
                </a>
                <p className="mt-3 text-sm text-gray-600">
                  Mon-Fri: 9:00 AM - 6:00 PM (China Standard Time)
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">WhatsApp</h3>
                <a
                  href="https://wa.me/8615920611313"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +86 159-2061-1313
                </a>
                <p className="mt-3 text-sm text-gray-600">
                  Quick responses via WhatsApp
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Business Hours</h3>
                <p className="text-sm text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 12:00 PM
                  <br />
                  Sunday: Closed
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  All times in China Standard Time (CST)
                </p>
              </div>
            </div>
          </section>

          {/* Office Address */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Our Office
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg my-6">
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
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              How Can We Help?
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Product Inquiries
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Questions about our footwear collection, materials, sizing, or
                  customization options? We are happy to provide detailed product
                  information and recommendations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Order Support</h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Need help with an existing order? Track your package, modify your
                  order, or inquire about delivery status. Please have your order
                  number ready.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Shipping & Returns
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Questions about international shipping, customs, duties, or our
                  return policy? Check our{" "}
                  <a href="/single/ship" className="text-blue-600 hover:text-blue-800 underline">
                    Shipping & Returns
                  </a>{" "}
                  page for detailed information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Wholesale & B2B Inquiries
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Interested in bulk orders or wholesale partnerships? We offer
                  competitive pricing for retailers and distributors. Contact us for
                  wholesale catalogs and pricing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Customization Services
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Looking for custom designs, private label manufacturing, or OEM
                  services? Our team can help bring your footwear ideas to life.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Link */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Before reaching out, you might find quick answers in our FAQ section
              covering common questions about:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
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
                <span>
                  Size guides and how to measure your feet
                </span>
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
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Response Time
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              We strive to respond to all inquiries as quickly as possible:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
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
            <div className="bg-blue-50 p-4 rounded-lg my-6">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> For faster assistance, please include your
                order number (if applicable) and detailed information about your
                inquiry in your message.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
