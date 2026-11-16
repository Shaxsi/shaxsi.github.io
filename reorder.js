
import {getPortfolio} from './portfolio.js';
const list=document.getElementById('order-list'),status=document.getElementById('order-status'),save=document.getElementById('save-order');
let videos=[],dragged=null,dirty=false;
function move(from,to){
 if(from===to||from<0||to<0||from>=videos.length||to>=videos.length)return;
 const [video]=videos.splice(from,1);videos.splice(to,0,video);dirty=true;render();
 status.textContent='Order changed. Publish it to make it visible to everyone.';
 list.children[to]?.querySelector('.drag-handle')?.focus();
}
function render(){
 list.replaceChildren();save.disabled=!dirty;
 videos.forEach((video,index)=>{
 const row=document.createElement('li');row.className='order-row';
 const handle=document.createElement('button');handle.type='button';handle.className='drag-handle';handle.textContent='⠿';handle.draggable=true;handle.setAttribute('aria-label','Drag '+video.title+' to reorder');
 handle.addEventListener('dragstart',e=>{dragged=index;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(index));row.classList.add('dragging')});
 handle.addEventListener('dragend',()=>{dragged=null;row.classList.remove('dragging');for(const el of list.children)el.classList.remove('drop-target')});
 row.addEventListener('dragover',e=>{if(dragged!==null){e.preventDefault();e.dataTransfer.dropEffect='move';row.classList.add('drop-target')}});
 row.addEventListener('dragleave',()=>row.classList.remove('drop-target'));
 row.addEventListener('drop',e=>{e.preventDefault();row.classList.remove('drop-target');if(dragged!==null){const from=dragged;dragged=null;move(from,index)}});
 const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+video.id+'/mqdefault.jpg';img.alt='';img.loading='lazy';
 const title=document.createElement('span');title.className='order-title';title.textContent=video.title;
 const controls=document.createElement('div');controls.className='move-controls';
 for(const [label,delta] of [['↑',-1],['↓',1]]){
 const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label','Move '+video.title+(delta<0?' up':' down'));button.disabled=index+delta<0||index+delta>=videos.length;button.addEventListener('click',()=>move(index,index+delta));controls.append(button);
 }
 row.append(handle,img,title,controls);list.append(row);
 });
}
save.addEventListener('click',()=>{
 const url=new URL('https://github.com/Shaxsi/shaxsi.github.io/issues/new');url.searchParams.set('title','[Portfolio order]');url.searchParams.set('body',JSON.stringify(videos.map(v=>v.number)));
 if(url.href.length>7500){status.textContent='This portfolio is too large to publish its order with this form. Please contact the site maintainer.';return;}
 dirty=false;window.location.assign(url.href);
});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue=''}});
getPortfolio().then(result=>{videos=result;render();status.textContent=videos.length?'Drag the dotted handles, or use the arrow buttons.':'Add your first film above, then return here to arrange it.'}).catch(()=>{status.textContent='Could not load videos. Please reload and try again.'});
