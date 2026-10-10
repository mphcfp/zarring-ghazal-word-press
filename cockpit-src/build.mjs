import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const bundled=await build({entryPoints:[resolve(root,'app.js')],bundle:true,minify:true,format:'iife',target:['chrome110','safari16','firefox115'],write:false,legalComments:'inline'});
let html=await readFile(resolve(root,'index.template.html'),'utf8');
const font=await readFile(resolve(root,'../node_modules/@fontsource/vazirmatn/files/vazirmatn-arabic-400-normal.woff2'));
const fontBold=await readFile(resolve(root,'../node_modules/@fontsource/vazirmatn/files/vazirmatn-arabic-500-normal.woff2'));
const fontCSS=`@font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');font-weight:400;font-display:swap}@font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${fontBold.toString('base64')}) format('woff2');font-weight:500 800;font-display:swap}`;
let modelBase64;try{modelBase64=(await readFile(resolve(root,'../SU7.optimized.glb'))).toString('base64')}catch{const existing=await readFile(resolve(root,'../g-class-cockpit.html'),'utf8');modelBase64=existing.match(/<script id="su7-model" type="application\/octet-stream">([\s\S]*?)<\/script>/)?.[1].trim();if(!modelBase64)throw new Error('Embedded SU7 model missing from existing HTML')}
html=html.replace('/*__FONT__*/',fontCSS).replace('/*__CSS__*/',await readFile(resolve(root,'styles.css'),'utf8')).replace('/*__MODEL__*/',()=>modelBase64).replace('/*__JS__*/',()=>bundled.outputFiles[0].text.replaceAll('</script','<\\/script')).replace('\\n','\n');
const target=resolve(root,'../g-class-cockpit.html');await writeFile(target,html);console.log(target,Buffer.byteLength(html));
