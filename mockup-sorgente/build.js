const fs = require('fs');
const [src, logo, out] = process.argv.slice(2);
let s = fs.readFileSync(src, 'utf8');
const xdc = s.match(/<x-dc>([\s\S]*)<\/x-dc>/)[1];
const helmet = xdc.match(/<helmet>([\s\S]*?)<\/helmet>/)[1];
let body = xdc.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
body = body
  .replace(/<sc-for list="\{\{\s*([^}]+?)\s*\}\}" as="([^"]+)"[^>]*>/g, '<template data-for="$1" data-as="$2">')
  .replace(/<\/sc-for>/g, '</template>')
  .replace(/<sc-if value="\{\{\s*([^}]+?)\s*\}\}"[^>]*>/g, '<template data-if="$1">')
  .replace(/<\/sc-if>/g, '</template>')
  .replace(/\/_blob\/[0-9a-f]+/g, 'data:image/png;base64,' + fs.readFileSync(logo).toString('base64'));
const script = s.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Report DEM Michelin – mockup</title>${helmet}
<style>*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>
<template id="root">${body}</template>
<script>
class DCLogic{constructor(p){this.props=p||{};this.state={}}setState(){}}
${script}
function get(sc,p){p=p.trim();if(p==='true')return true;if(p==='false')return false;return p.split('.').reduce((o,k)=>o==null?undefined:o[k],sc)}
function interp(str,sc){return str.replace(/\\{\\{\\s*([^}]+?)\\s*\\}\\}/g,(m,p)=>{const v=get(sc,p);return v==null?'':String(v)})}
function proc(node,sc){for(const ch of [...node.childNodes]){
 if(ch.nodeType===1&&ch.tagName==='TEMPLATE'&&ch.dataset.for){const list=get(sc,ch.dataset.for)||[];list.forEach((it,i)=>{const c=ch.content.cloneNode(true);proc(c,Object.assign({},sc,{[ch.dataset.as]:it,$index:i}));ch.before(c)});ch.remove()}
 else if(ch.nodeType===1&&ch.tagName==='TEMPLATE'&&ch.dataset.if){if(get(sc,ch.dataset.if)){const c=ch.content.cloneNode(true);proc(c,sc);ch.before(c)}ch.remove()}
 else if(ch.nodeType===1){for(const a of [...ch.attributes]){if(a.name.startsWith('on')||a.name.startsWith('hint-'))ch.removeAttribute(a.name);else if(a.value.includes('{{'))ch.setAttribute(a.name,interp(a.value,sc))}proc(ch,sc)}
 else if(ch.nodeType===3&&ch.nodeValue.includes('{{'))ch.nodeValue=interp(ch.nodeValue,sc)}}
const c=new Component({});c.state=Object.assign({},c.state,{sel:37588});
const frag=document.getElementById('root').content.cloneNode(true);proc(frag,c.renderVals());document.body.appendChild(frag);
document.fonts.ready.then(()=>{const h=Math.ceil(document.documentElement.scrollHeight);const st=document.createElement('style');st.textContent='@page{size:1280px '+h+'px;margin:0}';document.head.appendChild(st)});
</script></body></html>`;
fs.writeFileSync(out, html);
