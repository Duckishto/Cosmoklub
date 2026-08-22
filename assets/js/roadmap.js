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

function openLesson(lesson){
  window.location.href=
    `lesson.html?category=${encodeURIComponent(category.id)}&lesson=${encodeURIComponent(lesson.id)}`;
}

function attachLiquidGlass(node){
  if(!node||node.disabled){
    return;
  }

  let previousX=null;
  let previousY=null;
  let previousTime=performance.now();

  let currentStretchX=1;
  let currentStretchY=1;
  let targetStretchX=1;
  let targetStretchY=1;

  let currentRotate=0;
  let targetRotate=0;

  let animationFrame=null;

  function animateLiquid(){
    currentStretchX+=(targetStretchX-currentStretchX)*0.15;
    currentStretchY+=(targetStretchY-currentStretchY)*0.15;
    currentRotate+=(targetRotate-currentRotate)*0.15;

    node.style.setProperty(
      '--liquid-scale-x',
      currentStretchX.toFixed(4)
    );

    node.style.setProperty(
      '--liquid-scale-y',
      currentStretchY.toFixed(4)
    );

    node.style.setProperty(
      '--liquid-rotate',
      `${currentRotate.toFixed(2)}deg`
    );

    const moving=
      Math.abs(currentStretchX-targetStretchX)>0.001||
      Math.abs(currentStretchY-targetStretchY)>0.001||
      Math.abs(currentRotate-targetRotate)>0.05;

    if(moving){
      animationFrame=requestAnimationFrame(animateLiquid);
    }else{
      animationFrame=null;
    }
  }

  function startAnimation(){
    if(!animationFrame){
      animationFrame=requestAnimationFrame(animateLiquid);
    }
  }

  function handlePointerMove(event){
    const rect=node.getBoundingClientRect();

    const localX=event.clientX-rect.left;
    const localY=event.clientY-rect.top;

    const percentX=Math.max(
      0,
      Math.min(
        100,
        (localX/rect.width)*100
      )
    );

    const percentY=Math.max(
      0,
      Math.min(
        100,
        (localY/rect.height)*100
      )
    );

    node.style.setProperty(
      '--glass-x',
      `${percentX}%`
    );

    node.style.setProperty(
      '--glass-y',
      `${percentY}%`
    );

    const normalizedX=(percentX-50)/50;
    const normalizedY=(percentY-50)/50;

    node.style.setProperty(
      '--liquid-x',
      normalizedX.toFixed(3)
    );

    node.style.setProperty(
      '--liquid-y',
      normalizedY.toFixed(3)
    );

    node.style.setProperty(
      '--highlight-x',
      `${50+normalizedX*20}%`
    );

    node.style.setProperty(
      '--highlight-y',
      `${35+normalizedY*18}%`
    );

    const now=performance.now();
    const deltaTime=Math.max(
      8,
      now-previousTime
    );

    if(previousX!==null&&previousY!==null){
      const velocityX=
        (event.clientX-previousX)/deltaTime;

      const velocityY=
        (event.clientY-previousY)/deltaTime;

      const speed=Math.min(
        1,
        Math.hypot(
          velocityX,
          velocityY
        )*0.9
      );

      targetStretchX=
        1+
        Math.min(
          .09,
          Math.abs(velocityX)*.07
        );

      targetStretchY=
        1+
        Math.min(
          .09,
          Math.abs(velocityY)*.07
        );

      if(
        Math.abs(velocityX)>
        Math.abs(velocityY)
      ){
        targetStretchY=
          1-
          Math.min(
            .045,
            speed*.035
          );
      }else{
        targetStretchX=
          1-
          Math.min(
            .045,
            speed*.035
          );
      }

      targetRotate=
        Math.max(
          -5,
          Math.min(
            5,
            velocityX*4
          )
        );
    }

    previousX=event.clientX;
    previousY=event.clientY;
    previousTime=now;

    node.classList.add('is-liquid-hover');

    startAnimation();
  }

  function resetLiquid(){
    previousX=null;
    previousY=null;

    targetStretchX=1;
    targetStretchY=1;
    targetRotate=0;

    node.style.setProperty(
      '--glass-x',
      '50%'
    );

    node.style.setProperty(
      '--glass-y',
      '28%'
    );

    node.style.setProperty(
      '--liquid-x',
      '0'
    );

    node.style.setProperty(
      '--liquid-y',
      '0'
    );

    node.style.setProperty(
      '--highlight-x',
      '50%'
    );

    node.style.setProperty(
      '--highlight-y',
      '30%'
    );

    node.classList.remove(
      'is-liquid-hover'
    );

    startAnimation();
  }

  node.addEventListener(
    'pointermove',
    handlePointerMove
  );

  node.addEventListener(
    'pointerleave',
    resetLiquid
  );

  node.addEventListener(
    'pointercancel',
    resetLiquid
  );

  node.addEventListener(
    'pointerdown',
    ()=>{
      node.classList.add(
        'is-liquid-pressed'
      );
    }
  );

  node.addEventListener(
    'pointerup',
    ()=>{
      node.classList.remove(
        'is-liquid-pressed'
      );
    }
  );

  node.addEventListener(
    'pointerleave',
    ()=>{
      node.classList.remove(
        'is-liquid-pressed'
      );
    }
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

      const canOpen=unlocked||completed;

      button.disabled=!canOpen;

      if(canOpen){
        button.addEventListener('click',()=>openLesson(lesson));
      }

      attachLiquidGlass(button);

      const info=document.createElement('button');
      info.type='button';
      info.className='path-info path-info-button';
      info.disabled=!canOpen;
      info.setAttribute('aria-label',`${lesson.title}${canOpen?' — open lesson':' — locked'}`);

      if(canOpen){
        info.addEventListener('click',()=>openLesson(lesson));
      }

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

// progress.js loads XP/completions asynchronously (Supabase for signed-in
// users, localStorage for guests), so the very first renderRoadmap() call
// above can happen before that data has arrived. Re-render whenever
// progress.js reports a change — the initial load, sign-in/sign-out, and
// every completed lesson all dispatch this event.
window.addEventListener('cosmoklub-progress-changed',renderRoadmap);
