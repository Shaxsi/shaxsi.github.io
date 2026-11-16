export function youtubeId(value) {
 try { const u = new URL(value); if (!['https:','http:'].includes(u.protocol)) return null;
 const host=u.hostname.toLowerCase(); let id;
 if(host==='youtu.be') id=u.pathname.split('/')[1];
 else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)) {
 id=u.pathname==='/watch'?u.searchParams.get('v'): /^\/(shorts|embed|live)\//.test(u.pathname)?u.pathname.split('/')[2]:null;
 } return /^[a-zA-Z0-9_-]{11}$/.test(id||'')?id:null;
 } catch { return null; }
}

const PREFIX='[Portfolio video] ';
export function arrangeVideos(videos,order=[]) {
 const rank=new Map();order.forEach((id,i)=>{if(Number.isSafeInteger(id)&&!rank.has(id))rank.set(id,i)});
 return [...videos].sort((a,b)=>(rank.get(a.number)??Infinity)-(rank.get(b.number)??Infinity)||b.number-a.number);
}
export async function getPortfolio() {
 let issues=[],page=1;
 while(true){
 const r=await fetch('https://api.github.com/repos/Shaxsi/shaxsi.github.io/issues?state=open&creator=Shaxsi&per_page=100&page='+page,{headers:{Accept:'application/vnd.github+json'}});
 if(!r.ok)throw Error('Unable to load videos');
 const batch=await r.json();issues.push(...batch);if(batch.length<100)break;page++;
 }
 issues=issues.filter(i=>!i.pull_request&&i.user?.login?.toLowerCase()==='shaxsi');
 const videos=[];
 for(const i of issues){
 if(!i.title.startsWith(PREFIX))continue;
 const lines=(i.body||'').trim().split('\n'),id=youtubeId(lines[0].trim());if(!id)continue;
 videos.push({number:i.number,id,title:i.title.slice(PREFIX.length).trim()||'Video',description:lines.slice(1).join('\n').trim()});
 }
 let order=[];
 for(const i of issues.filter(i=>i.title==='[Portfolio order]').sort((a,b)=>b.number-a.number)){
 try{const candidate=JSON.parse(i.body);if(Array.isArray(candidate)&&candidate.every(Number.isSafeInteger)){order=candidate;break}}catch{}
 }
 return arrangeVideos(videos,order);
}
export async function loadVideos(container,status){
 try{
 const videos=await getPortfolio();container.replaceChildren();
 for(const video of videos){
 const card=document.createElement('article');card.className='video-card';
 const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+video.id;frame.title=video.title;frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;card.append(frame);
 const heading=document.createElement('h3');heading.textContent=video.title;card.append(heading);
 if(video.description){const p=document.createElement('p');p.textContent=video.description;card.append(p);}
 const link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+video.id;link.textContent='Watch on YouTube ↗';link.target='_blank';link.rel='noopener';card.append(link);container.append(card);
 }
 status.textContent=videos.length?'':'New films are on the way. Check back soon.';
 }catch{status.textContent='Videos could not be loaded. Please try again later.';}
}
