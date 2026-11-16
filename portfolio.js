export function youtubeId(value) {
 try { const u = new URL(value); if (!['https:','http:'].includes(u.protocol)) return null;
 const host=u.hostname.toLowerCase(); let id;
 if(host==='youtu.be') id=u.pathname.split('/')[1];
 else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)) {
 id=u.pathname==='/watch'?u.searchParams.get('v'): /^\/(shorts|embed|live)\//.test(u.pathname)?u.pathname.split('/')[2]:null;
 } return /^[a-zA-Z0-9_-]{11}$/.test(id||'')?id:null;
 } catch { return null; }
}
export async function loadVideos(container,status) {
 try {
 let issues=[]; let page=1;
 while(true) {
 const r=await fetch('https://api.github.com/repos/Shaxsi/shaxsi.github.io/issues?state=open&creator=Shaxsi&per_page=100&page='+page,{headers:{Accept:'application/vnd.github+json'}});
 if(!r.ok) throw Error('Unable to load videos');
 const batch=await r.json(); issues.push(...batch);
 if(batch.length<100) break; page++;
 }
 for(const issue of issues) {
 if(issue.pull_request||issue.user?.login?.toLowerCase()!=='shaxsi'||!issue.title.startsWith('[Portfolio video] '))continue;
 const lines=(issue.body||'').trim().split('\n'); const id=youtubeId(lines[0].trim()); if(!id)continue;
 const title=issue.title.slice(18).trim()||'Video';
 const card=document.createElement('article');card.className='video-card';
 const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id;frame.title=title;frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;card.append(frame);
 const heading=document.createElement('h3');heading.textContent=title;card.append(heading);
 const description=lines.slice(1).join('\n').trim();if(description){const p=document.createElement('p');p.textContent=description;card.append(p);}
 const link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+id;link.textContent='Watch on YouTube ↗';link.target='_blank';link.rel='noopener';card.append(link);container.append(card);
 }
 status.textContent=container.children.length?'':'New films are on the way. Check back soon.';
 }catch{status.textContent='Videos could not be loaded. Please try again later.';}
}
