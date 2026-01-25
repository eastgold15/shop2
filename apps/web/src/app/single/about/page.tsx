function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-6 font-serif text-4xl italic md:text-6xl">
            About DONGQIFOOTWEAR
          </h1>
          <p className="mx-auto max-w-3xl text-gray-700 text-lg md:text-xl">
            Your trusted partner in quality footwear manufacturing, delivering
            excellence to customers worldwide since 2010.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="mb-6 font-serif text-2xl italic md:text-3xl">
            Our Story
          </h2>
          <p className="mb-6 text-base text-gray-700 leading-relaxed md:text-lg">
            Founded in 2010, DONGQIFOOTWEAR has grown from a small local
            workshop to a recognized name in the global footwear industry. Based
            in Guangzhou, China, we have spent over a decade perfecting the art
            of shoe manufacturing, combining traditional craftsmanship with
            modern technology.
          </p>
          <p className="mb-6 text-base text-gray-700 leading-relaxed md:text-lg">
            Our journey began with a simple mission: to create high-quality,
            comfortable footwear that doesn&apos;t compromise on style. Today,
            we partner with retailers, distributors, and brands around the
            world, delivering products that meet international standards of
            quality and design.
          </p>
          <p className="text-base text-gray-700 leading-relaxed md:text-lg">
            With state-of-the-art manufacturing facilities and a team of skilled
            artisans, we produce over 1 million pairs of shoes annually, serving
            customers in more than 50 countries across Europe, North America,
            Asia, and beyond.
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-16 border-gray-200 border-t pt-12">
          <h2 className="mb-6 font-serif text-2xl italic md:text-3xl">
            Our Mission
          </h2>
          <div className="rounded-lg bg-gray-50 p-8">
            <p className="text-center text-base text-gray-700 leading-relaxed md:text-lg">
              To provide exceptional footwear that combines quality, comfort,
              and style while building lasting relationships with our customers
              and partners. We are committed to sustainable manufacturing
              practices and continuous innovation in design and production.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16 border-gray-200 border-t pt-12">
          <h2 className="mb-8 font-serif text-2xl italic md:text-3xl">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-xl">Quality First</h3>
              <p className="text-gray-700 leading-relaxed">
                We never compromise on quality. Every pair of shoes undergoes
                rigorous quality control to ensure it meets our exacting
                standards.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-xl">
                Customer Satisfaction
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our customers are at the heart of everything we do. We listen,
                adapt, and deliver products that exceed expectations.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-xl">Integrity</h3>
              <p className="text-gray-700 leading-relaxed">
                We conduct business with honesty and transparency. Trust is the
                foundation of our relationships with clients and partners.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-semibold text-xl">Innovation</h3>
              <p className="text-gray-700 leading-relaxed">
                We continuously improve our processes and designs, embracing new
                technologies and sustainable practices.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16 border-gray-200 border-t pt-12">
          <h2 className="mb-8 font-serif text-2xl italic md:text-3xl">
            What We Offer
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-semibold text-xl">
                Manufacturing Excellence
              </h3>
              <p className="mb-4 text-base text-gray-700 leading-relaxed md:text-lg">
                Our 15,000 square meter facility is equipped with modern
                machinery and staffed by experienced craftsmen. We specialize
                in:
              </p>
              <ul className="ml-6 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Athletic shoes and sneakers for men, women, and children
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Casual and formal footwear for all occasions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Custom designs and OEM/ODM services</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Private label manufacturing for brands worldwide</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-xl">
                Services & Capabilities
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-5">
                  <h4 className="mb-2 font-semibold">Custom Design</h4>
                  <p className="text-gray-700 text-sm">
                    Bring your vision to life with our design team. From concept
                    to production, we support you every step of the way.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <h4 className="mb-2 font-semibold">Sample Development</h4>
                  <p className="text-gray-700 text-sm">
                    Quick turnaround on samples, allowing you to evaluate and
                    refine designs before bulk production.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <h4 className="mb-2 font-semibold">Quality Assurance</h4>
                  <p className="text-gray-700 text-sm">
                    Comprehensive QC processes ensure every product meets
                    international standards and your specifications.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <h4 className="mb-2 font-semibold">Global Logistics</h4>
                  <p className="text-gray-700 text-sm">
                    Efficient shipping and logistics solutions to deliver
                    products to your doorstep anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="mb-16 border-gray-200 border-t pt-12">
          <h2 className="mb-6 font-serif text-2xl italic md:text-3xl">
            Sustainability Commitment
          </h2>
          <p className="mb-6 text-base text-gray-700 leading-relaxed md:text-lg">
            We recognize our responsibility to the environment and are committed
            to sustainable manufacturing practices. Our initiatives include:
          </p>
          <ul className="mb-6 space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong>Eco-Friendly Materials:</strong> Increasing use of
                sustainable and recycled materials in our products
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong>Waste Reduction:</strong> Implementing processes to
                minimize production waste and improve recycling
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong>Energy Efficiency:</strong> Investing in
                energy-efficient machinery and renewable energy sources
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                <strong>Ethical Labor Practices:</strong> Ensuring fair wages
                and safe working conditions for all employees
              </span>
            </li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16 border-gray-200 border-t pt-12">
          <h2 className="mb-8 font-serif text-2xl italic md:text-3xl">
            Why Choose DONGQIFOOTWEAR?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-gray-900">14+</div>
              <p className="text-gray-700">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-gray-900">1M+</div>
              <p className="text-gray-700">Pairs Produced Annually</p>
            </div>
            <div className="text-center">
              <div className="mb-2 font-bold text-4xl text-gray-900">50+</div>
              <p className="text-gray-700">Countries Served</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Competitive Pricing</h3>
                <p className="text-gray-700 text-sm">
                  Factory-direct prices without compromising on quality
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Fast Turnaround</h3>
                <p className="text-gray-700 text-sm">
                  Quick production and delivery to meet your deadlines
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Flexible Orders</h3>
                <p className="text-gray-700 text-sm">
                  From small batches to large wholesale orders
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Dedicated Support</h3>
                <p className="text-gray-700 text-sm">
                  Personal service from experienced team members
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get In Touch */}
        <section className="mb-12 border-gray-200 border-t pt-12">
          <h2 className="mb-6 font-serif text-2xl italic md:text-3xl">
            Let&apos;s Work Together
          </h2>
          <p className="mb-8 text-base text-gray-700 leading-relaxed md:text-lg">
            Whether you are a retailer looking for quality footwear, a brand
            seeking manufacturing partners, or a customer with questions, we
            would love to hear from you.
          </p>

          <div className="rounded-lg bg-gray-50 p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
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

              <div>
                <p className="mb-2 font-semibold text-gray-900 text-sm">
                  Visit Our Factory
                </p>
                <p className="text-gray-700 text-sm">
                  DONGQIFOOTWEAR Shoes Ltd.
                  <br />
                  Guangzhou, Guangdong Province
                  <br />
                  China
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-block bg-black px-8 py-3 text-center font-semibold text-sm text-white uppercase tracking-wider hover:bg-gray-800"
                href="/single/contact"
              >
                Contact Us
              </a>
              <a
                className="inline-block border border-black px-8 py-3 text-center font-semibold text-black text-sm uppercase tracking-wider hover:bg-gray-100"
                href="/single/ship"
              >
                Shipping Info
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
