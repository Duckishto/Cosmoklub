const params=new URLSearchParams(window.location.search);
const categoryId=params.get('category')||'stars';
const category=COURSE_DATA[categoryId];
if(!category){
  window.location.replace('dashboard.html');
  throw new Error('Unknown course category.');
}
document.title=`${category.title} Roadmap | CosmoKlub`;
document.getElementById('categoryIcon').textContent=category.icon;
document.getElementById('categoryTitle').textContent=category.title;
document.getElementById('categoryDescription').textContent=category.description;
const roadmapContainer=document.getElementById('roadmapContainer');
function getCompletedIds(){
  return getCategoryProgress(category.id).completedLessons;
}
function isLessonComplete(lesson){
  return getCompletedIds().includes(lesson.id);
}
function getFlatLessons(){
  return category.sections.flatMap(section=>section.lessons);
}
function isLessonUnlocked(lesson){
  const allLessons=getFlatLessons();
  const index=allLessons.findIndex(item=>item.id===lesson.id);
  if(index===0)return true;
  return isLessonComplete(allLessons[index-1]);
}
function isSectionComplete(section){
  return section.lessons.length>0&&section.lessons.every(lesson=>isLessonComplete(lesson));
}
function isSectionUnlocked(sectionIndex){
  if(sectionIndex===0)return true;
  return isSectionComplete(category.sections[sectionIndex-1]);
}
function updateCategoryHeader(){
  const saved=getCategoryProgress(category.id);
  const stats=getLevelProgress(saved.xp);
  document.getElementById('categoryMeta').textContent=`${stats.rank} • LEVEL ${stats.level} • ${saved.xp} XP`;
}
function renderRoadmap(){
  roadmapContainer.innerHTML='';
  updateCategoryHeader();
  category.sections.forEach((section,sectionIndex)=>{
    if(!isSectionUnlocked(sectionIndex))return;
    const sectionElement=document.createElement('section');
    sectionElement.className='course-section';
    const banner=document.createElement('div');
    banner.className='section-banner';
    banner.innerHTML=`
      <div class="section-number">SECTION ${sectionIndex+1}</div>
      <h2>${escapeHtml(section.title)}</h2>
      <p>${escapeHtml(section.subtitle)}</p>
    `;
    const path=document.createElement('div');
    path.className='path';
    section.lessons.forEach((lesson,index)=>{
      const completed=isLessonComplete(lesson);
      const unlocked=isLessonUnlocked(lesson);
      const item=document.createElement('div');
      item.className=`path-item path-position-${index%6}`;
      if(lesson.type==='quiz')item.classList.add('quiz');
      if(completed)item.classList.add('completed');
      if(!unlocked&&!completed)item.classList.add('locked');
      const button=document.createElement('button');
      button.className='path-node';
      if(completed){
        button.innerHTML='✓';
      }else if(!unlocked){
        button.innerHTML='🔒';
      }else if(lesson.type==='quiz'){
        button.innerHTML='🏆';
      }else{
        button.innerHTML='★';
      }
      button.disabled=!unlocked&&!completed;
      if(unlocked||completed){
        button.addEventListener('click',()=>{
          const url=new URL('lesson.html',window.location.href);
          url.searchParams.set('category',category.id);
          url.searchParams.set('lesson',lesson.id);
          window.location.href=url.toString();
        });
      }
      const info=document.createElement('div');
      info.className='path-info';
      const title=document.createElement('div');
      title.className='path-title';
      title.textContent=lesson.title;
      const meta=document.createElement('div');
      meta.className='path-meta';
      if(completed){
        meta.textContent=`Completed • ${lesson.xp} XP`;
      }else if(!unlocked){
        meta.textContent='Locked';
      }else if(lesson.type==='quiz'){
        meta.textContent=`Quiz • ${lesson.duration} • ${lesson.xp} XP`;
      }else{
        meta.textContent=`${lesson.duration} • ${lesson.xp} XP`;
      }
      info.appendChild(title);
      info.appendChild(meta);
      item.appendChild(button);
      item.appendChild(info);
      path.appendChild(item);
    });
    sectionElement.appendChild(banner);
    sectionElement.appendChild(path);
    roadmapContainer.appendChild(sectionElement);
  });
}
function escapeHtml(value){
  const div=document.createElement('div');
  div.textContent=String(value??'');
  return div.innerHTML;
}
renderRoadmap();
