const fs = require('fs');
const path = require('path');
const exts = ['.ts','.tsx','.js','.jsx','.json','.md','.css','.scss','.html'];
const targets = ['src','pages','public'];

function walk(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for(const e of entries){
    const p = path.join(dir, e.name);
    if(e.isDirectory()){
      // skip node_modules just in case
      if(e.name === 'node_modules') continue;
      walk(p);
    } else {
      if(exts.includes(path.extname(p))){
        try{
          const s = fs.readFileSync(p, 'utf8');
          const ns = s.replace(/\r\n/g, '\n');
          if(ns !== s){
            fs.writeFileSync(p, ns, 'utf8');
            console.log('Converted:', p);
          }
        } catch(err){
          console.error('Error reading/writing', p, err.message);
        }
      }
    }
  }
}

for(const t of targets){
  if(fs.existsSync(t)){
    console.log('Processing', t);
    walk(t);
  }
}
console.log('Done');
