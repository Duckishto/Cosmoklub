const params=new URLSearchParams(window.location.search);
const categoryId=params.get('category')||'stars';
const category=COURSE_DATA[categoryId];

if(!category){
  window.location.replace('dashboard.html');
  throw new Error('Unknown course category');
}

const roadmapContainer=document.getElementById('roadmapContainer');
const categoryIcon=document.getElementById('categoryIcon');
const categoryTitle=document.getElementById('categoryTitle');
const categoryDescription=document.getElementById('categoryDescription');
const categoryRank=document.getElementById('categoryRank');
const categoryLevel=document.getElementById('categoryLevel');
const categoryXp=document.getElementById('categoryXp');
const categoryProgressFill=document.getElementById('categoryProgressFill');
const categoryProgressText=document.getElementById('categoryProgressText');
const categoryNextLevel=document.getElementById('categoryNextLevel');
const libraryBack=document.getElementById('libraryBack');

document.title=`${category.title} Roadmap | CosmoKlub`;

categoryIcon.textContent=category.icon;
categoryTitle.textContent=category.title;
categoryDescription.textContent=category.description;

if(libraryBack){
  libraryBack.addEventListener('click',()=>{
    window.location.href='dashboard.html?tab=library';
  });
}

function getCompletedIds(){
  return getCategoryProgress(category.id).completedLessons;
}

function getFlatLessons(){
  return category.sections.flatMap(section=>section.lessons);
}

function isLessonComplete(lesson){
  return getCompletedIds().includes(lesson.id);
}

function isLessonUnlocked(lesson){
  const lessons=getFlatLessons();
  const index=lessons.findIndex(item=>item.id===lesson.id);

  if(index===0){
    return true;
  }

  return isLessonComplete(lessons[index-1]);
}

function isSectionComplete(section){
  return section.lessons.length>0&&section.lessons.every(lesson=>isLessonComplete(lesson));
}

function isSectionUnlocked(sectionIndex){
  if(sectionIndex===0){
    return true;
  }

  return isSectionComplete(category.sections[sectionIndex-1]);
}

function updateCategoryHeader(){
  const progress=getCategoryProgress(category.id);
  const stats=getLevelProgress(progress.xp);
  const completed=progress.completedLessons.length;
  const total=getFlatLessons().length;

  categoryRank.textContent=stats.rank;
  categoryLevel.textContent=`Level ${stats.level}`;
  categoryXp.textContent=`${progress.xp} XP`;
  categoryProgressText.textContent=`${completed} / ${total} complete`;

  if(stats.level>=20){
    categoryNextLevel.textContent='Maximum level';
    categoryProgressFill.style.width='100%';
  }else{
    categoryNextLevel.textContent=`Next level: ${stats.nextThreshold} XP`;
    categoryProgressFill.style.width=`${stats.progress}%`;
  }
}

function attachLiquidGlass(node){
  if(!node||node.disabled){
    return;
  }

  const updateLight=event=>{
    const rect=node.getBoundingClientRect();

    const x=((event.clientX-rect.left)/rect.width)*100;
    const y=((event.clientY-rect.top)/rect.height)*100;

    const offsetX=((x-50)/50)*1.4;
    const offsetY=((y-50)/50)*1.4;

    node.style.setProperty(
      '--glass-x',
      `${Math.max(0,Math.min(100,x))}%`
    );

    node.style.setProperty(
      '--glass-y',
      `${Math.max(0,Math.min(100,y))}%`
    );

    node.style.setProperty(
      '--glass-shift-x',
      `${offsetX}px`
    );

    node.style.setProperty(
      '--glass-shift-y',
      `${offsetY-3}px`
    );
  };

  const resetLight=()=>{
    node.style.setProperty('--glass-x','50%');
    node.style.setProperty('--glass-y','28%');
    node.style.setProperty('--glass-shift-x','0px');
    node.style.setProperty('--glass-shift-y','0px');
  };

  node.addEventListener(
    'pointermove',
    updateLight
  );

  node.addEventListener(
    'pointerleave',
    resetLight
  );

  node.addEventListener(
    'pointercancel',
    resetLight
  );
}

function renderRoadmap(){
  roadmapContainer.innerHTML='';
  updateCategoryHeader();

  category.sections.forEach((section,sectionIndex)=>{
    if(!isSectionUnlocked(sectionIndex)){
      return;
    }

    const sectionElement=document.createElement('section');
    sectionElement.className='course-section';

    const banner=document.createElement('div');
    banner.className='section-banner';

    const sectionLabel=document.createElement('div');
    sectionLabel.className='section-number';
    sectionLabel.textContent=`Section ${sectionIndex+1}`;

    const sectionTitle=document.createElement('h2');
    sectionTitle.textContent=section.title;

    const sectionSubtitle=document.createElement('p');
    sectionSubtitle.textContent=section.subtitle;

    banner.appendChild(sectionLabel);
    banner.appendChild(sectionTitle);
    banner.appendChild(sectionSubtitle);

    const path=document.createElement('div');
    path.className='path';

    section.lessons.forEach((lesson,index)=>{
      const completed=isLessonComplete(lesson);
      const unlocked=isLessonUnlocked(lesson);

      const item=document.createElement('div');
      item.className=`path-item path-position-${index%6}`;

      if(lesson.type==='quiz'){
        item.classList.add('quiz');
      }

      if(completed){
        item.classList.add('completed');
      }

      if(!unlocked&&!completed){
        item.classList.add('locked');
      }

      const button=document.createElement('button');

      button.className='path-node';
      button.type='button';

      if(completed){
        button.textContent='✓';
      }else if(!unlocked){
        button.textContent='🔒';
      }else if(lesson.type==='quiz'){
        button.textContent='◆';
      }else{
        button.textContent='★';
      }

      button.disabled=!unlocked&&!completed;

      if(unlocked||completed){
        button.addEventListener('click',()=>{
          window.location.href=
            `lesson.html?category=${encodeURIComponent(category.id)}&lesson=${encodeURIComponent(lesson.id)}`;
        });
      }

      attachLiquidGlass(button);

      const info=document.createElement('div');
      info.className='path-info';

      const title=document.createElement('div');
      title.className='path-title';
      title.textContent=lesson.title;

      const meta=document.createElement('div');
      meta.className='path-meta';

      if(completed){
        meta.textContent=
          `Completed • ${lesson.xp} XP`;
      }else if(!unlocked){
        meta.textContent=
          'Locked • Complete the previous lesson';
      }else if(lesson.type==='quiz'){
        meta.textContent=
          `Quiz • ${lesson.duration} • ${lesson.xp} XP`;
      }else{
        meta.textContent=
          `${lesson.duration} • ${lesson.xp} XP`;
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

renderRoadmap();
