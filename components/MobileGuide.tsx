
import React from 'react';

interface MobileGuideProps {
  onClose: () => void;
}

const MobileGuide: React.FC<MobileGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 bg-indigo-600 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">
            <i className="fas fa-mobile-alt"></i>
          </div>
          <h3 className="text-3xl font-black leading-tight">Install on your Phone</h3>
          <p className="text-indigo-100 mt-2 font-medium">Carry your travel pass anywhere</p>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
          <section>
            <h4 className="flex items-center gap-3 font-black text-slate-900 mb-4 uppercase tracking-wider text-sm">
              <span className="h-6 w-6 bg-slate-100 rounded flex items-center justify-center text-xs">01</span>
              Host the Application
            </h4>
            <div className="pl-9 space-y-2">
              <p className="text-sm text-slate-600">Deploy this code to <span className="font-bold text-indigo-600">Vercel</span> or <span className="font-bold text-indigo-600">Netlify</span> for a live URL.</p>
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-3 font-black text-slate-900 mb-4 uppercase tracking-wider text-sm">
              <span className="h-6 w-6 bg-slate-100 rounded flex items-center justify-center text-xs">02</span>
              iOS (iPhone/iPad)
            </h4>
            <ul className="pl-9 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <i className="fas fa-compass mt-1 text-indigo-400"></i>
                <span>Open your live URL in <b>Safari</b>.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-share-square mt-1 text-indigo-400"></i>
                <span>Tap the <b>Share</b> button in the toolbar.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-plus-square mt-1 text-indigo-400"></i>
                <span>Select <b>"Add to Home Screen"</b>.</span>
              </li>
            </ul>
          </section>

          <section>
            <h4 className="flex items-center gap-3 font-black text-slate-900 mb-4 uppercase tracking-wider text-sm">
              <span className="h-6 w-6 bg-slate-100 rounded flex items-center justify-center text-xs">03</span>
              Android Devices
            </h4>
            <ul className="pl-9 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <i className="fab fa-chrome mt-1 text-indigo-400"></i>
                <span>Open your URL in <b>Chrome</b>.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-ellipsis-v mt-1 text-indigo-400"></i>
                <span>Tap the menu (three dots) icon.</span>
              </li>
              <li className="flex gap-2">
                <i className="fas fa-arrow-alt-circle-down mt-1 text-indigo-400"></i>
                <span>Select <b>"Install App"</b> or <b>"Add to Home"</b>.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileGuide;
