// Public files only. --backup saves a recoverable copy outside public_html.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const backup = process.argv.includes('--backup');
const label = process.argv.find(x=>x.startsWith('--label='))?.slice(8) || '2026-11-02';
const root = path.resolve(import.meta.dirname,'..');
const report = {at:new Date().toISOString(),mode:backup?'backup':'verify',files:[],redirects:[],bots:[],external:[],failures:[]};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const backupDir=path.join(root,'release',`seo-${backup?'backup':'public'}-${label}`);
if(fs.existsSync(backupDir))throw Error('Use a new label to preserve evidence.');
fs.mkdirSync(backupDir,{recursive:true});
const paths = backup ? execFileSync('git',['ls-tree','-r','--name-only','origin/codex/hostinger-static'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(x=>x!=='.htaccess') : (function walk(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name),prefix+x.name+'/'):[prefix+x.name]);})(path.join(root,'dist'));
for (const name of paths) {
  const response=await fetch('https://ramita.dev/'+name,{signal:AbortSignal.timeout(20000)});
  const bytes=Buffer.from(await response.arrayBuffer());
  const file=path.join(backupDir,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
  const expected=backup?null:fs.readFileSync(path.join(root,'dist',name));
  const equal=expected?bytes.equals(expected):null;
  report.files.push({path:name,status:response.status,bytes:bytes.length,sha256:hash(bytes),matchesBuild:equal});
  if(response.status!==200 || (equal===false && !name.endsWith('.png')))report.failures.push({file:name,status:response.status,matchesBuild:equal});
}
if(!backup){
  const query='?keep=a%2Bb&seo-audit=20261102';
  for(const prefix of ['','en/','pt/','fr/','ja/','privacidad/']){
    for(const host of ['ramita.dev','www.ramita.dev']){
      const url=`https://${host}/${prefix}index.html${query}`;
      const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});
      const location=response.headers.get('location');const expected=`https://ramita.dev/${prefix}${query}`;
      report.redirects.push({url,status:response.status,location,expected});
      if(response.status!==301||location!==expected)report.failures.push({url,status:response.status,location,expected});
    }
  }
  for(const pathname of ['/__seo-missing-20261102__/','/en/__seo-missing-20261102__/','/missing/index.html']){
    const response=await fetch('https://ramita.dev'+pathname,{redirect:'manual'});const bytes=Buffer.from(await response.arrayBuffer());
    const correct=response.status===404&&bytes.equals(fs.readFileSync(path.join(root,'dist/404.html')));
    report.redirects.push({pathname,status:response.status,custom404:correct});if(!correct)report.failures.push({pathname,custom404:false});
  }
  for(const agent of ['Googlebot','Bingbot','OAI-SearchBot'])for(const route of ['/','/en/','/pt/','/fr/','/ja/','/sitemap.xml','/robots.txt']){
    const response=await fetch('https://ramita.dev'+route,{headers:{'User-Agent':agent},signal:AbortSignal.timeout(20000)});
    const bytes=Buffer.from(await response.arrayBuffer());const file=route==='/'?'index.html':route.endsWith('/')?route.slice(1)+'index.html':route.slice(1);
    const equal=bytes.equals(fs.readFileSync(path.join(root,'dist',file)));const robots=response.headers.get('x-robots-tag');
    report.bots.push({agent,route,status:response.status,matchesBuild:equal,robots});if(response.status!==200||!equal||/noindex/i.test(robots||''))report.failures.push({agent,route,status:response.status});
  }
}
for(const url of ['https://github.com/ramiro-gp','https://residenciasgrupocasa.com.ar/','https://jlaberturas.com.ar/','https://veganrecords.com.ar/','https://lingo-hive.vercel.app/']){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});report.external.push({url,status:response.status,final:response.url});if(response.status>=400)report.failures.push({external:url,status:response.status});}
  catch(error){report.external.push({url,error:error.message});report.failures.push({external:url,error:error.message});}
}
fs.writeFileSync(path.join(backupDir,'manifest.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(root,'qa/seo',`release-${backup?'backup':'verify'}-${label}.json`),JSON.stringify(report,null,2));
console.log(JSON.stringify({directory:backupDir,files:report.files.length,redirects:report.redirects.length,bots:report.bots.length,external:report.external,failures:report.failures},null,2));
if(report.failures.length)process.exitCode=1;
