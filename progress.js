const COSMOKLUB_PROGRESS_KEY='cosmoklub-progress-v2';

const COSMOKLUB_RANKS=[
  {
    name:'BRONZE',
    className:'rank-bronze',
    tierClass:'tier-bronze',
    minLevel:1,
    maxLevel:4
  },
  {
    name:'SILVER',
    className:'rank-silver',
    tierClass:'tier-silver',
    minLevel:5,
    maxLevel:8
  },
  {
    name:'GOLD',
    className:'rank-gold',
    tierClass:'tier-gold',
    minLevel:9,
    maxLevel:12
  },
  {
    name:'PLATINUM',
    className:'rank-platinum',
    tierClass:'tier-platinum',
    minLevel:13,
    maxLevel:16
  },
  {
    name:'DIAMOND',
    className:'rank-diamond',
    tierClass:'tier-diamond',
    minLevel:17,
    maxLevel:20
  }
];

const COSMOKLUB_LEVEL_THRESHOLDS=[
  0,
  20,
  50,
  80,
  120,
  160,
  200,
  240,
  285,
  330,
  375,
  420,
  470,
  520,
  570,
  620,
  675,
  730,
  785,
  840
];

function createEmptyProgress(){
  return{
    version:2,
    categories:{}
  };
}

function normalizeCompletedLessons(value){
  if(Array.isArray(value)){
    return [...new Set(value.filter(item=>typeof item==='string'))];
  }

  if(value&&typeof value==='object'){
    return Object.keys(value).filter(key=>value[key]);
  }

  return[];
}

function normalizeCategoryProgress(value){
  if(!value||typeof value!=='object'){
    return{
      xp:0,
      completedLessons:[]
    };
  }

  const xp=Number(value.xp);

  return{
    xp:Number.isFinite(xp)&&xp>=0?xp:0,
    completedLessons:normalizeCompletedLessons(
      value.completedLessons||
      value.completed||
      value.lessons||
      value.completedLessonIds
    )
  };
}

function normalizeProgress(value){
  const result=createEmptyProgress();

  if(!value||typeof value!=='object'){
    return result;
  }

  const possibleCategories=
    value.categories&&typeof value.categories==='object'
      ?value.categories
      :value;

  const knownCategories=[
    'stars',
    'galaxies',
    'cosmology',
    'planets',
    'nebulae',
    'observing'
  ];

  knownCategories.forEach(categoryId=>{
    if(possibleCategories[categoryId]){
      result.categories[categoryId]=normalizeCategoryProgress(
        possibleCategories[categoryId]
      );
    }
  });

  return result;
}

function findLegacyProgress(){
  const legacyKeys=[
    'cosmoklub-progress-v1',
    'cosmoklub-progress',
    'cosmoklubProgress',
    'cosmoklub_progress',
    'cosmoklub-library-progress',
    'cosmoklubLibraryProgress'
  ];

  for(const key of legacyKeys){
    try{
      const raw=localStorage.getItem(key);

      if(!raw){
        continue;
      }

      const parsed=JSON.parse(raw);
      const normalized=normalizeProgress(parsed);

      if(Object.keys(normalized.categories).length>0){
        return normalized;
      }
    }catch(error){
      console.warn(`Could not read legacy CosmoKlub progress from ${key}.`,error);
    }
  }

  return null;
}

function loadProgress(){
  try{
    const raw=localStorage.getItem(COSMOKLUB_PROGRESS_KEY);

    if(raw){
      return normalizeProgress(JSON.parse(raw));
    }

    const legacy=findLegacyProgress();

    if(legacy){
      saveProgress(legacy);
      return legacy;
    }
  }catch(error){
    console.warn('Could not load CosmoKlub progress.',error);
  }

  return createEmptyProgress();
}

function saveProgress(progress){
  try{
    localStorage.setItem(
      COSMOKLUB_PROGRESS_KEY,
      JSON.stringify(normalizeProgress(progress))
    );
  }catch(error){
    console.warn('Could not save CosmoKlub progress.',error);
  }
}

function getCategoryProgress(categoryId){
  const progress=loadProgress();

  if(!progress.categories[categoryId]){
    progress.categories[categoryId]={
      xp:0,
      completedLessons:[]
    };

    saveProgress(progress);
  }

  return normalizeCategoryProgress(progress.categories[categoryId]);
}

function saveCategoryProgress(categoryId,categoryProgress){
  const progress=loadProgress();

  progress.categories[categoryId]=normalizeCategoryProgress(categoryProgress);

  saveProgress(progress);

  return progress.categories[categoryId];
}

