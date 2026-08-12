// ---------------------------------------------------------------------------
// CosmoKlub — progress tracking (XP, levels, ranks, completed lessons).
//
// Progress lives in one of two places, chosen automatically:
//   - Signed in (a Supabase session is present): the server is
//     authoritative. Reads come from `user_progress` / `lesson_completions`,
//     and the ONLY way to earn XP is the `complete_lesson()` RPC (see
//     supabase/schema-progress.sql) — this file never writes XP directly.
//   - Signed out, or Supabase isn't configured on this deployment: falls
//     back to the original localStorage-only behavior, so the site keeps
//     working as a solo demo for anonymous visitors (dashboard/roadmap/
//     lesson pages don't require an account).
//
// Every public getter below (getCategoryProgress, getCategoryStats,
// getAllCategoryStats, getOverallProgress, isLessonCompleted, ...) is
// SYNCHRONOUS — it reads from an in-memory snapshot kept up to date with
// whichever source is active. That snapshot starts empty and is filled in
// asynchronously right after this script runs. If a render needs to be sure
// it has real data (not the brief initial zero-state):
//   - await window.progressReady, or
//   - listen for the 'cosmoklub-progress-changed' event — it fires once the
//     initial load finishes, again on every sign-in/sign-out, and on every
//     completeLesson() call.
// ---------------------------------------------------------------------------

const COSMOKLUB_PROGRESS_KEY='cosmoklub-progress-v2';

const COSMOKLUB_CATEGORY_IDS=[
  'stars',
  'galaxies',
  'cosmology',
  'planets',
  'nebulae',
  'observing'
];

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

// Mirrors level_for_xp()'s threshold array in supabase/schema-progress.sql
// exactly, so the client and the server always agree on level for a given
// XP total. Keep both in sync if either changes.
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

// ===========================================================================
// Pure level/rank helpers — no storage involved. Mirror level_for_xp() /
// rank_for_level() in supabase/schema-progress.sql exactly.
// ===========================================================================

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

