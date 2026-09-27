
let TERMS = [], CATEGORIES = [];
async function loadData(){
  const [tr, cr] = await Promise.all([fetch('/data/terms.json',{cache:'no-store'}), fetch('/data/categories.json',{cache:'no-store'})]);
  TERMS = await tr.json(); CATEGORIES = await cr.json();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function diffClass(d){return d==='Beginner'?'green':d==='Advanced'?'red':'yellow'}
function termUrl(t){return `/term/?id=${encodeURIComponent(t.id)}`}
function categoryUrl(c){return `/category/?id=${encodeURIComponent(c.id)}`}
function visualUrl(t){return `/assets/img/terms/${encodeURIComponent(t.id)}.svg`}
function doSearch(inputId='heroSearch', resultsId='searchResults'){
  const q=(document.getElementById(inputId)?.value||'').trim().toLowerCase();
  const box=document.getElementById(resultsId); if(!box)return;
  if(!q){box.classList.remove('show');box.innerHTML='';return}
  const hits=TERMS.filter(t=>[t.term,t.full,t.category,t.shortDefinition,...(t.tags||[])].join(' ').toLowerCase().includes(q)).slice(0,10);
  box.innerHTML=hits.length?hits.map(t=>`<a class="result" href="${termUrl(t)}"><b>${esc(t.term)}</b><span>${esc(t.full||t.category)} · ${esc(t.shortDefinition)}</span></a>`).join(''):`<div class="result"><b>No matching term yet</b><span>CyberDict is growing from a reviewed seed set.</span></div>`;
  box.classList.add('show');
}
function renderHome(){
  const cats=document.getElementById('categories');
  if(cats) cats.innerHTML=CATEGORIES.slice(0,12).map(c=>`<a class="cat" href="${categoryUrl(c)}"><div class="ic">${c.icon}</div><div><b>${esc(c.name)}</b><span>${c.count} concepts</span></div></a>`).join('');
  const essentialIds=['ctf','c2','red-team','blue-team','purple-team','soc','siem','edr','osint','phishing','privilege-escalation','persistence','lateral-movement','pivoting','ttps','ioc','mitre-attck','vulnerability','exploit','incident-response'];
  const essentials=essentialIds.map(id=>TERMS.find(t=>t.id===id)).filter(Boolean);
  const featured=document.getElementById('featuredPrimary');
  if(featured && essentials[0]){
    const t=essentials[4] || essentials[0];
    featured.innerHTML=`<div class="content"><div class="kicker">// FEATURED TERM</div><h4>${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p><div class="pills"><span class="pill purple">${esc(t.category)}</span><span class="pill ${diffClass(t.difficulty)}">${esc(t.difficulty)}</span></div><div style="margin-top:auto;padding-top:16px"><a style="color:var(--green);font-size:10px;font-weight:800" href="${termUrl(t)}">EXPLORE TERM →</a></div></div><a class="visual" href="${termUrl(t)}"><img src="${visualUrl(t)}" alt="${esc(t.term)} visual"></a>`;
  }
  const trending=document.getElementById('trending');
  if(trending) trending.innerHTML=essentials.slice(0,8).map(t=>`<a href="${termUrl(t)}"><span>${esc(t.term)}</span><small>${esc(t.full||t.category)} →</small></a>`).join('');
  const essentialGrid=document.getElementById('essentialGrid');
  if(essentialGrid) essentialGrid.innerHTML=essentials.map((t,i)=>`<a class="essential-card" href="${termUrl(t)}"><img src="${visualUrl(t)}" alt="${esc(t.term)} visual"><div class="body"><h4>${String(i+1).padStart(2,'0')} · ${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p></div></a>`).join('');
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
  const list=TERMS.filter(t=>t.categoryId===c.id || t.category===c.name);
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
  document.getElementById('termVisual').innerHTML=`<img src="${visualUrl(t)}" alt="${esc(t.term)} visual">`;
  document.getElementById('simple').textContent=t.simpleExplanation||t.shortDefinition;
  document.getElementById('technical').textContent=t.technicalExplanation||'Technical explanation coming soon.';
  document.getElementById('offensive').textContent=t.offensiveRelevance||'Offensive relevance coming soon.';
  document.getElementById('defensive').textContent=t.defensiveRelevance||'Defensive relevance coming soon.';
  document.getElementById('mitre').textContent=(t.mitre||[]).length?t.mitre.join(', '):'N/A';
  document.getElementById('cwe').textContent=(t.cwe||[]).length?t.cwe.join(', '):'N/A';
  document.getElementById('owasp').textContent=(t.owasp||[]).length?t.owasp.join(', '):'N/A';
  const related=TERMS.filter(x=>(t.relatedTerms||[]).includes(x.id));
  document.getElementById('relatedList').innerHTML=(related.length?related:TERMS.filter(x=>x.id!==t.id).slice(0,5)).map(x=>`<a href="${termUrl(x)}">${esc(x.term)}</a>`).join('');
}
