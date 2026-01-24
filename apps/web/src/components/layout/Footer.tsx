import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useSiteConfigList } from "@/hooks/api/site-config";

const Footer: React.FC = () => {
  const { data: site_phone } = useSiteConfigList({
    query: {
      key: "site_phone",
    },
  });
  const { data: site_copyright } = useSiteConfigList({
    query: {
      key: "site_copyright",
    },
  });
  const { data: site_email } = useSiteConfigList({
    query: {
      key: "site_email",
    },
  });

  return (
    <footer className="border-gray-200 border-t bg-white pt-20 pb-10">
      <div className="mx-auto max-w-350 px-6">
        {/* Newsletter */}
        <div className="mx-auto mb-20 max-w-xl text-center">
          <h4 className="mb-4 font-serif text-2xl">
            Join the World of DONGQIFOOTWEAR
          </h4>
          <p className="mb-8 text-gray-500 text-sm">
            Be the first to know about new collections and exclusive events.
          </p>
          <div className="flex border-black border-b pb-2">
            <input
              className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
              placeholder="E-mail Address"
              type="email"
            />
            <button className="font-bold text-xs uppercase tracking-widest hover:text-gray-600">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4 md:text-left">
          <div>
            <h5 className="mb-6 font-bold text-xs uppercase tracking-widest">
              Customer Care
            </h5>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li>
                <a className="hover:text-black" href="#">
                  Contact Us
                </a>
                <Link className="hover:text-black" href="/single/contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <a className="hover:text-black" href="#">
                  Shipping & Returns
                </a>
                <Link className="hover:text-black" href="/single/ship">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <a className="hover:text-black" href="#">
                  Size Guide
                </a>
                <Link className="hover:text-black" href="/single/size">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-xs uppercase tracking-widest">
              The Brand
            </h5>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li>
                <Link className="hover:text-black" href="/single/about">
                  About DONGQIFOOTWEAR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-xs uppercase tracking-widest">
              Legal
            </h5>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li>
                <Link className="hover:text-black" href="/single/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-black" href="/single/terms">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-xs uppercase tracking-widest">
              Follow Us
            </h5>
            <div className="flex justify-center space-x-6 text-gray-900 md:justify-start">
              <a className="hover:text-gray-500" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.535c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a className="hover:text-gray-500" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a className="hover:text-gray-500" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.572-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.548z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-gray-100 border-t pt-8 text-center text-gray-400 text-xs uppercase tracking-wider md:flex-row">
          <p>
            &copy;{" "}
            {`${new Date().getFullYear()} ${site_copyright?.[0]?.value || "error"}`}{" "}
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <span className="flex items-center">
              <svg t="1769240747545" className="mr-2 w-4 h-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5907"><path d="M511.872427 0h0.256C794.45376 0 1024.000427 229.674667 1024.000427 512s-229.589333 512-511.872 512c-104.106667 0-200.704-31.018667-281.6-84.565333L33.707093 1002.325333l63.786667-190.250666A508.245333 508.245333 0 0 1 0.000427 512C0.000427 229.674667 229.58976 0 511.872427 0zM365.39776 281.429333c-9.770667-23.338667-17.194667-24.234667-32-24.832A285.525333 285.525333 0 0 0 316.50176 256c-19.285333 0-39.424 5.632-51.626667 18.048C250.155093 289.109333 213.33376 324.266667 213.33376 396.501333c0 72.149333 52.778667 141.952 59.861333 151.722667 7.424 9.728 102.912 160 251.093334 221.226667 115.925333 47.914667 150.314667 43.477333 176.725333 37.845333 38.528-8.277333 86.826667-36.693333 98.986667-70.954667 12.16-34.346667 12.16-63.616 8.618666-69.845333-3.584-6.186667-13.354667-9.728-28.16-17.152-14.848-7.381333-86.869333-42.88-100.522666-47.616-13.354667-4.992-26.069333-3.242667-36.138667 10.965333-14.250667 19.797333-28.16 39.936-39.466667 52.053334-8.874667 9.472-23.424 10.666667-35.541333 5.632-16.298667-6.826667-61.952-22.784-118.314667-72.789334-43.562667-38.741333-73.216-86.954667-81.792-101.418666-8.618667-14.805333-0.896-23.381333 5.930667-31.36 7.381333-9.173333 14.506667-15.658667 21.930667-24.234667 7.424-8.576 11.52-13.013333 16.298666-23.082667 5.034667-9.770667 1.493333-19.84-2.090666-27.221333-3.541333-7.381333-33.194667-79.573333-45.354667-108.8z" fill="#25D366" p-id="5908"></path></svg>
              +86 {site_phone?.[0]?.value || "error"}
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13l8-6.99V6H4zm0 1.01L12 14l8-6.99V18H4V7.01z" />
              </svg>
              {site_email?.[0]?.value || "error"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
