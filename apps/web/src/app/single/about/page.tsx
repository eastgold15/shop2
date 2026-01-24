import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

function AboutPage() {
  return (
    <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        {/* Hero Section */}
        <section className="bg-gray-100 py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl md:text-6xl italic mb-6">
              About DONGQIFOOTWEAR
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Your trusted partner in quality footwear manufacturing, delivering
              excellence to customers worldwide since 2010.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Our Story */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-6">
              Our Story
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-6">
              Founded in 2010, DONGQIFOOTWEAR has grown from a small local workshop
              to a recognized name in the global footwear industry. Based in
              Guangzhou, China, we have spent over a decade perfecting the art of
              shoe manufacturing, combining traditional craftsmanship with modern
              technology.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-6">
              Our journey began with a simple mission: to create high-quality,
              comfortable footwear that doesn&apos;t compromise on style. Today, we
              partner with retailers, distributors, and brands around the world,
              delivering products that meet international standards of quality and
              design.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              With state-of-the-art manufacturing facilities and a team of skilled
              artisans, we produce over 1 million pairs of shoes annually, serving
              customers in more than 50 countries across Europe, North America,
              Asia, and beyond.
            </p>
          </section>

          {/* Our Mission */}
          <section className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-6">
              Our Mission
            </h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <p className="text-base md:text-lg leading-relaxed text-gray-700 text-center">
                To provide exceptional footwear that combines quality, comfort, and
                style while building lasting relationships with our customers and
                partners. We are committed to sustainable manufacturing practices
                and continuous innovation in design and production.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-3">Quality First</h3>
                <p className="text-gray-700 leading-relaxed">
                  We never compromise on quality. Every pair of shoes undergoes
                  rigorous quality control to ensure it meets our exacting standards.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-3">
                  Customer Satisfaction
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our customers are at the heart of everything we do. We listen,
                  adapt, and deliver products that exceed expectations.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-3">Integrity</h3>
                <p className="text-gray-700 leading-relaxed">
                  We conduct business with honesty and transparency. Trust is the
                  foundation of our relationships with clients and partners.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-3">Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We continuously improve our processes and designs, embracing new
                  technologies and sustainable practices.
                </p>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-8">
              What We Offer
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-xl mb-4">
                  Manufacturing Excellence
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4">
                  Our 15,000 square meter facility is equipped with modern machinery
                  and staffed by experienced craftsmen. We specialize in:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Athletic shoes and sneakers for men, women, and children
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Casual and formal footwear for all occasions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Custom designs and OEM/ODM services
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Private label manufacturing for brands worldwide
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-4">
                  Services & Capabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-semibold mb-2">Custom Design</h4>
                    <p className="text-sm text-gray-700">
                      Bring your vision to life with our design team. From concept to
                      production, we support you every step of the way.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-semibold mb-2">Sample Development</h4>
                    <p className="text-sm text-gray-700">
                      Quick turnaround on samples, allowing you to evaluate and refine
                      designs before bulk production.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Quality Assurance
                    </h4>
                    <p className="text-sm text-gray-700">
                      Comprehensive QC processes ensure every product meets
                      international standards and your specifications.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-semibold mb-2">Global Logistics</h4>
                    <p className="text-sm text-gray-700">
                      Efficient shipping and logistics solutions to deliver products
                      to your doorstep anywhere in the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sustainability */}
          <section className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-6">
              Sustainability Commitment
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-6">
              We recognize our responsibility to the environment and are committed to
              sustainable manufacturing practices. Our initiatives include:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Eco-Friendly Materials:</strong> Increasing use of sustainable
                  and recycled materials in our products
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Waste Reduction:</strong> Implementing processes to minimize
                  production waste and improve recycling
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Energy Efficiency:</strong> Investing in energy-efficient
                  machinery and renewable energy sources
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Ethical Labor Practices:</strong> Ensuring fair wages and
                  safe working conditions for all employees
                </span>
              </li>
            </ul>
          </section>

          {/* Why Choose Us */}
          <section className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-8">
              Why Choose DONGQIFOOTWEAR?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  14+
                </div>
                <p className="text-gray-700">Years of Experience</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  1M+
                </div>
                <p className="text-gray-700">Pairs Produced Annually</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  50+
                </div>
                <p className="text-gray-700">Countries Served</p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                  <p className="text-gray-700 text-sm">
                    Factory-direct prices without compromising on quality
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fast Turnaround</h3>
                  <p className="text-gray-700 text-sm">
                    Quick production and delivery to meet your deadlines
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Flexible Orders</h3>
                  <p className="text-gray-700 text-sm">
                    From small batches to large wholesale orders
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Dedicated Support</h3>
                  <p className="text-gray-700 text-sm">
                    Personal service from experienced team members
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Get In Touch */}
          <section className="border-t border-gray-200 pt-12 mb-12">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-6">
              Let&apos;s Work Together
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
              Whether you are a retailer looking for quality footwear, a brand
              seeking manufacturing partners, or a customer with questions, we would
              love to hear from you.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Visit Our Factory
                  </p>
                  <p className="text-sm text-gray-700">
                    DONGQIFOOTWEAR Shoes Ltd.
                    <br />
                    Guangzhou, Guangdong Province
                    <br />
                    China
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="/single/contact"
                  className="inline-block bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 text-center"
                >
                  Contact Us
                </a>
                <a
                  href="/single/ship"
                  className="inline-block border border-black text-black px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-100 text-center"
                >
                  Shipping Info
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;
