const params=new URLSearchParams(window.location.search);
const categoryId=params.get('category');
const lessonId=params.get('lesson');
const category=COURSE_DATA[categoryId];
if(!category){
  console.error('Category not found:',categoryId);
  window.location.href='dashboard.html';
  throw new Error('Unknown category');
}
const allLessons=category.sections.flatMap(section=>section.lessons);
const currentLesson=allLessons.find(lesson=>lesson.id===lessonId);
if(!currentLesson){
  console.error('Lesson not found:',lessonId);
  console.log('Available lessons:',allLessons.map(lesson=>lesson.id));
  window.location.href=`roadmap.html?category=${category.id}`;
  throw new Error('Unknown lesson');
}
const lessonCover=document.getElementById('lessonCover');
const learningExperience=document.getElementById('learningExperience');
const learningStage=document.getElementById('learningStage');
const progressFill=document.getElementById('learningProgressFill');
const progressText=document.getElementById('learningProgressText');
const startButton=document.getElementById('startLearning');
const exitButton=document.getElementById('exitLesson');
const categoryElement=document.getElementById('lessonCategory');
const titleElement=document.getElementById('lessonTitle');
const descriptionElement=document.getElementById('lessonDescription');
const durationElement=document.getElementById('lessonDuration');
const xpElement=document.getElementById('lessonXp');
document.title=`${currentLesson.title} | CosmoKlub`;
if(categoryElement)categoryElement.textContent=category.title.toUpperCase();
if(titleElement)titleElement.textContent=currentLesson.title;
if(descriptionElement)descriptionElement.textContent=currentLesson.description;
if(durationElement)durationElement.textContent=currentLesson.duration;
if(xpElement)xpElement.textContent=`${currentLesson.xp} XP`;
let steps=[];
let currentStep=0;
let lessonScore=0;
let answeredQuestions=0;
let nasaImage=null;
function buildSteps(){
  steps=[];
  if(currentLesson.content?.intro){
    steps.push({
      type:'intro',
      title:currentLesson.title,
      text:currentLesson.content.intro
    });
  }
  if(currentLesson.nasaSearch){
    steps.push({
      type:'image',
      query:currentLesson.nasaSearch
    });
  }
  if(Array.isArray(currentLesson.content?.sections)){
    currentLesson.content.sections.forEach(section=>{
      steps.push({
        type:'content',
        title:section.title,
        text:section.text
      });
    });
  }
  if(Array.isArray(currentLesson.content?.activities)){
    currentLesson.content.activities.forEach(activity=>{
      steps.push({
        type:'activity',
        activity
      });
    });
  }
  if(Array.isArray(currentLesson.content?.questions)){
    currentLesson.content.questions.forEach(question=>{
      steps.push({
        type:'question',
        question
      });
    });
  }
  if(Array.isArray(currentLesson.content?.keyFacts)&&currentLesson.content.keyFacts.length){
    steps.push({
      type:'facts',
      facts:currentLesson.content.keyFacts
    });
  }
  steps.push({
    type:'complete'
  });
}
async function fetchNasaImage(){
  if(!currentLesson.nasaSearch)return null;
  try{
    const url=`https://images-api.nasa.gov/search?q=${encodeURIComponent(currentLesson.nasaSearch)}&media_type=image`;
    const response=await fetch(url);
    if(!response.ok)throw new Error(`NASA request failed: ${response.status}`);
    const data=await response.json();
    const items=data.collection?.items||[];
    const usableItem=items.find(item=>item.links?.[0]?.href);
    if(!usableItem)return null;
    return{
      src:usableItem.links[0].href,
      title:usableItem.data?.[0]?.title||currentLesson.title,
      description:usableItem.data?.[0]?.description||''
    };
  }catch(error){
    console.warn('NASA image could not be loaded:',error);
    return null;
  }
}
function updateProgress(){
  if(!steps.length)return;
  const displayStep=Math.min(currentStep+1,steps.length);
  const percentage=(displayStep/steps.length)*100;
  if(progressFill)progressFill.style.width=`${percentage}%`;
  if(progressText)progressText.textContent=`${displayStep} / ${steps.length}`;
}
function renderStep(){
  const step=steps[currentStep];
  if(!step)return;
  updateProgress();
  if(step.type==='intro'){
    renderIntro(step);
    return;
  }
  if(step.type==='image'){
    renderImage(step);
    return;
  }
  if(step.type==='content'){
    renderContent(step);
    return;
  }
  if(step.type==='activity'){
    renderActivity(step.activity);
    return;
  }
  if(step.type==='question'){
    renderQuestion(step.question);
    return;
  }
  if(step.type==='facts'){
    renderFacts(step.facts);
    return;
  }
  if(step.type==='complete'){
    renderComplete();
  }
}
function renderIntro(step){
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">${escapeHtml(category.title)}</div>
      <h1>${escapeHtml(step.title)}</h1>
      <p>${escapeHtml(step.text)}</p>
      <button class="learning-next" id="nextStep">Continue</button>
    </div>
  `;
  document.getElementById('nextStep').addEventListener('click',nextStep);
}
function renderImage(){
  if(!nasaImage){
    nextStep();
    return;
  }
  learningStage.innerHTML=`
    <div class="learning-card image-learning-card">
      <div class="nasa-label">NASA IMAGE</div>
      <img class="nasa-image" src="${escapeAttribute(nasaImage.src)}" alt="${escapeAttribute(nasaImage.title)}">
      <h2>${escapeHtml(nasaImage.title)}</h2>
      <p>${escapeHtml(trimText(nasaImage.description,350))}</p>
      <button class="learning-next" id="nextStep">Continue</button>
    </div>
  `;
  document.getElementById('nextStep').addEventListener('click',nextStep);
}
function renderContent(step){
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">LEARN</div>
      <h2>${escapeHtml(step.title)}</h2>
      <p>${escapeHtml(step.text)}</p>
      <button class="learning-next" id="nextStep">Continue</button>
    </div>
  `;
  document.getElementById('nextStep').addEventListener('click',nextStep);
}
function renderQuestion(question){
  const answers=question.answers||[];
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">${currentLesson.type==='quiz'?'QUIZ':'CHECKPOINT'}</div>
      <h2>${escapeHtml(question.question)}</h2>
      <div class="answer-list">
        ${answers.map((answer,index)=>`
          <button class="answer-button" data-answer="${index}">
            ${escapeHtml(answer)}
          </button>
        `).join('')}
      </div>
      <div id="questionFeedback"></div>
    </div>
  `;
  const buttons=[...learningStage.querySelectorAll('.answer-button')];
  buttons.forEach(button=>{
    button.addEventListener('click',()=>{
      const selected=Number(button.dataset.answer);
      handleAnswer(question,selected,buttons);
    });
  });
}
function handleAnswer(question,selected,buttons){
  const correct=selected===question.correctAnswer;
  answeredQuestions++;
  if(correct)lessonScore++;
  buttons.forEach((button,index)=>{
    button.disabled=true;
    if(index===question.correctAnswer){
      button.classList.add('answer-correct');
    }else if(index===selected&&!correct){
      button.classList.add('answer-wrong');
    }
  });
  const feedback=document.getElementById('questionFeedback');
  feedback.innerHTML=`
    <div class="question-feedback ${correct?'feedback-correct':'feedback-wrong'}">
      <strong>${correct?'Correct!':'Not quite.'}</strong>
      <p>${escapeHtml(question.explanation||'')}</p>
      <button class="learning-next" id="nextStep">Continue</button>
    </div>
  `;
  document.getElementById('nextStep').addEventListener('click',nextStep);
}
function renderActivity(activity){
  if(activity.type==='ordering'){
    renderOrdering(activity);
    return;
  }
  nextStep();
}
function renderOrdering(activity){
  let items=[...activity.items].sort(()=>Math.random()-.5);
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">ACTIVITY</div>
      <h2>${escapeHtml(activity.title)}</h2>
      <p>${escapeHtml(activity.question)}</p>
      <p class="ordering-help">Use the arrows to place the stages in the correct order.</p>
      <div class="ordering-list" id="orderingList"></div>
      <div id="orderingFeedback"></div>
      <button class="learning-next" id="checkOrder">Check Order</button>
    </div>
  `;
  const list=document.getElementById('orderingList');
  function drawOrdering(){
    list.innerHTML='';
    items.forEach((item,index)=>{
      const row=document.createElement('div');
      row.className='ordering-item';
      row.innerHTML=`
        <div class="ordering-number">${index+1}</div>
        <div>${escapeHtml(item)}</div>
        <div class="ordering-controls">
          <button class="ordering-button move-up" data-index="${index}" ${index===0?'disabled':''}>↑</button>
          <button class="ordering-button move-down" data-index="${index}" ${index===items.length-1?'disabled':''}>↓</button>
        </div>
      `;
      list.appendChild(row);
    });
    list.querySelectorAll('.move-up').forEach(button=>{
      button.addEventListener('click',()=>{
        const index=Number(button.dataset.index);
        if(index<=0)return;
        [items[index-1],items[index]]=[items[index],items[index-1]];
        drawOrdering();
      });
    });
    list.querySelectorAll('.move-down').forEach(button=>{
      button.addEventListener('click',()=>{
        const index=Number(button.dataset.index);
        if(index>=items.length-1)return;
        [items[index+1],items[index]]=[items[index],items[index+1]];
        drawOrdering();
      });
    });
  }
  drawOrdering();
  document.getElementById('checkOrder').addEventListener('click',()=>{
    const correct=items.every((item,index)=>item===activity.items[index]);
    const feedback=document.getElementById('orderingFeedback');
    if(correct){
      list.querySelectorAll('.ordering-item').forEach(item=>item.classList.add('ordering-correct'));
      feedback.innerHTML=`
        <div class="question-feedback feedback-correct">
          <strong>Correct!</strong>
          <p>${escapeHtml(activity.explanation||'')}</p>
        </div>
      `;
      const button=document.getElementById('checkOrder');
      button.textContent='Continue';
      button.onclick=nextStep;
    }else{
      feedback.innerHTML=`
        <div class="question-feedback feedback-wrong">
          <strong>Not quite.</strong>
          <p>Try rearranging the stages again.</p>
        </div>
      `;
    }
  });
}
function renderFacts(facts){
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">KEY FACTS</div>
      <h2>Remember These</h2>
      <div class="key-facts">
        ${facts.map(fact=>`
          <div class="key-fact">
            <span>✦</span>
            <p>${escapeHtml(fact)}</p>
          </div>
        `).join('')}
      </div>
      <button class="learning-next" id="nextStep">Finish Lesson</button>
    </div>
  `;
  document.getElementById('nextStep').addEventListener('click',nextStep);
}
function renderComplete(){
  const totalQuestions=currentLesson.content?.questions?.length||0;
  const percentage=totalQuestions?Math.round((lessonScore/totalQuestions)*100):100;
  const alreadyCompleted=typeof isLessonCompleted==='function'
    ?isLessonCompleted(category.id,currentLesson.id)
    :false;
  learningStage.innerHTML=`
    <div class="learning-card completion-card">
      <div class="completion-icon">✓</div>
      <div class="learning-label">LESSON COMPLETE</div>
      <h1>${escapeHtml(currentLesson.title)}</h1>
      ${totalQuestions?`<p>You answered ${lessonScore} of ${totalQuestions} questions correctly (${percentage}%).</p>`:''}
      <div class="completion-xp">
        <span>✦</span>
        <strong>${alreadyCompleted?'Already completed':`+${currentLesson.xp} XP`}</strong>
      </div>
      <button class="learning-next" id="finishLessonButton">
        Back to Roadmap
      </button>
    </div>
  `;
  document.getElementById('finishLessonButton').addEventListener('click',finishLesson);
}
function nextStep(){
  if(currentStep<steps.length-1){
    currentStep++;
    renderStep();
  }
}
function finishLesson(){
  if(typeof completeLesson==='function'){
    const result=completeLesson(
      category.id,
      currentLesson.id,
      currentLesson.xp
    );
    console.log('CosmoKlub lesson completed:',result);
  }else{
    console.warn('progress.js is not loaded. Completion was not saved.');
  }
  window.location.href=`roadmap.html?category=${category.id}`;
}
function escapeHtml(value){
  const div=document.createElement('div');
  div.textContent=String(value??'');
  return div.innerHTML;
}
function escapeAttribute(value){
  return String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('"','&quot;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;');
}
function trimText(value,maxLength){
  const text=String(value??'').replace(/\s+/g,' ').trim();
  if(text.length<=maxLength)return text;
  return`${text.slice(0,maxLength).trim()}...`;
}
async function startLearning(){
  if(!startButton)return;
  startButton.disabled=true;
  startButton.textContent='Loading...';
  buildSteps();
  nasaImage=await fetchNasaImage();
  currentStep=0;
  lessonCover.classList.add('hidden');
  learningExperience.classList.remove('hidden');
  renderStep();
}
if(startButton){
  startButton.addEventListener('click',startLearning);
}else{
  console.error('Start Learning button #startLearning was not found.');
}
if(exitButton){
  exitButton.addEventListener('click',()=>{
    window.location.href=`roadmap.html?category=${category.id}`;
  });
}
