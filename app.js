(() => {
  const papers = {
    looseleaf:{name:'温かなルーズリーフ',short:'ルーズリーフ',src:'assets/01_looseleaf.png',width:725,height:2169},
    washi:{name:'手漉き和紙の便せん',short:'和紙の便せん',src:'assets/02_washi.png',width:724,height:2172},
    collage:{name:'切り絵レター',short:'切り絵レター',src:'assets/03_collage.png',width:731,height:2152}
  };
  const inks = {
    sepia:{name:'深いセピア',value:'#5E4335'},cocoa:{name:'赤みのココア',value:'#814F43'},
    olive:{name:'オリーブブラウン',value:'#5B6041'},gray:{name:'温かな墨グレー',value:'#57504A'}
  };
  const fonts = {
    klee400:{name:'端正な細字',family:'Klee One',weight:400},
    klee600:{name:'端正な中字',family:'Klee One',weight:600},
    yuji:{name:'凛とした筆文字',family:'Yuji Syuku',weight:400}
  };
  const params = new URLSearchParams(location.hash.slice(1));
  const state = {paper:papers[params.get('paper')]?params.get('paper'):'collage',ink:inks[params.get('ink')]?params.get('ink'):'sepia',font:fonts[params.get('font')]?params.get('font'):'klee600'};
  const letter = document.getElementById('letter');
  const image = document.getElementById('paper-background');
  const dialog = document.getElementById('settings-dialog');
  const tabs = [...document.querySelectorAll('[data-tab]')];
  let lastOpener;
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'instant'});});
  function render(){
    const p=papers[state.paper],c=inks[state.ink],f=fonts[state.font];
    letter.dataset.paper=state.paper;letter.dataset.font=state.font;
    letter.style.setProperty('--letter-ink',c.value);letter.style.setProperty('--letter-font','"'+f.family+'"');letter.style.setProperty('--letter-weight',f.weight);
    if(image.getAttribute('src')!==p.src){image.src=p.src;image.width=p.width;image.height=p.height;}
    const summary=p.short+' ／ '+c.name+' ／ '+f.name;
    document.getElementById('current-design').textContent=summary;document.getElementById('dialog-selection').textContent=summary;
    document.getElementById('paper-short').textContent=p.short;document.getElementById('ink-short').textContent=c.name;document.getElementById('font-short').textContent=f.name;
    ['paper','ink','font'].forEach(key=>document.querySelectorAll('[data-'+key+'-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.getAttribute('data-'+key+'-choice')===state[key]))));
    const hash=new URLSearchParams(state).toString();
    try {history.replaceState(null,'','#'+hash);} catch (_) { /* Files previews may restrict history. */ }
  }
  function selectTab(key,focus=false){
    tabs.forEach(tab=>{const active=tab.dataset.tab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById('panel-'+tab.dataset.tab).hidden=!active;if(active&&focus)tab.focus();});
  }
  function openDialog(key,opener){lastOpener=opener;selectTab(key);dialog.showModal();document.body.classList.add('modal-open');document.getElementById('tab-'+key).focus();}
  function closeDialog(){dialog.close();}
  document.querySelectorAll('[data-open-settings]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.openSettings,button)));
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTab(tab.dataset.tab));
    tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next].dataset.tab,true);}});
  });
  ['paper','ink','font'].forEach(key=>document.querySelectorAll('[data-'+key+'-choice]').forEach(button=>button.addEventListener('click',()=>{state[key]=button.getAttribute('data-'+key+'-choice');render();})));
  document.getElementById('close-settings').addEventListener('click',closeDialog);
  document.getElementById('apply-settings').addEventListener('click',()=>{closeDialog();requestAnimationFrame(()=>letter.scrollIntoView({behavior:'instant',block:'start'}));});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastOpener)lastOpener.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
  render();
})();
