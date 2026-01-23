import { useSiteConfigList } from "@/hooks/api/site-config";
import Link from "next/link";
import type React from "react";

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
                <a className="hover:text-black" href="#">
                  Privacy Policy
                </a>
                <Link className="hover:text-black" href="/single/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a className="hover:text-black" href="#">
                  Terms & Conditions
                </a>
                <Link className="hover:text-black" href="/single/terms">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* <div>
            <h5 className="mb-6 font-bold text-xs uppercase tracking-widest">
              Follow Us
            </h5>
            <div className="flex justify-center space-x-6 text-gray-900 md:justify-start">
              <a className="hover:text-gray-500" href="#">
                <Instagram className="h-5 w-5" />
              </a>
              <a className="hover:text-gray-500" href="#">
                <Facebook className="h-5 w-5" />
              </a>
              <a className="hover:text-gray-500" href="#">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div> */}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-gray-100 border-t pt-8 text-center text-gray-400 text-xs uppercase tracking-wider md:flex-row">
          <p>&copy; {`${new Date().getFullYear()} ${site_copyright?.[0]?.value || "error"}`}  </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <span>+86 {site_phone?.[0]?.value || "error"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
