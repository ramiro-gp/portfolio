import fs from 'node:fs';
import path from 'node:path';
const label = process.argv[2] || '2026-11-02';
const routes = ['index.html','en/index.html','pt/index.html','fr/index.html','ja/index.html','privacidad/index.html','404.html'];
const results = await Promise.allSettled(routes.map(async file => {
  const response = await fetch('https://validator.w3.org/nu/?out=json',{method:'POST',headers:{'Content-Type':'text/html; charset=utf-8'},body:fs.readFileSync(path.join('dist',file)),signal:AbortSignal.timeout(30000)});
  const data=await response.json();
  return {file,status:response.status,messages:data.messages};
}));
const report=results.map((value,index)=>value.status==='fulfilled'?value.value:{file:routes[index],unavailable:value.reason.message});
fs.writeFileSync(`qa/seo/html-validator-${label}.json`,JSON.stringify(report,null,2),{flag:'wx'});
console.log(JSON.stringify(report));
if(report.some(x=>x.unavailable||x.status!==200||x.messages?.some(m=>m.type==='error')))process.exitCode=1;
