import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-12 pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand & Description */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md">
              M
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Market<span className="text-blue-600">Pulse</span></span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6 pr-4">
            Market Pulse is a real-time cryptocurrency dashboard built as a technical demonstration. It features live market data processing, historical ROI calculations, and macro-economic sentiment analysis.
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded flex items-center gap-2">
              <span className="text-xl">✓</span> 
              <div>
                <div className="uppercase">React.js</div>
                <div className="font-normal opacity-80">Frontend App</div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Column 1: Platform */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">Platform</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Cryptocurrencies</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">My Watchlist</a></li>
          </ul>
        </div>

        {/* Links Column 2: Data Providers (Kredit API) */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">Data Providers</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                CoinGecko API <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                Alternative.me API <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Developer Connect */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">Developer</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                <Github size={16} /> GitHub Repository
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn Profile
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} Market Pulse Project. Developed for portfolio demonstration.
        </div>
        <div className="text-xs text-slate-400 text-center md:text-right max-w-xl">
          IMPORTANT DISCLAIMER: All data presented in this application is fetched from free public APIs. It is not intended to be used as actual financial or investment advice.
        </div>
      </div>
    </footer>
  );
};