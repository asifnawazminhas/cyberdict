
let TERMS = [], CATEGORIES = [];
async function loadData(){
  const [tr, cr] = await Promise.all([fetch('/data/terms.json'), fetch('/data/categories.json')]);
  TERMS = await tr.json(); CATEGORIES = await cr.json();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function diffClass(d){return d==='Beginner'?'green':d==='Advanced'?'red':'yellow'}
function termUrl(t){return `/term/?id=${encodeURIComponent(t.id)}`}
function categoryUrl(c){return `/category/?id=${encodeURIComponent(c.id)}`}
function doSearch(inputId='heroSearch', resultsId='searchResults'){
  const q=(document.getElementById(inputId)?.value||'').trim().toLowerCase();
  const box=document.getElementById(resultsId); if(!box)return;
  if(!q){box.classList.remove('show');box.innerHTML='';return}
  const hits=TERMS.filter(t=>[t.term,t.category,t.shortDefinition,...t.tags].join(' ').toLowerCase().includes(q)).slice(0,8);
  box.innerHTML=hits.length?hits.map(t=>`<a class="result" href="${termUrl(t)}"><b>${esc(t.term)}</b><span>${esc(t.category)} · ${esc(t.shortDefinition)}</span></a>`).join(''):`<div class="result"><b>No matching term yet</b><span>CyberDict v0.1 is intentionally starting with a curated seed set.</span></div>`;
  box.classList.add('show');
}
function renderHome(){
  const cats=document.getElementById('categories');
  if(cats) cats.innerHTML=CATEGORIES.slice(0,12).map((c,i)=>`<a class="cat" href="${categoryUrl(c)}"><div class="ic">${c.icon}</div><div><b>${esc(c.name)}</b><span>${c.count} terms</span></div></a>`).join('');
  const grid=document.getElementById('featuredTerms');
  if(grid) grid.innerHTML=TERMS.slice(0,9).map((t,i)=>`<a class="term-card" href="${termUrl(t)}"><div class="top"><div class="symbol">${['▤','◎','⌘','◉','⬡','◌','▣','⚙','↥'][i%9]}</div><div><h4>${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p></div></div><div class="pills"><span class="pill green">SECTOR::${esc(t.categoryId.toUpperCase().replaceAll('-','_'))}</span><span class="pill ${diffClass(t.difficulty)}">LEVEL::${esc(t.difficulty.toUpperCase())}</span></div></a>`).join('');
  const rel=document.getElementById('popularTerms');
  if(rel) rel.innerHTML=TERMS.slice(0,6).map(t=>`<a class="rel-item" href="${termUrl(t)}"><span>${esc(t.term)}</span><small>${esc(t.category)} →</small></a>`).join('');
}
async function initHome(){
  await loadData(); renderHome();
  const input=document.getElementById('heroSearch');
  if(input){input.addEventListener('input',()=>doSearch());input.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()})}
  document.querySelectorAll('[data-example]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();input.value=a.dataset.example;doSearch()}));
}
async function initCategory(){
  await loadData();
  const id=new URLSearchParams(location.search).get('id')||CATEGORIES[0].id;
  const c=CATEGORIES.find(x=>x.id===id)||CATEGORIES[0];
  document.getElementById('categoryTitle').textContent=c.name;
  document.getElementById('categoryDesc').textContent=c.description;
  const list=TERMS.filter(t=>t.categoryId===c.id);
  document.getElementById('categoryTerms').innerHTML=(list.length?list:TERMS.slice(0,6)).map(t=>`<a class="term-card" href="${termUrl(t)}"><h4>${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p><div class="pills"><span class="pill ${diffClass(t.difficulty)}">${esc(t.difficulty)}</span></div></a>`).join('');
}
async function initTerm(){
  await loadData();
  const id=new URLSearchParams(location.search).get('id')||TERMS[0].id;
  const t=TERMS.find(x=>x.id===id)||TERMS[0];
  document.title=`${t.term} · CyberDict`;
  document.getElementById('termTitle').textContent=t.term;
  document.getElementById('termSub').textContent=t.shortDefinition;
  document.getElementById('termCategory').textContent=t.category;
  document.getElementById('termDifficulty').textContent=t.difficulty;
  document.getElementById('simple').textContent=t.simpleExplanation;
  document.getElementById('technical').textContent=t.technicalExplanation;
  document.getElementById('offensive').textContent=t.offensiveRelevance;
  document.getElementById('defensive').textContent=t.defensiveRelevance;
  document.getElementById('mitre').textContent=t.mitre.length?t.mitre.join(', '):'N/A';
  document.getElementById('cwe').textContent=t.cwe.length?t.cwe.join(', '):'N/A';
  document.getElementById('owasp').textContent=t.owasp.length?t.owasp.join(', '):'N/A';
  const related=TERMS.filter(x=>t.relatedTerms.includes(x.id));
  document.getElementById('relatedList').innerHTML=(related.length?related:TERMS.filter(x=>x.id!==t.id).slice(0,5)).map(x=>`<a href="${termUrl(x)}">${esc(x.term)}</a>`).join('');
}