function getRankForLevel(level){
  const safeLevel=Math.max(
    1,
    Math.min(20,Number(level)||1)
  );

  return(
    [...COSMOKLUB_RANKS]
      .reverse()
      .find(rank=>safeLevel>=rank.minLevel)||
    COSMOKLUB_RANKS[0]
  );
}

function getLevelFromXP(xp){
  const safeXP=Math.max(0,Number(xp)||0);
  let level=1;

  for(let i=0;i<COSMOKLUB_LEVEL_THRESHOLDS.length;i++){
    if(safeXP>=COSMOKLUB_LEVEL_THRESHOLDS[i]){
      level=i+1;
    }else{
      break;
    }
  }

  return Math.min(level,20);
}

function getLevelProgress(xp){
  const safeXP=Math.max(0,Number(xp)||0);
  const level=getLevelFromXP(safeXP);
  const rank=getRankForLevel(level);

  const currentThreshold=
    COSMOKLUB_LEVEL_THRESHOLDS[level-1]??0;

  const isMaxLevel=level>=COSMOKLUB_LEVEL_THRESHOLDS.length;

  const nextThreshold=isMaxLevel
    ?currentThreshold
    :COSMOKLUB_LEVEL_THRESHOLDS[level];

  let progressPercent=100;

  if(!isMaxLevel){
    const range=nextThreshold-currentThreshold;
    const earned=safeXP-currentThreshold;

    progressPercent=range>0
      ?Math.round((earned/range)*100)
      :100;
  }

  progressPercent=Math.max(
    0,
    Math.min(100,progressPercent)
  );

  return{
    xp:safeXP,
    level,
    rank:rank.name,
    rankData:rank,
    rankClass:rank.className,
    tierClass:rank.tierClass,
    currentThreshold,
    nextThreshold,
    xpIntoLevel:safeXP-currentThreshold,
    xpForNextLevel:isMaxLevel
      ?0
      :Math.max(0,nextThreshold-safeXP),
    progress:progressPercent,
    isMaxLevel
  };
}

function isLessonCompleted(categoryId,lessonId){
  return getCategoryProgress(categoryId)
    .completedLessons
    .includes(lessonId);
}

function completeLesson(categoryId,lessonId,xpAmount=0){
  const progress=loadProgress();

  if(!progress.categories[categoryId]){
    progress.categories[categoryId]={
      xp:0,
      completedLessons:[]
    };
  }

  const categoryProgress=normalizeCategoryProgress(
    progress.categories[categoryId]
  );

  const alreadyCompleted=
    categoryProgress.completedLessons.includes(lessonId);

  const safeXP=Math.max(0,Number(xpAmount)||0);

  if(!alreadyCompleted){
    categoryProgress.completedLessons.push(lessonId);
    categoryProgress.xp+=safeXP;

    progress.categories[categoryId]=categoryProgress;
    saveProgress(progress);
  }

  const stats=getLevelProgress(categoryProgress.xp);

  const result={
    categoryId,
    lessonId,
    newlyCompleted:!alreadyCompleted,
    alreadyCompleted,
    xpAwarded:alreadyCompleted?0:safeXP,
    totalXP:categoryProgress.xp,
    completedLessons:[...categoryProgress.completedLessons],
    level:stats.level,
    rank:stats.rank,
    rankData:stats.rankData,
    nextThreshold:stats.nextThreshold,
    xpForNextLevel:stats.xpForNextLevel,
    progress:stats.progress,
    isMaxLevel:stats.isMaxLevel
  };

  window.dispatchEvent(
    new CustomEvent('cosmoklub-progress-changed',{
      detail:result
    })
  );

  return result;
}

function markLessonComplete(categoryId,lessonId,xpAmount=0){
  return completeLesson(
    categoryId,
    lessonId,
    xpAmount
  );
}

function saveLessonCompletion(categoryId,lessonId,xpAmount=0){
  return completeLesson(
    categoryId,
    lessonId,
    xpAmount
  );
}

function awardXP(categoryId,amount){
  const progress=loadProgress();

  if(!progress.categories[categoryId]){
    progress.categories[categoryId]={
      xp:0,
      completedLessons:[]
    };
  }

  const categoryProgress=normalizeCategoryProgress(
    progress.categories[categoryId]
  );

  const safeAmount=Math.max(0,Number(amount)||0);

  categoryProgress.xp+=safeAmount;
  progress.categories[categoryId]=categoryProgress;

  saveProgress(progress);

  const stats=getLevelProgress(categoryProgress.xp);

  window.dispatchEvent(
    new CustomEvent('cosmoklub-progress-changed',{
      detail:{
        categoryId,
        xpAwarded:safeAmount,
        totalXP:categoryProgress.xp,
        level:stats.level,
        rank:stats.rank
      }
    })
  );

  return{
    categoryId,
    xpAwarded:safeAmount,
    totalXP:categoryProgress.xp,
    ...stats
  };
}

