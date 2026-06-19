const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'dashboard', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Global replaces for dark mode to light mode
content = content.replace(/bg-\[#030304\]/g, 'bg-[#efeff1]');
content = content.replace(/text-white/g, 'text-neutral-900');
content = content.replace(/text-neutral-400/g, 'text-neutral-500');
content = content.replace(/text-neutral-450/g, 'text-neutral-500');
content = content.replace(/text-neutral-455/g, 'text-neutral-500');
content = content.replace(/text-neutral-300/g, 'text-neutral-600');
content = content.replace(/border-white\/5/g, 'border-neutral-200/60');
content = content.replace(/border-white\/10/g, 'border-neutral-200/60');
content = content.replace(/bg-neutral-950\/20/g, 'bg-white/80 shadow-sm');
content = content.replace(/bg-neutral-950\/30/g, 'bg-white/80 shadow-sm');
content = content.replace(/bg-neutral-950\/40/g, 'bg-white/90 shadow-sm');
content = content.replace(/bg-neutral-950\/45/g, 'bg-white/80');
content = content.replace(/bg-neutral-950\/10/g, 'bg-white/60');
content = content.replace(/bg-white\/5/g, 'bg-neutral-50');
content = content.replace(/bg-white\/10/g, 'bg-neutral-100');
content = content.replace(/text-neutral-950/g, 'text-neutral-900');

// Header logo text
content = content.replace(
  /<span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent">\s*hire\.me\s*<\/span>/,
  '<span className="font-extrabold text-xl tracking-tight uppercase text-neutral-950">hire<span className="text-[#dc2626]">.me</span></span>'
);

// Console badge
content = content.replace(
  /bg-blue-500\/10 px-2 py-0\.5 rounded text-blue-400/g,
  'bg-[#dc2626]/10 px-2 py-0.5 rounded text-[#dc2626]'
);

// Dashboard loading state background
content = content.replace(/text-neutral-600 select-none/g, 'text-neutral-600 select-none');

// Main return statement background layer injection
content = content.replace(
  /<div className="min-h-screen bg-\[#efeff1\] text-neutral-900 flex flex-col select-none relative">/,
  `<div className="min-h-screen bg-[#efeff1] text-neutral-900 flex flex-col select-none relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        <img 
          src="/media__1781250813790.jpg" 
          alt="Background Art" 
          className="w-full h-full object-cover object-center filter blur-3xl scale-110 opacity-30 select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/20" />
      </div>
      <div className="relative z-10 flex flex-col w-full min-h-screen">`
);

// Add the closing divs
content = content.replace(
  /    <\/div>\n  \);\n}\n/g,
  `      </div>\n    </div>\n  );\n}\n`
);

// Sidebar Navigation
content = content.replace(
  /activeTab === "analytics" \? "bg-white text-neutral-900" : "text-neutral-500 hover:text-neutral-900"/g,
  `activeTab === "analytics" ? "bg-white shadow-sm text-[#dc2626] border border-neutral-200" : "text-neutral-500 hover:text-[#dc2626] hover:bg-neutral-50"`
);
content = content.replace(
  /activeTab === "edit" \? "bg-white text-neutral-900" : "text-neutral-500 hover:text-neutral-900"/g,
  `activeTab === "edit" ? "bg-white shadow-sm text-[#dc2626] border border-neutral-200" : "text-neutral-500 hover:text-[#dc2626] hover:bg-neutral-50"`
);
content = content.replace(
  /activeTab === "share" \? "bg-white text-neutral-900" : "text-neutral-500 hover:text-neutral-900"/g,
  `activeTab === "share" ? "bg-white shadow-sm text-[#dc2626] border border-neutral-200" : "text-neutral-500 hover:text-[#dc2626] hover:bg-neutral-50"`
);

// Primary buttons
content = content.replace(
  /bg-blue-500 text-neutral-900 font-bold text-sm hover:bg-blue-600 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-500\/15/g,
  `bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#dc2626]/15 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center`
);

// Upgrade modal background
content = content.replace(/bg-neutral-950 shadow-2xl/g, 'bg-white shadow-[0_35px_100px_-20px_rgba(0,0,0,0.12)]');

// Icons
content = content.replace(/text-blue-400/g, 'text-[#dc2626]');
content = content.replace(/text-blue-500/g, 'text-[#dc2626]');
content = content.replace(/text-emerald-400/g, 'text-[#dc2626]');
content = content.replace(/text-indigo-400/g, 'text-[#dc2626]');

// Focus states on inputs
content = content.replace(/focus:border-blue-500\/50/g, 'focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 focus:bg-white');

// Fix text-white explicitly back to white inside buttons or where needed
content = content.replace(/text-neutral-900 font-bold text-xs/g, 'text-white font-bold text-xs');
// Or just let it be, buttons have text-neutral-900 and might look bad if bg is red
content = content.replace(/bg-\[#dc2626\] hover:bg-\[#b91c1c\] text-neutral-900/g, 'bg-[#dc2626] hover:bg-[#b91c1c] text-white');

// Input fields background 
content = content.replace(/bg-neutral-50 text-sm/g, 'bg-neutral-50/50 text-neutral-900 text-sm');

// Additional adjustments for cards
content = content.replace(/border border-neutral-200\/60 bg-white\/80 shadow-sm/g, 'border border-neutral-200 bg-white/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[24px]');
content = content.replace(/border border-neutral-200\/60 bg-white\/60/g, 'border border-neutral-200/60 bg-white/60 backdrop-blur-md rounded-[24px]');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactored dashboard to light theme");
