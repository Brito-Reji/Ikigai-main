"use client";

import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
   
    //  Footer
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="text-xl font-bold">Ikigai</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering learners through accessible and engaging online
                education.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Help</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Latest Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Art & Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    IT & Software
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Languages
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Programming
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <p className="text-sm text-gray-400 mb-2">
                Address: 123 Main Street, Anytown, CA 12345
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Tel: +123 456 7890
                <br />
                Mail: hello@skilline.com
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-gray-900 text-sm">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-gray-900 text-sm">in</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-gray-900 text-sm">G</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-gray-900 text-sm">tw</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-gray-900 text-sm">ig</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
   
  );
}
