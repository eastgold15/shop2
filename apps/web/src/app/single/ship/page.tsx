import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

function ShippingPage() {
  return (
    <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="pt-[--navbar-height]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl italic mb-4">
              Shipping & Returns
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-700">
              We ship worldwide and want you to be completely satisfied with your
              purchase. Learn more about our shipping policies and return process.
            </p>
          </header>

          {/* Shipping Information */}
          <section className="mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Shipping Information
            </h2>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Worldwide Delivery
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              We ship to over 200 countries and regions worldwide. Orders are
              processed and shipped from our warehouse in Guangzhou, China.
            </p>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Processing Time
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Order processing time varies by product type:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>In-Stock Items:</strong> 1-3 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Custom Orders:</strong> 7-14 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Bulk/Wholesale Orders:</strong> 10-20 business days
                </span>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Shipping Methods & Delivery Times
            </h3>
            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Shipping Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Delivery Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Tracking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Standard Shipping
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      15-25 business days
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Express Shipping
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      7-12 business days
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      DHL/FedEx
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      3-7 business days
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600">
              * Delivery times are estimates and may vary depending on customs
              processing and local postal services.
            </p>
          </section>

          {/* Shipping Costs */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Shipping Costs
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Shipping costs are calculated based on:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Destination country</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Weight and dimensions of the package</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Selected shipping method</span>
              </li>
            </ul>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Free Shipping
              </p>
              <p className="text-sm text-gray-700">
                We offer free standard shipping on orders over $500. Express and
                DHL/FedEx options are available at additional cost.
              </p>
            </div>
          </section>

          {/* Customs & Import Duties */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Customs & Import Duties
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              International orders may be subject to customs duties and taxes
              imposed by the destination country. These fees are the responsibility
              of the recipient and are not included in the product price or
              shipping cost.
            </p>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              What to Expect
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Customs authorities may contact you to pay duties before delivery
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Delays may occur during customs clearance
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  We cannot predict or control customs fees
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Some countries have duty-free thresholds for imports
                </span>
              </li>
            </ul>

            <div className="bg-yellow-50 p-4 rounded-lg my-6">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Please check your country's import
                regulations before placing an order. Refusal to pay customs fees
                may result in package return or destruction.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Order Tracking
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Once your order is shipped, you will receive an email notification
              containing:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Tracking number</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Shipping carrier information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Estimated delivery date</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Link to track your package online</span>
              </li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              You can track your order status through the carrier's website or
              contact our customer service team for assistance.
            </p>
          </section>

          {/* Returns & Exchanges */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Returns & Exchanges
            </h2>

            <h3 className="font-semibold text-lg mt-8 mb-4">Return Policy</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              We want you to be completely satisfied with your purchase. If you are
              not satisfied for any reason, you may return eligible items within
              30 days of delivery.
            </p>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Return Conditions
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Items must meet the following conditions to be eligible for return:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Unused and in original condition
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Original packaging and tags intact
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  No signs of wear or damage
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Proof of purchase (order number or receipt)
                </span>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Non-Returnable Items
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Customized or personalized items</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Items marked as "Final Sale"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Items that have been worn or damaged after delivery
                </span>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              How to Initiate a Return
            </h3>
            <ol className="space-y-3 text-sm md:text-base text-gray-700 mb-6 list-decimal list-inside">
              <li>Contact our customer service team within 30 days of delivery</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping instructions</li>
              <li>Package the item securely in original packaging</li>
              <li>Ship the item back to us using the provided method</li>
              <li>We will process your return within 5-7 business days of receipt</li>
            </ol>

            <h3 className="font-semibold text-lg mt-8 mb-4">Refunds</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Refunds will be issued to the original payment method within 5-7
              business days after we receive and inspect the returned item. Please
              note:
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Original shipping costs are non-refundable
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Return shipping costs are the customer's responsibility unless the
                  item is defective or incorrect
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Refund processing time depends on your payment provider
                </span>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mt-8 mb-4">Exchanges</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              If you need a different size or style, we recommend placing a new
              order for the desired item and returning the original item following
              our return process. This ensures you get the item you want as quickly
              as possible.
            </p>
          </section>

          {/* Damaged or Defective Items */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Damaged or Defective Items
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              If you receive a damaged or defective item, please contact us
              immediately. We will arrange for a replacement or full refund,
              including shipping costs.
            </p>
            <ul className="space-y-2 text-sm md:text-base text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Contact us within 48 hours of delivery
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Provide photos of the damage or defect
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Keep all packaging if possible
                </span>
              </li>
            </ul>
          </section>

          {/* Cancellations */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Order Cancellations
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              You may cancel your order within 24 hours of placing it, provided it
              has not yet been processed or shipped. After this time, cancellations
              may not be possible, and you will need to follow our return policy.
            </p>

            <h3 className="font-semibold text-lg mt-8 mb-4">
              Custom Orders
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Custom or personalized orders cannot be cancelled once production has
              begun. Please ensure all details are correct before placing your
              order.
            </p>
          </section>

          {/* Contact for Shipping Questions */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Questions About Shipping or Returns?
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-4">
              Our customer service team is here to help with any questions about
              shipping, returns, or your order.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@dongqifootwear.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  info@dongqifootwear.com
                </a>
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+8615920611313"
                  className="text-blue-600 hover:text-blue-800"
                >
                  +86 159-2061-1313
                </a>
              </p>
              <p className="text-sm text-gray-700">
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/8615920611313"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +86 159-2061-1313
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ShippingPage;
