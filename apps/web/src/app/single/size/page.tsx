import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

function SizeGuidePage() {
  return (
    <div className="relative min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl italic mb-4">
              Size Guide
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-700">
              Find your perfect fit with our comprehensive size guide. We provide
              detailed measurements and conversion charts to help you choose the
              right size.
            </p>
          </header>

          {/* How to Measure */}
          <section className="mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              How to Measure Your Feet
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              For the most accurate results, measure your feet at the end of the
              day when they are at their largest. Follow these simple steps:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Step 1: Prepare</h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Wear the type of socks you would normally wear with the shoes.
                  Place a piece of paper on a hard, flat surface.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Step 2: Foot Length</h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Place your foot flat on the paper. Mark the longest toe and the
                  back of your heel. Measure the distance between these two points
                  in centimeters.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">
                  Step 3: Foot Width (Optional)
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Wrap a measuring tape around the widest part of your foot (usually
                  across the ball of your foot). Record the measurement in
                  centimeters.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Step 4: Compare</h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Use the larger measurement if your feet are different sizes.
                  Compare your measurements to our size chart below.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg my-6">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> If you are between sizes, we recommend sizing
                up for a more comfortable fit, especially for closed-toe shoes.
              </p>
            </div>
          </section>

          {/* Shoe Size Conversion Chart */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Shoe Size Conversion Chart
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              Use this chart to convert between different sizing systems. All
              measurements are in centimeters (foot length).
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Foot Length (cm)
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      US
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      UK
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      EU
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      JP
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      CN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">22.0</td>
                    <td className="px-3 py-2 text-gray-700">4</td>
                    <td className="px-3 py-2 text-gray-700">3</td>
                    <td className="px-3 py-2 text-gray-700">35</td>
                    <td className="px-3 py-2 text-gray-700">22.0</td>
                    <td className="px-3 py-2 text-gray-700">35</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">22.5</td>
                    <td className="px-3 py-2 text-gray-700">5</td>
                    <td className="px-3 py-2 text-gray-700">4</td>
                    <td className="px-3 py-2 text-gray-700">36</td>
                    <td className="px-3 py-2 text-gray-700">22.5</td>
                    <td className="px-3 py-2 text-gray-700">36</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">23.0</td>
                    <td className="px-3 py-2 text-gray-700">5.5</td>
                    <td className="px-3 py-2 text-gray-700">4.5</td>
                    <td className="px-3 py-2 text-gray-700">37</td>
                    <td className="px-3 py-2 text-gray-700">23.0</td>
                    <td className="px-3 py-2 text-gray-700">37</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">23.5</td>
                    <td className="px-3 py-2 text-gray-700">6</td>
                    <td className="px-3 py-2 text-gray-700">5</td>
                    <td className="px-3 py-2 text-gray-700">38</td>
                    <td className="px-3 py-2 text-gray-700">23.5</td>
                    <td className="px-3 py-2 text-gray-700">38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">24.0</td>
                    <td className="px-3 py-2 text-gray-700">6.5</td>
                    <td className="px-3 py-2 text-gray-700">5.5</td>
                    <td className="px-3 py-2 text-gray-700">38.5</td>
                    <td className="px-3 py-2 text-gray-700">24.0</td>
                    <td className="px-3 py-2 text-gray-700">39</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">24.5</td>
                    <td className="px-3 py-2 text-gray-700">7</td>
                    <td className="px-3 py-2 text-gray-700">6</td>
                    <td className="px-3 py-2 text-gray-700">39</td>
                    <td className="px-3 py-2 text-gray-700">24.5</td>
                    <td className="px-3 py-2 text-gray-700">40</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">25.0</td>
                    <td className="px-3 py-2 text-gray-700">7.5</td>
                    <td className="px-3 py-2 text-gray-700">6.5</td>
                    <td className="px-3 py-2 text-gray-700">40</td>
                    <td className="px-3 py-2 text-gray-700">25.0</td>
                    <td className="px-3 py-2 text-gray-700">40.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">25.5</td>
                    <td className="px-3 py-2 text-gray-700">8</td>
                    <td className="px-3 py-2 text-gray-700">7</td>
                    <td className="px-3 py-2 text-gray-700">41</td>
                    <td className="px-3 py-2 text-gray-700">25.5</td>
                    <td className="px-3 py-2 text-gray-700">41</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">26.0</td>
                    <td className="px-3 py-2 text-gray-700">8.5</td>
                    <td className="px-3 py-2 text-gray-700">7.5</td>
                    <td className="px-3 py-2 text-gray-700">42</td>
                    <td className="px-3 py-2 text-gray-700">26.0</td>
                    <td className="px-3 py-2 text-gray-700">42</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">26.5</td>
                    <td className="px-3 py-2 text-gray-700">9</td>
                    <td className="px-3 py-2 text-gray-700">8</td>
                    <td className="px-3 py-2 text-gray-700">42.5</td>
                    <td className="px-3 py-2 text-gray-700">26.5</td>
                    <td className="px-3 py-2 text-gray-700">43</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">27.0</td>
                    <td className="px-3 py-2 text-gray-700">9.5</td>
                    <td className="px-3 py-2 text-gray-700">8.5</td>
                    <td className="px-3 py-2 text-gray-700">43</td>
                    <td className="px-3 py-2 text-gray-700">27.0</td>
                    <td className="px-3 py-2 text-gray-700">43.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">27.5</td>
                    <td className="px-3 py-2 text-gray-700">10</td>
                    <td className="px-3 py-2 text-gray-700">9</td>
                    <td className="px-3 py-2 text-gray-700">44</td>
                    <td className="px-3 py-2 text-gray-700">27.5</td>
                    <td className="px-3 py-2 text-gray-700">44</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">28.0</td>
                    <td className="px-3 py-2 text-gray-700">10.5</td>
                    <td className="px-3 py-2 text-gray-700">9.5</td>
                    <td className="px-3 py-2 text-gray-700">45</td>
                    <td className="px-3 py-2 text-gray-700">28.0</td>
                    <td className="px-3 py-2 text-gray-700">45</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">28.5</td>
                    <td className="px-3 py-2 text-gray-700">11</td>
                    <td className="px-3 py-2 text-gray-700">10</td>
                    <td className="px-3 py-2 text-gray-700">45.5</td>
                    <td className="px-3 py-2 text-gray-700">28.5</td>
                    <td className="px-3 py-2 text-gray-700">46</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">29.0</td>
                    <td className="px-3 py-2 text-gray-700">11.5</td>
                    <td className="px-3 py-2 text-gray-700">10.5</td>
                    <td className="px-3 py-2 text-gray-700">46</td>
                    <td className="px-3 py-2 text-gray-700">29.0</td>
                    <td className="px-3 py-2 text-gray-700">46.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">29.5</td>
                    <td className="px-3 py-2 text-gray-700">12</td>
                    <td className="px-3 py-2 text-gray-700">11</td>
                    <td className="px-3 py-2 text-gray-700">47</td>
                    <td className="px-3 py-2 text-gray-700">29.5</td>
                    <td className="px-3 py-2 text-gray-700">47</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">30.0</td>
                    <td className="px-3 py-2 text-gray-700">12.5</td>
                    <td className="px-3 py-2 text-gray-700">11.5</td>
                    <td className="px-3 py-2 text-gray-700">47.5</td>
                    <td className="px-3 py-2 text-gray-700">30.0</td>
                    <td className="px-3 py-2 text-gray-700">48</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 text-gray-700">30.5</td>
                    <td className="px-3 py-2 text-gray-700">13</td>
                    <td className="px-3 py-2 text-gray-700">12</td>
                    <td className="px-3 py-2 text-gray-700">48</td>
                    <td className="px-3 py-2 text-gray-700">30.5</td>
                    <td className="px-3 py-2 text-gray-700">48.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600">
              * This chart is a general guide. Sizing may vary slightly between
              different styles and manufacturers.
            </p>
          </section>

          {/* Men's & Women's Sizes */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Men&apos;s & Women&apos;s Size Conversion
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              If you know your size in one gender, you can easily convert to the
              other. Generally, men&apos;s sizes are about 1.5 sizes larger than
              women&apos;s.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Women&apos;s US
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Men&apos;s US
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      EU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Foot Length (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">5</td>
                    <td className="px-4 py-2 text-gray-700">3.5</td>
                    <td className="px-4 py-2 text-gray-700">35</td>
                    <td className="px-4 py-2 text-gray-700">22.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">6</td>
                    <td className="px-4 py-2 text-gray-700">4.5</td>
                    <td className="px-4 py-2 text-gray-700">37</td>
                    <td className="px-4 py-2 text-gray-700">23.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">7</td>
                    <td className="px-4 py-2 text-gray-700">5.5</td>
                    <td className="px-4 py-2 text-gray-700">38</td>
                    <td className="px-4 py-2 text-gray-700">23.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">8</td>
                    <td className="px-4 py-2 text-gray-700">6.5</td>
                    <td className="px-4 py-2 text-gray-700">39</td>
                    <td className="px-4 py-2 text-gray-700">24.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">9</td>
                    <td className="px-4 py-2 text-gray-700">7.5</td>
                    <td className="px-4 py-2 text-gray-700">40</td>
                    <td className="px-4 py-2 text-gray-700">25.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">10</td>
                    <td className="px-4 py-2 text-gray-700">8.5</td>
                    <td className="px-4 py-2 text-gray-700">42</td>
                    <td className="px-4 py-2 text-gray-700">26.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">11</td>
                    <td className="px-4 py-2 text-gray-700">9.5</td>
                    <td className="px-4 py-2 text-gray-700">43</td>
                    <td className="px-4 py-2 text-gray-700">27.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">12</td>
                    <td className="px-4 py-2 text-gray-700">10.5</td>
                    <td className="px-4 py-2 text-gray-700">45</td>
                    <td className="px-4 py-2 text-gray-700">28.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Width Guide */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Width Guide
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              Shoe width is indicated by letters. If you have wider or narrower
              feet than average, consider the width when selecting your size.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Width
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Women&apos;s
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Men&apos;s
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">Extra Narrow</td>
                    <td className="px-4 py-2 text-gray-700">4A / SS</td>
                    <td className="px-4 py-2 text-gray-700">-</td>
                    <td className="px-4 py-2 text-gray-700">Very slim fit</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">Narrow</td>
                    <td className="px-4 py-2 text-gray-700">2A / N</td>
                    <td className="px-4 py-2 text-gray-700">B / N</td>
                    <td className="px-4 py-2 text-gray-700">Slim fit</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">Medium/Normal</td>
                    <td className="px-4 py-2 text-gray-700">B / M</td>
                    <td className="px-4 py-2 text-gray-700">D / M</td>
                    <td className="px-4 py-2 text-gray-700">Standard fit</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">Wide</td>
                    <td className="px-4 py-2 text-gray-700">D / W</td>
                    <td className="px-4 py-2 text-gray-700">EE / 2E / W</td>
                    <td className="px-4 py-2 text-gray-700">Roomier fit</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">Extra Wide</td>
                    <td className="px-4 py-2 text-gray-700">2E / EE / WW</td>
                    <td className="px-4 py-2 text-gray-700">EEE / 4E / WW</td>
                    <td className="px-4 py-2 text-gray-700">Maximum room</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg my-6">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Our footwear is designed with a standard (D)
                width for men and (B) width for women. If you need wider or narrower
                widths, please contact us for availability.
              </p>
            </div>
          </section>

          {/* Tips for Finding the Right Fit */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Tips for Finding the Right Fit
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Consider the Shoe Style
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Different shoe styles fit differently. Athletic shoes often run
                  smaller and may require sizing up, while sandals and boots may have
                  more room and allow for your regular size.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Leave Room for Toe Movement
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  There should be about a thumb&apos;s width (approximately 1cm)
                  between your longest toe and the front of the shoe. This allows
                  for natural foot movement and comfort when walking.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Account for Socks
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  If you plan to wear thick socks with your shoes (like winter
                  boots), you may need to size up or consider a wider width to
                  accommodate the extra bulk.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Measure Both Feet
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Most people have one foot that is slightly larger than the other.
                  Always choose the size that fits your larger foot comfortably.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Time of Day Matters
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Feet naturally swell throughout the day, especially after walking
                  or standing. Measure your feet in the late afternoon or evening
                  for the most accurate sizing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Break-In Period</h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-700">
                  Some materials, particularly leather, will stretch slightly with
                  wear. A snug fit initially may become more comfortable over time.
                  However, shoes should never be painful to wear.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Sizes (Optional) */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Children&apos;s Size Guide
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              Measure your child&apos;s feet regularly as they grow quickly.
              Children&apos;s shoes should have about 1cm of growth room.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Age (Approx.)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      US Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      EU Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      UK Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      Foot Length (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">1-2 years</td>
                    <td className="px-4 py-2 text-gray-700">5-6</td>
                    <td className="px-4 py-2 text-gray-700">21-22</td>
                    <td className="px-4 py-2 text-gray-700">4-5</td>
                    <td className="px-4 py-2 text-gray-700">11.5-12.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">2-3 years</td>
                    <td className="px-4 py-2 text-gray-700">7-8</td>
                    <td className="px-4 py-2 text-gray-700">23-24</td>
                    <td className="px-4 py-2 text-gray-700">6-7</td>
                    <td className="px-4 py-2 text-gray-700">13.5-14.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">3-4 years</td>
                    <td className="px-4 py-2 text-gray-700">9-10</td>
                    <td className="px-4 py-2 text-gray-700">25-26</td>
                    <td className="px-4 py-2 text-gray-700">8-9</td>
                    <td className="px-4 py-2 text-gray-700">15.5-16.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">4-5 years</td>
                    <td className="px-4 py-2 text-gray-700">11-12</td>
                    <td className="px-4 py-2 text-gray-700">28-30</td>
                    <td className="px-4 py-2 text-gray-700">10-11</td>
                    <td className="px-4 py-2 text-gray-700">17.5-18.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">5-6 years</td>
                    <td className="px-4 py-2 text-gray-700">12.5-13</td>
                    <td className="px-4 py-2 text-gray-700">31-32</td>
                    <td className="px-4 py-2 text-gray-700">11.5-12</td>
                    <td className="px-4 py-2 text-gray-700">19.5-20.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">6-7 years</td>
                    <td className="px-4 py-2 text-gray-700">13.5-1 (Youth)</td>
                    <td className="px-4 py-2 text-gray-700">33-34</td>
                    <td className="px-4 py-2 text-gray-700">12.5-13</td>
                    <td className="px-4 py-2 text-gray-700">20.5-21.0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-700">7-8 years</td>
                    <td className="px-4 py-2 text-gray-700">2-3 (Youth)</td>
                    <td className="px-4 py-2 text-gray-700">35-36</td>
                    <td className="px-4 py-2 text-gray-700">1-2</td>
                    <td className="px-4 py-2 text-gray-700">21.5-22.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Still Need Help? */}
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-serif text-xl md:text-2xl italic mt-12 mb-6">
              Still Need Help?
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-6">
              If you are unsure about sizing or have specific questions about a
              particular style, our customer service team is here to help.
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
            <p className="text-sm md:text-base leading-relaxed text-gray-700">
              For more detailed information about returns and exchanges if the size
              does not fit, please visit our{" "}
              <a href="/single/ship" className="text-blue-600 hover:text-blue-800 underline">
                Shipping & Returns
              </a>{" "}
              page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SizeGuidePage;
