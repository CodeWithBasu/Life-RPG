const fs = require('fs');

const files = [
  'src/app/quests/page.tsx',
  'src/app/shop/page.tsx',
  'src/app/stats/page.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove framer-motion props
  content = content.replace(/initial=\{.*?\}/g, '');
  content = content.replace(/animate=\{.*?\}/g, '');
  content = content.replace(/transition=\{.*?\}/g, '');
  content = content.replace(/whileTap=\{.*?\}/g, '');

  // Fix the fetch API error: res => res.ok ? res.json() : false
  // Actually, the previous regex was res => res\.ok \? res\.json\(\) : false
  // The error says: `(res: Response) => false | Promise<void>` is not assignable to `(value: Response) => void | PromiseLike<void>`.
  // Let's replace the whole fetch block or fix the return type.
  content = content.replace(/res => res\.ok \? res\.json\(\) : false/g, 'res => { if(res.ok) return res.json(); throw new Error("API Error"); }');
  
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed');