function getCategoryStats(categoryId){
  const categoryProgress=getCategoryProgress(categoryId);
  const levelProgress=getLevelProgress(categoryProgress.xp);

  let totalLessons=0;

  if(
    typeof COURSE_DATA!=='undefined'&&
    COURSE_DATA[categoryId]&&
    Array.isArray(COURSE_DATA[categoryId].sections)
  ){
    totalLessons=COURSE_DATA[categoryId].sections.reduce(
      (sum,section)=>{
        return sum+(
          Array.isArray(section.lessons)
            ?section.lessons.length
            :0
        );
      },
      0
    );
  }

  const completedLessons=categoryProgress.completedLessons.length;

  return{
    id:categoryId,
    xp:categoryProgress.xp,
    completedLessons,
    completedLessonIds:[
      ...categoryProgress.completedLessons
    ],
    totalLessons,
    completionPercent:totalLessons>0
      ?Math.round((completedLessons/totalLessons)*100)
      :0,
    ...levelProgress
  };
}

function getAllCategoryStats(){
  const categoryIds=[
    'stars',
    'galaxies',
    'cosmology',
    'planets',
    'nebulae',
    'observing'
  ];

  return categoryIds.map(
    categoryId=>getCategoryStats(categoryId)
  );
}

function getOverallProgress(){
  const categories=getAllCategoryStats();

  const totalCompleted=categories.reduce(
    (sum,category)=>sum+category.completedLessons,
    0
  );

  const totalLessons=categories.reduce(
    (sum,category)=>sum+category.totalLessons,
    0
  );

  const totalXP=categories.reduce(
    (sum,category)=>sum+category.xp,
    0
  );

  const averageLevel=categories.length
    ?Math.round(
      categories.reduce(
        (sum,category)=>sum+category.level,
        0
      )/categories.length
    )
    :1;

  const rank=getRankForLevel(averageLevel);

  return{
    totalCompleted,
    totalLessons,
    totalXP,
    averageLevel,
    rank:rank.name,
    rankData:rank,
    rankClass:rank.className,
    tierClass:rank.tierClass,
    completionPercent:totalLessons>0
      ?Math.round((totalCompleted/totalLessons)*100)
      :0,
    categories
  };
}

function getOverallRank(){
  return getOverallProgress().rank;
}

function getNextRank(level){
  const currentRank=getRankForLevel(level);
  const index=COSMOKLUB_RANKS.findIndex(
    rank=>rank.name===currentRank.name
  );

  if(index<0||index>=COSMOKLUB_RANKS.length-1){
    return null;
  }

  return COSMOKLUB_RANKS[index+1];
}

function resetCategoryProgress(categoryId){
  const progress=loadProgress();

  progress.categories[categoryId]={
    xp:0,
    completedLessons:[]
  };

  saveProgress(progress);

  window.dispatchEvent(
    new CustomEvent('cosmoklub-progress-changed',{
      detail:{
        categoryId,
        reset:true
      }
    })
  );
}

function resetAllProgress(){
  localStorage.removeItem(COSMOKLUB_PROGRESS_KEY);

  window.dispatchEvent(
    new CustomEvent('cosmoklub-progress-changed',{
      detail:{
        resetAll:true
      }
    })
  );
}

function exportProgress(){
  return JSON.parse(
    JSON.stringify(loadProgress())
  );
}

window.COSMOKLUB_RANKS=COSMOKLUB_RANKS;
window.COSMOKLUB_LEVEL_THRESHOLDS=COSMOKLUB_LEVEL_THRESHOLDS;
window.getCategoryProgress=getCategoryProgress;
window.saveCategoryProgress=saveCategoryProgress;
window.getCategoryStats=getCategoryStats;
window.getAllCategoryStats=getAllCategoryStats;
window.getOverallProgress=getOverallProgress;
window.getOverallRank=getOverallRank;
window.getRankForLevel=getRankForLevel;
window.getLevelFromXP=getLevelFromXP;
window.getLevelProgress=getLevelProgress;
window.getNextRank=getNextRank;
window.isLessonCompleted=isLessonCompleted;
window.completeLesson=completeLesson;
window.markLessonComplete=markLessonComplete;
window.saveLessonCompletion=saveLessonCompletion;
window.awardXP=awardXP;
window.resetCategoryProgress=resetCategoryProgress;
window.resetAllProgress=resetAllProgress;
window.exportProgress=exportProgress;
