/* StudyOrbit IIT C 2.2 — app navigation shell. Does not alter tracker data/calculation logic. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const destinations=[
 {id:'home',label:'Home',icon:'⌂',target:'summary',hint:'Dashboard and study overview'},
 {id:'study',label:'Study',icon:'▤',target:'chapterPlanSection',hint:'Chapter plan and stage progress'},
 {id:'log',label:'Log',icon:'✎',target:'dailyLogSection',hint:'Daily study log'},
 {id:'tests',label:'Tests',icon:'◎',target:'orbTestingSection',hint:'Testing and test analysis'},
 {id:'analysis',label:'Analysis',icon:'▥',target:'orbAnalysisSection',hint:'Performance and study analytics'}
];
const moreItems=[
 {label:'Question Bank',icon:'▣',target:'questionBankSection',hint:'Integrated Question Bank'},
 {label:'Add Leave',icon:'☼',target:'orbLeaveSection',hint:'Manage leave records'},
 {label:'To-Do List',icon:'✓',action:'todo',hint:'Tasks and carry-forward'},
 {label:'Backup & Restore',icon:'⇅',target:'snapshot',hint:'Export or restore tracker data'}
];
const main=document.querySelector('main.wrap'),hero=document.querySelector('.hero');if(!main||!hero)return;
const search=document.createElement('div');search.className='orbit-app-search';search.innerHTML='<span aria-hidden="true">⌕</span><input id="orbitGlobalSearch" type="search" autocomplete="off" placeholder="Search sections, tools and records…" aria-label="Search StudyOrbit"><button type="button" class="orbit-more-trigger" aria-label="Open more tools">More</button><div class="orbit-search-results" id="orbitSearchResults" role="listbox"></div>';
hero.appendChild(search);
const side=document.createElement('nav');side.className='orbit-side-nav';side.setAttribute('aria-label','Main navigation');side.innerHTML='<div class="orbit-nav-caption">Workspace</div>'+destinations.map(d=>`<button type="button" class="orbit-nav-item" data-dest="${d.id}"><span class="orbit-nav-icon">${d.icon}</span>${d.label}</button>`).join('')+'<div class="orbit-nav-divider"></div><div class="orbit-nav-caption">More tools</div>'+moreItems.map((d,i)=>`<button type="button" class="orbit-nav-item" data-more="${i}"><span class="orbit-nav-icon">${d.icon}</span>${d.label}</button>`).join('');
main.insertBefore(side,main.querySelector(':scope > section.card'));
const bottom=document.createElement('nav');bottom.className='orbit-bottom-nav';bottom.setAttribute('aria-label','Primary navigation');bottom.innerHTML=destinations.map(d=>`<button type="button" data-dest="${d.id}" aria-label="${d.label}"><span class="orbit-nav-icon">${d.icon}</span><span>${d.label}</span></button>`).join('');document.body.appendChild(bottom);
const more=document.createElement('div');more.className='orbit-more-menu';more.id='orbitMoreMenu';more.innerHTML=moreItems.map((d,i)=>`<button type="button" data-more="${i}"><span>${d.icon}</span><span>${d.label}</span></button>`).join('');document.body.appendChild(more);
let active='home';const setActive=id=>{active=id;document.querySelectorAll('[data-dest]').forEach(b=>b.classList.toggle('is-active',b.dataset.dest===id));};
function goTarget(target){more.classList.remove('is-open');const section=target==='snapshot'?Array.from(main.querySelectorAll(':scope > section.card')).find(x=>x.querySelector('#exportJSON')):$(target);if(!section)return;if(target==='summary'){const back=$('orbitBackHome');if(main.classList.contains('orbit-focus-mode')&&back)back.click();window.scrollTo({top:0,behavior:'smooth'});setActive('home');return;}const heading=section.querySelector(':scope > h2, :scope > .qb-title-row');if(heading){heading.click();setTimeout(()=>{section.scrollIntoView({behavior:'smooth',block:'start'});},30);}setActive(destinations.find(d=>d.target===target)?.id||'more');}
function runMore(i){const item=moreItems[i];if(!item)return;if(item.action==='todo'){const fab=$('todoFab');if(fab)fab.click();more.classList.remove('is-open');setActive('more');return;}goTarget(item.target);}
function activate(id){const d=destinations.find(x=>x.id===id);if(!d)return;goTarget(d.target);}
document.querySelectorAll('[data-dest]').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.dest)));
document.querySelectorAll('[data-more]').forEach(b=>b.addEventListener('click',()=>runMore(Number(b.dataset.more))));search.querySelector('.orbit-more-trigger').addEventListener('click',()=>more.classList.toggle('is-open'));
document.addEventListener('click',e=>{if(!more.contains(e.target)&&!search.contains(e.target)&&!side.contains(e.target))more.classList.remove('is-open');if(!search.contains(e.target))results.classList.remove('is-open')});
const input=$('orbitGlobalSearch'),results=$('orbitSearchResults');const searchable=[...destinations.map(d=>({...d,kind:'Primary section'})),...moreItems.map((d,i)=>({...d,kind:'More tools',moreIndex:i}))];
function showResults(){const q=input.value.trim().toLowerCase();if(!q){results.classList.remove('is-open');results.innerHTML='';return;}const matches=searchable.filter(d=>(d.label+' '+d.hint+' '+d.kind).toLowerCase().includes(q)).slice(0,8);results.innerHTML=matches.length?matches.map(d=>`<button type="button" class="orbit-search-result" data-search-dest="${d.id||''}" data-search-more="${d.moreIndex??''}"><span>${d.icon}</span><span>${d.label}<small>${d.hint}</small></span></button>`).join(''):'<div class="orbit-search-result">No matching section found</div>';results.classList.add('is-open');results.querySelectorAll('[data-search-dest]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.searchMore!=='')runMore(Number(b.dataset.searchMore));else activate(b.dataset.searchDest);results.classList.remove('is-open');input.value='';}));}
input.addEventListener('input',showResults);input.addEventListener('focus',showResults);input.addEventListener('keydown',e=>{if(e.key==='Escape'){results.classList.remove('is-open');input.blur()}if(e.key==='Enter'){const first=results.querySelector('button');if(first)first.click()}});
const back=$('orbitBackHome');if(back)back.addEventListener('click',()=>setActive('home'));
window.addEventListener('resize',()=>{if(window.innerWidth>=850)more.classList.remove('is-open')});setActive('home');
})();
