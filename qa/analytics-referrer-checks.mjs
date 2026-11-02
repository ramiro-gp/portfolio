import assert from 'node:assert/strict';
import fs from 'node:fs';
import {searchReferrer} from '../src/scripts/search-referrer.ts';
const cases = [
 ['https://www.google.com/search?q=private%40example.com#token','https://www.google.com/'],
 ['https://www.google.com.ar/search?q=DO_NOT_TRANSMIT','https://www.google.com/'],
 ['https://google.co.jp/search?q=DO_NOT_TRANSMIT','https://www.google.com/'],
 ['https://www.bing.com/search?q=DO_NOT_TRANSMIT','https://www.bing.com/'],
 ['https://duckduckgo.com/?q=DO_NOT_TRANSMIT','https://duckduckgo.com/'],
 ['https://search.yahoo.com/search?p=DO_NOT_TRANSMIT','https://search.yahoo.com/'],
 ['https://search.yahoo.co.jp/search?p=DO_NOT_TRANSMIT','https://search.yahoo.com/'],
 ['https://internal.example.com/patient/DO_NOT_TRANSMIT',''],
 ['https://google.com.evil.example/search?q=DO_NOT_TRANSMIT',''],
 ['https://www.google.example/search?q=DO_NOT_TRANSMIT',''],
 ['https://ramita.dev/en/',''],
 ['javascript:DO_NOT_TRANSMIT',''],
 ['ftp://www.google.com/DO_NOT_TRANSMIT',''],
 ['',''], ['not a URL','']
];
for(const [input,expected] of cases){assert.equal(searchReferrer(input),expected);assert.ok(!searchReferrer(input).includes('DO_NOT_TRANSMIT'));}
const report={date:new Date().toISOString(),cases:cases.length,failures:0,scope:'Pure allowlist: public search origins only, no query/path/private host.'};
fs.writeFileSync('qa/seo/referrer-2026-11-02.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
