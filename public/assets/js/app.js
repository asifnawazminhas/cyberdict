
let TERMS = [], CATEGORIES = [];
async function loadData(){
  const [tr, cr] = await Promise.all([fetch('/data/terms.json',{cache:'no-store'}), fetch('/data/categories.json',{cache:'no-store'})]);
  TERMS = await tr.json(); CATEGORIES = await cr.json();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function diffClass(d){return d==='Beginner'?'green':d==='Advanced'?'red':'yellow'}
function termUrl(t){return `/term/?id=${encodeURIComponent(t.id)}`}
function categoryUrl(c){return `/category/?id=${encodeURIComponent(c.id)}`}
const RASTER_TERM_IDS=new Set(['ctf','c2','red-team','blue-team','purple-team','soc','siem','edr','osint','phishing','privilege-escalation','persistence','lateral-movement','pivoting','ttps','ioc','mitre-attck','vulnerability','exploit','incident-response','threat-hunting','zero-trust','ransomware','mfa','oauth-2-0','oidc','kerberoasting','pass-the-hash','sql-injection']);
function visualUrl(t){const id=encodeURIComponent(t.id);return `/assets/img/terms/${id}.${RASTER_TERM_IDS.has(t.id)?'png':'svg'}` }
function previewUrl(t){const id=encodeURIComponent(t.id);return RASTER_TERM_IDS.has(t.id)?`/assets/img/previews/${id}.jpg`:visualUrl(t)}
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
  const essentialIds=['ctf','c2','red-team','blue-team','purple-team','soc','siem','edr','osint','phishing','privilege-escalation','persistence','lateral-movement','pivoting','ttps','ioc','mitre-attck','vulnerability','exploit','incident-response','threat-hunting','zero-trust','ransomware','mfa','oauth-2-0','oidc','kerberoasting','pass-the-hash','sql-injection'];
  const essentials=essentialIds.map(id=>TERMS.find(t=>t.id===id)).filter(Boolean);
  const featured=document.getElementById('featuredPrimary');
  if(featured && essentials[0]){
    const t=essentials[4] || essentials[0];
    featured.innerHTML=`<div class="content"><div class="kicker">// FEATURED TERM</div><h4>${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p><div class="featured-flow"><span class="flow-node red">RED</span><span class="flow-arrow">→</span><span class="flow-core">SHARE + IMPROVE</span><span class="flow-arrow">←</span><span class="flow-node blue">BLUE</span></div><div class="pills"><span class="pill purple">${esc(t.category)}</span><span class="pill ${diffClass(t.difficulty)}">${esc(t.difficulty)}</span></div><div class="featured-cta"><a href="${termUrl(t)}">EXPLORE TERM →</a></div></div><a class="visual visual-preview" href="${termUrl(t)}"><img src="${previewUrl(t)}" alt="${esc(t.term)} preview"></a>`;
  }
  const trending=document.getElementById('trending');
  if(trending) trending.innerHTML=essentials.slice(0,8).map(t=>`<a href="${termUrl(t)}"><span>${esc(t.term)}</span><small>${esc(t.full||t.category)} →</small></a>`).join('');
  const essentialGrid=document.getElementById('essentialGrid');
  if(essentialGrid) essentialGrid.innerHTML=essentials.map((t,i)=>`<a class="essential-card" href="${termUrl(t)}"><div class="essential-preview"><img loading="lazy" src="${previewUrl(t)}" alt="${esc(t.term)} visual preview"><span>VISUAL EXPLAINER</span></div><div class="body"><div class="term-number">${String(i+1).padStart(2,'0')}</div><h4>${esc(t.term)}</h4><p>${esc(t.shortDefinition)}</p><div class="card-meta"><span>${esc(t.category)}</span><b>Explore →</b></div></div></a>`).join('');
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
  document.getElementById('termVisual').innerHTML=`<button class="term-visual-open" type="button" aria-label="Open full ${esc(t.term)} visual explainer"><img src="${visualUrl(t)}" alt="${esc(t.term)} visual explainer"></button><div class="visual-hint">Click the visual to view it full size</div>`;
  initVisualLightbox(t);
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

function initVisualLightbox(t){
  const trigger=document.querySelector('.term-visual-open');
  if(!trigger)return;
  let overlay=document.getElementById('visualLightbox');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='visualLightbox';
    overlay.className='visual-lightbox';
    overlay.innerHTML='<button class="lightbox-close" type="button" aria-label="Close">×</button><div class="lightbox-scroll"><img alt=""></div>';
    document.body.appendChild(overlay);
  }
  const image=overlay.querySelector('img');
  const close=()=>{overlay.classList.remove('open');document.body.classList.remove('lightbox-lock')};
  trigger.addEventListener('click',()=>{image.src=visualUrl(t);image.alt=`${t.term} visual explainer`;overlay.classList.add('open');document.body.classList.add('lightbox-lock')});
  overlay.querySelector('.lightbox-close').onclick=close;
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});
}