// ===========================================================================
// Local (guest / signed-out) storage — the original localStorage-only
// implementation, kept as the fallback path.
// ===========================================================================

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

  COSMOKLUB_CATEGORY_IDS.forEach(categoryId=>{
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

function loadLocalProgress(){
  try{
    const raw=localStorage.getItem(COSMOKLUB_PROGRESS_KEY);

    if(raw){
      return normalizeProgress(JSON.parse(raw));
    }

    const legacy=findLegacyProgress();

    if(legacy){
      saveLocalProgress(legacy);
      return legacy;
    }
  }catch(error){
    console.warn('Could not load CosmoKlub progress.',error);
  }

  return createEmptyProgress();
}

function saveLocalProgress(progress){
  try{
    localStorage.setItem(
      COSMOKLUB_PROGRESS_KEY,
      JSON.stringify(normalizeProgress(progress))
    );
  }catch(error){
    console.warn('Could not save CosmoKlub progress.',error);
  }
}

// ===========================================================================
// In-memory snapshot — the single source every public getter reads from,
// regardless of whether it's currently backed by Supabase or localStorage.
// ===========================================================================

let progressSnapshot=createEmptyProgress();
let progressSource='pending'; // 'pending' | 'local' | 'remote'
let progressUserId=null;

let resolveProgressReady;
window.progressReady=new Promise(resolve=>{
  resolveProgressReady=resolve;
});
let progressReadyResolved=false;

function notifyProgressChanged(detail){
  window.dispatchEvent(
    new CustomEvent('cosmoklub-progress-changed',{
      detail:detail||{}
    })
  );
}

function markProgressReady(){
  if(!progressReadyResolved){
    progressReadyResolved=true;
    resolveProgressReady(progressSnapshot);
  }
}

// ===========================================================================
// Remote (Supabase) sync.
// ===========================================================================

async function fetchRemoteSnapshot(client,uid){
  const snapshot=createEmptyProgress();

  COSMOKLUB_CATEGORY_IDS.forEach(categoryId=>{
    snapshot.categories[categoryId]={xp:0,completedLessons:[]};
  });

  // RLS on user_progress allows any authenticated user to SELECT the whole
  // table (needed for leaderboards elsewhere) — .eq('user_id', uid) is what
  // actually scopes this query down to the signed-in user's own rows.
  // lesson_completions' RLS policy already scopes to auth.uid() = user_id,
  // but the explicit filter is kept for clarity and defense in depth.
  const [progressResult,completionResult]=await Promise.all([
    client.from('user_progress').select('category_id, xp').eq('user_id',uid),
    client.from('lesson_completions').select('category_id, lesson_id').eq('user_id',uid)
  ]);

  if(progressResult.error){
    console.warn('Could not load CosmoKlub XP from Supabase.',progressResult.error);
  }

  if(completionResult.error){
    console.warn('Could not load CosmoKlub lesson completions from Supabase.',completionResult.error);
  }

  (progressResult.data||[]).forEach(row=>{
    if(snapshot.categories[row.category_id]){
      snapshot.categories[row.category_id].xp=Number(row.xp)||0;
    }
  });

  (completionResult.data||[]).forEach(row=>{
    const category=snapshot.categories[row.category_id];

    if(category&&!category.completedLessons.includes(row.lesson_id)){
      category.completedLessons.push(row.lesson_id);
    }
  });

  return snapshot;
}

async function refreshRemoteSnapshot(){
  if(progressSource!=='remote'||!progressUserId){
    return;
  }

  try{
    const client=window.supabaseClient||await window.supabaseReady;

    if(!client)return;

    progressSnapshot=await fetchRemoteSnapshot(client,progressUserId);
    notifyProgressChanged({refreshed:true});
  }catch(error){
    console.warn('Could not refresh CosmoKlub progress from Supabase.',error);
  }
}

async function switchToRemote(client,uid){
  progressSource='remote';
  progressUserId=uid;

  try{
    progressSnapshot=await fetchRemoteSnapshot(client,uid);
  }catch(error){
    console.warn('Could not load CosmoKlub progress from Supabase; showing zeros.',error);
    progressSnapshot=createEmptyProgress();
  }

  markProgressReady();
  notifyProgressChanged({source:'remote'});
}

function switchToLocal(){
  progressSource='local';
  progressUserId=null;
  progressSnapshot=loadLocalProgress();

  markProgressReady();
  notifyProgressChanged({source:'local'});
}

async function initProgress(){
  try{
    const client=window.supabaseClient||(window.supabaseReady?await window.supabaseReady:null);

    if(!client){
      switchToLocal();
      return;
    }

    const{data}=await client.auth.getSession();
    const user=data?.session?.user||null;

    if(user){
      await switchToRemote(client,user.id);
    }else{
      switchToLocal();
    }

    // Keep in sync with sign-in/sign-out that happens on THIS page — e.g.
    // an OAuth redirect finishing on dashboard.html, or a logout click —
    // not just the state at the moment this script first ran.
    client.auth.onAuthStateChange((_event,session)=>{
      const nextUser=session?.user||null;

      if(nextUser&&(progressSource!=='remote'||progressUserId!==nextUser.id)){
        switchToRemote(client,nextUser.id);
      }else if(!nextUser&&progressSource!=='local'){
        switchToLocal();
      }
    });
  }catch(error){
    console.warn('Could not determine CosmoKlub auth state; using local progress.',error);
    switchToLocal();
  }
}

initProgress();

// ===========================================================================
// Public getters — synchronous, read from progressSnapshot.
// ===========================================================================

function loadProgress(){
  return progressSnapshot;
}

function getCategoryProgress(categoryId){
  return normalizeCategoryProgress(progressSnapshot.categories[categoryId]);
}

function saveCategoryProgress(categoryId,categoryProgress){
  if(progressSource==='remote'){
    console.warn(
      'saveCategoryProgress() is not available for signed-in accounts — '+
      'XP and lesson completions can only be written by the server-side '+
      'complete_lesson() function (see supabase/schema-progress.sql). '+
      'Ignoring.'
    );
    return getCategoryProgress(categoryId);
  }

  const progress=loadLocalProgress();

  progress.categories[categoryId]=normalizeCategoryProgress(categoryProgress);

  saveLocalProgress(progress);
  progressSnapshot=progress;
  notifyProgressChanged({categoryId});

  return progress.categories[categoryId];
}

function isLessonCompleted(categoryId,lessonId){
  return getCategoryProgress(categoryId)
    .completedLessons
    .includes(lessonId);
}

// ---------------------------------------------------------------------------
// completeLesson — the only way XP is earned. Always returns a Promise now
// (it used to be synchronous): callers should `await` it, especially before
// navigating away, since the signed-in path is a network round trip to the
// complete_lesson() RPC.
// ---------------------------------------------------------------------------
async function completeLesson(categoryId,lessonId,xpAmount=0){
  await window.progressReady; // make sure local vs. remote mode is known

  if(progressSource==='remote'){
    return completeLessonRemote(categoryId,lessonId);
  }

  return completeLessonLocal(categoryId,lessonId,xpAmount);
}

function completeLessonLocal(categoryId,lessonId,xpAmount){
  const progress=loadLocalProgress();

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
    saveLocalProgress(progress);
    progressSnapshot=progress;
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
    isMaxLevel:stats.isMaxLevel,
    newBadges:[],
    newCosmetics:[]
  };

  notifyProgressChanged(result);

  return result;
}

async function completeLessonRemote(categoryId,lessonId){
  const client=window.supabaseClient||await window.supabaseReady;

  if(!client){
    console.warn('Supabase client unavailable; lesson completion was not saved.');

    const fallbackStats=getLevelProgress(getCategoryProgress(categoryId).xp);

    return{
      categoryId,
      lessonId,
      newlyCompleted:false,
      alreadyCompleted:isLessonCompleted(categoryId,lessonId),
      xpAwarded:0,
      totalXP:fallbackStats.xp,
      completedLessons:getCategoryProgress(categoryId).completedLessons,
      level:fallbackStats.level,
      rank:fallbackStats.rank,
      rankData:fallbackStats.rankData,
      nextThreshold:fallbackStats.nextThreshold,
      xpForNextLevel:fallbackStats.xpForNextLevel,
      progress:fallbackStats.progress,
      isMaxLevel:fallbackStats.isMaxLevel,
      newBadges:[],
      newCosmetics:[],
      error:'no-client'
    };
  }

  // complete_lesson() independently recomputes XP for (category, lesson)
  // server-side — it never trusts a client-supplied amount, so there's no
  // xpAmount argument here (see supabase/schema-progress.sql section 9).
  const{data,error}=await client.rpc('complete_lesson',{
    p_category_id:categoryId,
    p_lesson_id:lessonId
  });

  if(error){
    console.error('CosmoKlub complete_lesson() RPC failed:',error);
    throw error;
  }

  const category=normalizeCategoryProgress(
    progressSnapshot.categories[categoryId]
  );

  category.xp=Number(data.total_xp)||0;

  if(data.newly_completed&&!category.completedLessons.includes(lessonId)){
    category.completedLessons=[...category.completedLessons,lessonId];
  }

  progressSnapshot.categories[categoryId]=category;

  const levelStats=getLevelProgress(category.xp);

  const result={
    categoryId,
    lessonId,
    newlyCompleted:Boolean(data.newly_completed),
    alreadyCompleted:!data.newly_completed,
    xpAwarded:Number(data.xp_awarded)||0,
    totalXP:category.xp,
    completedLessons:[...category.completedLessons],
    level:data.level??levelStats.level,
    rank:data.rank||levelStats.rank,
    rankData:levelStats.rankData,
    nextThreshold:levelStats.nextThreshold,
    xpForNextLevel:levelStats.xpForNextLevel,
    progress:levelStats.progress,
    isMaxLevel:levelStats.isMaxLevel,
    newBadges:data.new_badges||[],
    newCosmetics:data.new_cosmetics||[]
  };

  notifyProgressChanged(result);

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
  if(progressSource==='remote'){
    console.warn(
      'awardXP() only works for signed-out/local progress. Signed-in XP '+
      'can only be earned by completing a real lesson via completeLesson() '+
      '(which calls the server-side complete_lesson() function). Ignoring.'
    );
    return getCategoryStats(categoryId);
  }

  const progress=loadLocalProgress();

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

  saveLocalProgress(progress);
  progressSnapshot=progress;

  const stats=getLevelProgress(categoryProgress.xp);

  notifyProgressChanged({
    categoryId,
    xpAwarded:safeAmount,
    totalXP:categoryProgress.xp,
    level:stats.level,
    rank:stats.rank
  });

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
  return COSMOKLUB_CATEGORY_IDS.map(
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

function resetCategoryProgress(categoryId){
  if(progressSource==='remote'){
    console.warn(
      'resetCategoryProgress() is not available for signed-in accounts — '+
      'there is no server-side reset function, by design (see '+
      'supabase/schema-progress.sql). Ignoring.'
    );
    return;
  }

  const progress=loadLocalProgress();

  progress.categories[categoryId]={
    xp:0,
    completedLessons:[]
  };

  saveLocalProgress(progress);
  progressSnapshot=progress;

  notifyProgressChanged({
    categoryId,
    reset:true
  });
}

function resetAllProgress(){
  if(progressSource==='remote'){
    console.warn(
      'resetAllProgress() is not available for signed-in accounts — '+
      'there is no server-side reset function, by design (see '+
      'supabase/schema-progress.sql). Ignoring.'
    );
    return;
  }

  localStorage.removeItem(COSMOKLUB_PROGRESS_KEY);
  progressSnapshot=createEmptyProgress();

  notifyProgressChanged({
    resetAll:true
  });
}

function exportProgress(){
  return JSON.parse(
    JSON.stringify(progressSnapshot)
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
window.refreshRemoteSnapshot=refreshRemoteSnapshot;
