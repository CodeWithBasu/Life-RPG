const fs = require('fs');

const files = [
  'frontend/src/app/quests/page.tsx',
  'frontend/src/app/shop/page.tsx',
  'frontend/src/app/stats/page.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<motion\./g, '<');
  content = content.replace(/<\/motion\./g, '</');
  
  // also fix the `.then(res => res.ok ? res.json() : false)` error
  content = content.replace(/res => res\.ok \? res\.json\(\) : false/g, 'res => { if(res.ok) return res.json(); throw new Error("API Error"); }');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log("Done");
