const fs = require('fs');

let content = fs.readFileSync('src/components/Voice.tsx', 'utf8');

const searchImage = `<div className="aspect-[4/3] bg-[#050505] border-b border-[#262626] p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <FileText size={120} />
                </div>
                <div className="bg-[#1A1A1A] rounded-xl inline-flex p-3 w-fit z-10 border border-[#333]">
                  <BookOpen size={24} className="text-white group-hover:text-[#D80032] transition-colors" />
                </div>
                <div className="z-10 mt-8">
                  <div className="font-mono text-[10px] text-[#D80032] font-bold tracking-normal uppercase mb-2">Issue Zero (انتحاب)</div>
                  <h3 className="text-3xl font-black text-white uppercase font-sans leading-none">
                    Midaan Magazine
                  </h3>
                </div>
              </div>`;
              
const replaceImage = `<div className="p-8 flex flex-col justify-between relative overflow-hidden border-b border-[#262626] bg-[#0A0A0A]">
                <div className="flex items-center justify-between z-10">
                  <div className="bg-[#1A1A1A] rounded-xl inline-flex p-3 w-fit border border-[#333]">
                    <BookOpen size={24} className="text-white group-hover:text-[#D80032] transition-colors" />
                  </div>
                  <div className="font-mono text-[10px] text-[#D80032] font-bold tracking-normal uppercase text-right">Issue Zero (انتحاب)</div>
                </div>
                <div className="z-10 mt-6">
                  <h3 className="text-3xl font-black text-white uppercase font-sans leading-none">
                    Midaan Magazine
                  </h3>
                </div>
              </div>`;

content = content.replace(searchImage, replaceImage);
fs.writeFileSync('src/components/Voice.tsx', content, 'utf8');

