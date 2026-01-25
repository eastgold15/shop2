function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="mb-4 font-serif text-3xl italic md:text-4xl">
              Shipping & Returns
            </h1>
            <p className="mt-6 text-base text-gray-700 leading-relaxed">
              We ship worldwide and want you to be completely satisfied with
              your purchase. Learn more about our shipping policies and return
              process.
            </p>
          </header>

          {/* Shipping Information */}
          <section className="mb-12">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Shipping Information
            </h2>

            <h3 className="mt-8 mb-4 font-semibold text-lg">
              Worldwide Delivery
            </h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              We ship to over 200 countries and regions worldwide. Orders are
              processed and shipped from our warehouse in Guangzhou, China.
            </p>

            <h3 className="mt-8 mb-4 font-semibold text-lg">Processing Time</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Order processing time varies by product type:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
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

            <h3 className="mt-8 mb-4 font-semibold text-lg">
              Shipping Methods & Delivery Times
            </h3>
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full rounded-lg border border-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                      Shipping Method
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                      Delivery Time
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                      Tracking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      Standard Shipping
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      15-25 business days
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      Express Shipping
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      7-12 business days
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      DHL/FedEx
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      3-7 business days
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm">
              * Delivery times are estimates and may vary depending on customs
              processing and local postal services.
            </p>
          </section>

          {/* Shipping Costs */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Shipping Costs
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Shipping costs are calculated based on:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
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

            <div className="my-6 rounded-lg bg-gray-50 p-6">
              <p className="mb-3 font-semibold text-gray-900 text-sm">
                Free Shipping
              </p>
              <p className="text-gray-700 text-sm">
                We offer free standard shipping on orders over $500. Express and
                DHL/FedEx options are available at additional cost.
              </p>
            </div>
          </section>

          {/* Customs & Import Duties */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Customs & Import Duties
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              International orders may be subject to customs duties and taxes
              imposed by the destination country. These fees are the
              responsibility of the recipient and are not included in the
              product price or shipping cost.
            </p>

            <h3 className="mt-8 mb-4 font-semibold text-lg">What to Expect</h3>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Customs authorities may contact you to pay duties before
                  delivery
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Delays may occur during customs clearance</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We cannot predict or control customs fees</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Some countries have duty-free thresholds for imports
                </span>
              </li>
            </ul>

            <div className="my-6 rounded-lg bg-yellow-50 p-4">
              <p className="text-gray-700 text-sm">
                <strong>Important:</strong> Please check your country's import
                regulations before placing an order. Refusal to pay customs fees
                may result in package return or destruction.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Order Tracking
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Once your order is shipped, you will receive an email notification
              containing:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
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
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              You can track your order status through the carrier's website or
              contact our customer service team for assistance.
            </p>
          </section>

          {/* Returns & Exchanges */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Returns & Exchanges
            </h2>

            <h3 className="mt-8 mb-4 font-semibold text-lg">Return Policy</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              We want you to be completely satisfied with your purchase. If you
              are not satisfied for any reason, you may return eligible items
              within 30 days of delivery.
            </p>

            <h3 className="mt-8 mb-4 font-semibold text-lg">
              Return Conditions
            </h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Items must meet the following conditions to be eligible for
              return:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Unused and in original condition</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Original packaging and tags intact</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No signs of wear or damage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Proof of purchase (order number or receipt)</span>
              </li>
            </ul>

            <h3 className="mt-8 mb-4 font-semibold text-lg">
              Non-Returnable Items
            </h3>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
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
                <span>Items that have been worn or damaged after delivery</span>
              </li>
            </ul>

            <h3 className="mt-8 mb-4 font-semibold text-lg">
              How to Initiate a Return
            </h3>
            <ol className="mb-6 list-inside list-decimal space-y-3 text-gray-700 text-sm md:text-base">
              <li>
                Contact our customer service team within 30 days of delivery
              </li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping instructions</li>
              <li>Package the item securely in original packaging</li>
              <li>Ship the item back to us using the provided method</li>
              <li>
                We will process your return within 5-7 business days of receipt
              </li>
            </ol>

            <h3 className="mt-8 mb-4 font-semibold text-lg">Refunds</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Refunds will be issued to the original payment method within 5-7
              business days after we receive and inspect the returned item.
              Please note:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Original shipping costs are non-refundable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Return shipping costs are the customer's responsibility unless
                  the item is defective or incorrect
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Refund processing time depends on your payment provider
                </span>
              </li>
            </ul>

            <h3 className="mt-8 mb-4 font-semibold text-lg">Exchanges</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              If you need a different size or style, we recommend placing a new
              order for the desired item and returning the original item
              following our return process. This ensures you get the item you
              want as quickly as possible.
            </p>
          </section>

          {/* Damaged or Defective Items */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Damaged or Defective Items
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              If you receive a damaged or defective item, please contact us
              immediately. We will arrange for a replacement or full refund,
              including shipping costs.
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contact us within 48 hours of delivery</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Provide photos of the damage or defect</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep all packaging if possible</span>
              </li>
            </ul>
          </section>

          {/* Cancellations */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Order Cancellations
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              You may cancel your order within 24 hours of placing it, provided
              it has not yet been processed or shipped. After this time,
              cancellations may not be possible, and you will need to follow our
              return policy.
            </p>

            <h3 className="mt-8 mb-4 font-semibold text-lg">Custom Orders</h3>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Custom or personalized orders cannot be cancelled once production
              has begun. Please ensure all details are correct before placing
              your order.
            </p>
          </section>

          {/* Contact for Shipping Questions */}
          <section className="mb-12 border-gray-200 border-t pt-8">
            <h2 className="mt-12 mb-6 font-serif text-xl italic md:text-2xl">
              Questions About Shipping or Returns?
            </h2>
            <p className="mb-4 text-gray-700 text-sm leading-relaxed md:text-base">
              Our customer service team is here to help with any questions about
              shipping, returns, or your order.
            </p>
            <div className="my-6 rounded-lg bg-gray-50 p-6">
              <p className="mb-2 text-gray-700 text-sm">
                <strong>Email:</strong>{" "}
                <a
                  className="text-blue-600 underline hover:text-blue-800"
                  href="mailto:info@dongqifootwear.com"
                >
                  info@dongqifootwear.com
                </a>
              </p>
              <p className="mb-2 text-gray-700 text-sm">
                <strong>Phone:</strong>{" "}
                <a
                  className="text-blue-600 hover:text-blue-800"
                  href="tel:+8615920611313"
                >
                  +86 159-2061-1313
                </a>
              </p>
              <p className="text-gray-700 text-sm">
                <strong>WhatsApp:</strong>{" "}
                <a
                  className="text-blue-600 hover:text-blue-800"
                  href="https://wa.me/8615920611313"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  +86 159-2061-1313
                </a>
              </p>
            </div>
          </section>
    </div>
  );
}

export default ShippingPage;
