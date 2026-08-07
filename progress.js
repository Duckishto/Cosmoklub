const LEVEL_THRESHOLDS=[
  0,20,48,80,114,
  151,189,230,271,314,
  359,404,450,498,546,
  595,645,696,748,800
];
const RANKS=[
  {name:'BRONZE',minLevel:1},
  {name:'SILVER',minLevel:5},
  {name:'GOLD',minLevel:9},
  {name:'PLATINUM',minLevel:13},
  {name:'DIAMOND',minLevel:17}
];
const CATEGORY_IDS=['stars','galaxies','cosmology','planets','nebulae','observing'];
function getDefaultProgress(){
  const categories={};
  CATEGORY_IDS.forEach(id=>{
    categories[id]={
      xp:0,
      completedLessons:[]
    };
  });
  return{categories};
}
function loadProgress(){
  try{
    const saved=localStorage.getItem('cosmoklub-progress');
    if(!saved)return getDefaultProgress();
    const progress=JSON.parse(saved);
    CATEGORY_IDS.forEach(id=>{
      if(!progress.categories?.[id]){
        if(!progress.categories)progress.categories={};
        progress.categories[id]={xp:0,completedLessons:[]};
      }
      if(!Array.isArray(progress.categories[id].completedLessons)){
        progress.categories[id].completedLessons=[];
      }
      if(typeof progress.categories[id].xp!=='number'){
        progress.categories[id].xp=0;
      }
    });
    return progress;
  }catch(error){
    console.error('Could not load CosmoKlub progress:',error);
    return getDefaultProgress();
  }
}
function saveProgress(progress){
  localStorage.setItem('cosmoklub-progress',JSON.stringify(progress));
}
function getCategoryProgress(categoryId){
  const progress=loadProgress();
  return progress.categories[categoryId]||{xp:0,completedLessons:[]};
}
function levelFromXp(xp){
  let level=1;
  for(let i=0;i<LEVEL_THRESHOLDS.length;i++){
    if(xp>=LEVEL_THRESHOLDS[i]){
      level=i+1;
    }
  }
  return Math.min(level,20);
}
function rankForLevel(level){
  if(level>=17)return'DIAMOND';
  if(level>=13)return'PLATINUM';
  if(level>=9)return'GOLD';
  if(level>=5)return'SILVER';
  return'BRONZE';
}
function getLevelProgress(xp){
  const level=levelFromXp(xp);
  if(level>=20){
    return{
      level:20,
      rank:'DIAMOND',
      currentXp:xp,
      currentThreshold:800,
      nextThreshold:800,
      xpIntoLevel:0,
      xpNeeded:0,
      progress:100
    };
  }
  const currentThreshold=LEVEL_THRESHOLDS[level-1];
  const nextThreshold=LEVEL_THRESHOLDS[level];
  const xpIntoLevel=xp-currentThreshold;
  const xpNeeded=nextThreshold-currentThreshold;
  const percentage=Math.round((xpIntoLevel/xpNeeded)*100);
  return{
    level,
    rank:rankForLevel(level),
    currentXp:xp,
    currentThreshold,
    nextThreshold,
    xpIntoLevel,
    xpNeeded,
    progress:Math.max(0,Math.min(100,percentage))
  };
}
function isLessonCompleted(categoryId,lessonId){
  const categoryProgress=getCategoryProgress(categoryId);
  return categoryProgress.completedLessons.includes(lessonId);
}
function completeLesson(categoryId,lessonId,xpReward){
  const progress=loadProgress();
  const category=progress.categories[categoryId];
  if(!category)return null;
  const alreadyCompleted=category.completedLessons.includes(lessonId);
  if(!alreadyCompleted){
    category.completedLessons.push(lessonId);
    category.xp+=xpReward;
    category.xp=Math.min(category.xp,800);
    saveProgress(progress);
  }
  return{
    alreadyCompleted,
    xpAwarded:alreadyCompleted?0:xpReward,
    categoryProgress:getLevelProgress(category.xp)
  };
}
function getAllCategoryStats(){
  return CATEGORY_IDS.map(categoryId=>{
    const progress=getCategoryProgress(categoryId);
    const stats=getLevelProgress(progress.xp);
    return{
      categoryId,
      xp:progress.xp,
      completedLessons:progress.completedLessons.length,
      level:stats.level,
      rank:stats.rank,
      progress:stats.progress,
      nextThreshold:stats.nextThreshold,
      currentThreshold:stats.currentThreshold
    };
  });
}
function getOverallStats(){
  const categories=getAllCategoryStats();
  const averageLevel=categories.reduce((sum,item)=>sum+item.level,0)/categories.length;
  const overallLevel=Math.max(1,Math.min(20,Math.floor(averageLevel)));
  const totalXp=categories.reduce((sum,item)=>sum+item.xp,0);
  const totalCompleted=categories.reduce((sum,item)=>sum+item.completedLessons,0);
  return{
    level:overallLevel,
    rank:rankForLevel(overallLevel),
    totalXp,
    totalCompleted,
    categories
  };
}
function resetPrototypeProgress(){
  localStorage.removeItem('cosmoklub-progress');
}
