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
const roadmapBack=document.getElementById('roadmapBack');
const previousButton=document.getElementById('previousStep');
const forwardButton=document.getElementById('forwardStep');
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
let nasaImage=null;
let nasaLoading=false;
let questionStates={};
let activityStates={};

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

  if(
    Array.isArray(currentLesson.content?.keyFacts)&&
    currentLesson.content.keyFacts.length
  ){
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
  if(!currentLesson.nasaSearch||nasaLoading)return null;

  nasaLoading=true;

  try{
    const url=`https://images-api.nasa.gov/search?q=${encodeURIComponent(currentLesson.nasaSearch)}&media_type=image`;
    const response=await fetch(url);

    if(!response.ok){
      throw new Error(`NASA request failed: ${response.status}`);
    }

    const data=await response.json();
    const items=data.collection?.items||[];
    const usableItem=items.find(item=>item.links?.[0]?.href);

    if(!usableItem){
      nasaLoading=false;
      return null;
    }

    nasaImage={
      src:usableItem.links[0].href,
      title:usableItem.data?.[0]?.title||currentLesson.title,
      description:usableItem.data?.[0]?.description||''
    };

    nasaLoading=false;

    if(steps[currentStep]?.type==='image'){
      renderStep();
    }

    return nasaImage;
  }catch(error){
    console.warn('NASA image could not be loaded:',error);
    nasaLoading=false;
    nasaImage=null;
    return null;
  }
}

function updateProgress(){
  if(!steps.length)return;

  const displayStep=Math.min(currentStep+1,steps.length);
  const percentage=(displayStep/steps.length)*100;

  if(progressFill){
    progressFill.style.width=`${percentage}%`;
  }

  if(progressText){
    progressText.textContent=`${displayStep} / ${steps.length}`;
  }
}

function canAdvanceFromStep(step){
  if(!step)return false;

  if(
    step.type==='intro'||
    step.type==='image'||
    step.type==='content'||
    step.type==='facts'
  ){
    return true;
  }

  if(step.type==='question'){
    return Boolean(
      questionStates[step.question.id]&&
      Number.isInteger(questionStates[step.question.id].selected)
    );
  }

  if(step.type==='activity'){
    return Boolean(
      activityStates[step.activity.id]?.completed
    );
  }

  if(step.type==='complete'){
    return true;
  }

  return false;
}

function updateNavigation(){
  const step=steps[currentStep];

  if(previousButton){
    previousButton.disabled=currentStep===0;
  }

  if(!forwardButton)return;

  if(step?.type==='complete'){
    forwardButton.disabled=false;
    forwardButton.innerHTML=`
      <span>Roadmap</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    `;
    return;
  }

  forwardButton.innerHTML=`
    <span>Next</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  `;

  forwardButton.disabled=!canAdvanceFromStep(step);
}

function scrollLessonToTop(){
  const scrollContainer=document.querySelector('.lesson-scroll');

  if(scrollContainer){
    scrollContainer.scrollTo({
      top:0,
      behavior:'smooth'
    });
  }
}

function renderStep(){
  const step=steps[currentStep];

  if(!step)return;

  updateProgress();
  updateNavigation();

  if(step.type==='intro'){
    renderIntro(step);
  }else if(step.type==='image'){
    renderImage();
  }else if(step.type==='content'){
    renderContent(step);
  }else if(step.type==='activity'){
    renderActivity(step.activity);
  }else if(step.type==='question'){
    renderQuestion(step.question);
  }else if(step.type==='facts'){
    renderFacts(step.facts);
  }else if(step.type==='complete'){
    renderComplete();
  }

  updateNavigation();
  scrollLessonToTop();
}

function renderIntro(step){
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">${escapeHtml(category.title)}</div>
      <h1>${escapeHtml(step.title)}</h1>
      <p>${escapeHtml(step.text)}</p>
      <div class="step-hint">
        Use Previous and Next above to move through this lesson.
      </div>
    </div>
  `;
}

function renderImage(){
  if(!nasaImage){
    learningStage.innerHTML=`
      <div class="learning-card">
        <div class="nasa-label">NASA IMAGE</div>
        <div class="nasa-loading">
          <div class="nasa-loading-icon">✦</div>
          <h2>${escapeHtml(currentLesson.title)}</h2>
          <p>${nasaLoading?'Loading a relevant image from NASA...':'The NASA image could not be loaded. You can continue with the lesson.'}</p>
        </div>
      </div>
    `;
    return;
  }

  learningStage.innerHTML=`
    <div class="learning-card image-learning-card">
      <div class="nasa-label">NASA IMAGE</div>
      <img
        class="nasa-image"
        src="${escapeAttribute(nasaImage.src)}"
        alt="${escapeAttribute(nasaImage.title)}"
      >
      <h2>${escapeHtml(nasaImage.title)}</h2>
      <p>${escapeHtml(trimText(nasaImage.description,500))}</p>
    </div>
  `;
}

function renderContent(step){
  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">LEARN</div>
      <h2>${escapeHtml(step.title)}</h2>
      <p>${escapeHtml(step.text)}</p>
    </div>
  `;
}

function renderQuestion(question){
  const answers=question.answers||[];
  const saved=questionStates[question.id];

  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">
        ${currentLesson.type==='quiz'?'QUIZ':'CHECKPOINT'}
      </div>

      <h2>${escapeHtml(question.question)}</h2>

      <div class="answer-list">
        ${answers.map((answer,index)=>{
          let classes='answer-button';

          if(saved){
            if(index===question.correctAnswer){
              classes+=' answer-correct';
            }

            if(
              index===saved.selected&&
              index!==question.correctAnswer
            ){
              classes+=' answer-wrong';
            }

            if(index===saved.selected){
              classes+=' answer-selected';
            }
          }

          return`
            <button
              class="${classes}"
              data-answer="${index}"
              type="button"
            >
              ${escapeHtml(answer)}
            </button>
          `;
        }).join('')}
      </div>

      <div id="questionFeedback">
        ${saved?buildQuestionFeedback(question,saved):''}
      </div>

      ${saved?`
        <div class="answer-edit-note">
          You can select another answer to change your response.
        </div>
      `:''}
    </div>
  `;

  const buttons=[
    ...learningStage.querySelectorAll('.answer-button')
  ];

  buttons.forEach(button=>{
    button.addEventListener('click',()=>{
      const selected=Number(button.dataset.answer);
      handleAnswer(question,selected);
    });
  });
}

function buildQuestionFeedback(question,state){
  const correct=state.selected===question.correctAnswer;

  return`
    <div class="question-feedback ${correct?'feedback-correct':'feedback-wrong'}">
      <strong>${correct?'Correct!':'Not quite.'}</strong>
      <p>${escapeHtml(question.explanation||'')}</p>
    </div>
  `;
}

function handleAnswer(question,selected){
  questionStates[question.id]={
    selected,
    correct:selected===question.correctAnswer
  };

  renderQuestion(question);
  updateNavigation();
}

function renderActivity(activity){
  if(activity.type==='ordering'){
    renderOrdering(activity);
    return;
  }

  activityStates[activity.id]={
    completed:true
  };

  updateNavigation();

  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">ACTIVITY</div>
      <h2>${escapeHtml(activity.title||'Activity')}</h2>
      <p>Activity complete.</p>
    </div>
  `;
}

function shuffleArray(array){
  const copy=[...array];

  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }

  return copy;
}

function renderOrdering(activity){
  if(!activityStates[activity.id]){
    let shuffled=shuffleArray(activity.items);

    if(
      shuffled.every(
        (item,index)=>item===activity.items[index]
      )
    ){
      shuffled=[
        ...activity.items.slice(1),
        activity.items[0]
      ];
    }

    activityStates[activity.id]={
      items:shuffled,
      completed:false
    };
  }

  const state=activityStates[activity.id];

  learningStage.innerHTML=`
    <div class="learning-card">
      <div class="learning-label">ACTIVITY</div>
      <h2>${escapeHtml(activity.title)}</h2>
      <p>${escapeHtml(activity.question)}</p>

      <p class="ordering-help">
        Use the arrows to place the stages in the correct order.
      </p>

      <div class="ordering-list" id="orderingList"></div>

      <div id="orderingFeedback">
        ${state.completed?`
          <div class="question-feedback feedback-correct">
            <strong>Correct!</strong>
            <p>${escapeHtml(activity.explanation||'')}</p>
          </div>
        `:''}
      </div>

      <button
        class="learning-next activity-check-button"
        id="checkOrder"
        type="button"
        ${state.completed?'disabled':''}
      >
        ${state.completed?'Completed':'Check Order'}
      </button>
    </div>
  `;

  const list=document.getElementById('orderingList');

  function drawOrdering(){
    list.innerHTML='';

    state.items.forEach((item,index)=>{
      const row=document.createElement('div');

      row.className=
        `ordering-item${state.completed?' ordering-correct':''}`;

      row.innerHTML=`
        <div class="ordering-number">${index+1}</div>

        <div>${escapeHtml(item)}</div>

        <div class="ordering-controls">
          <button
            class="ordering-button move-up"
            data-index="${index}"
            type="button"
            ${index===0||state.completed?'disabled':''}
          >
            ↑
          </button>

          <button
            class="ordering-button move-down"
            data-index="${index}"
            type="button"
            ${index===state.items.length-1||state.completed?'disabled':''}
          >
            ↓
          </button>
        </div>
      `;

      list.appendChild(row);
    });

    list.querySelectorAll('.move-up').forEach(button=>{
      button.addEventListener('click',()=>{
        const index=Number(button.dataset.index);

        if(index<=0||state.completed)return;

        [
          state.items[index-1],
          state.items[index]
        ]=[
          state.items[index],
          state.items[index-1]
        ];

        drawOrdering();
      });
    });

    list.querySelectorAll('.move-down').forEach(button=>{
      button.addEventListener('click',()=>{
        const index=Number(button.dataset.index);

        if(
          index>=state.items.length-1||
          state.completed
        ){
          return;
        }

        [
          state.items[index+1],
          state.items[index]
        ]=[
          state.items[index],
          state.items[index+1]
        ];

        drawOrdering();
      });
    });
  }

  drawOrdering();

  const checkButton=document.getElementById('checkOrder');

  if(checkButton&&!state.completed){
    checkButton.addEventListener('click',()=>{
      const correct=state.items.every(
        (item,index)=>item===activity.items[index]
      );

      const feedback=document.getElementById('orderingFeedback');

      if(correct){
        state.completed=true;

        feedback.innerHTML=`
          <div class="question-feedback feedback-correct">
            <strong>Correct!</strong>
            <p>${escapeHtml(activity.explanation||'')}</p>
          </div>
        `;

        checkButton.textContent='Completed';
        checkButton.disabled=true;

        drawOrdering();
        updateNavigation();
      }else{
        feedback.innerHTML=`
          <div class="question-feedback feedback-wrong">
            <strong>Not quite.</strong>
            <p>Some stages are still out of order. Adjust them and try again.</p>
          </div>
        `;
      }
    });
  }
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

      <div class="step-hint">
        Review anything you want with Previous, then choose Next when you're ready to finish.
      </div>
    </div>
  `;
}

function calculateScore(){
  const questions=
    currentLesson.content?.questions||[];

  let answered=0;
  let correct=0;

  questions.forEach(question=>{
    const state=questionStates[question.id];

    if(!state)return;

    answered++;

    if(state.selected===question.correctAnswer){
      correct++;
    }
  });

  return{
    total:questions.length,
    answered,
    correct,
    percentage:questions.length
      ?Math.round((correct/questions.length)*100)
      :100
  };
}

function renderComplete(){
  const score=calculateScore();

  const alreadyCompleted=
    typeof isLessonCompleted==='function'
      ?isLessonCompleted(
        category.id,
        currentLesson.id
      )
      :false;

  learningStage.innerHTML=`
    <div class="learning-card completion-card">
      <div class="completion-icon">✓</div>

      <div class="learning-label">
        ${currentLesson.type==='quiz'?'QUIZ COMPLETE':'LESSON COMPLETE'}
      </div>

      <h1>${escapeHtml(currentLesson.title)}</h1>

      ${score.total?`
        <p>
          You answered
          <strong>${score.correct}</strong>
          of
          <strong>${score.total}</strong>
          questions correctly
          (${score.percentage}%).
        </p>
      `:''}

      <div class="completion-xp">
        <span>✦</span>
        <strong>
          ${alreadyCompleted
            ?'Already completed'
            :`+${currentLesson.xp} XP`}
        </strong>
      </div>

      <p class="completion-help">
        You can still use Previous to review or change your answers before returning to the Roadmap.
      </p>
    </div>
  `;
}

function previousStep(){
  if(currentStep<=0)return;

  currentStep--;
  renderStep();
}

function nextStep(){
  const step=steps[currentStep];

  if(!step)return;

  if(step.type==='complete'){
    finishLesson();
    return;
  }

  if(!canAdvanceFromStep(step)){
    return;
  }

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

    console.log(
      'CosmoKlub lesson completed:',
      result
    );
  }else{
    console.warn(
      'progress.js is not loaded. Completion was not saved.'
    );
  }

  window.location.href=
    `roadmap.html?category=${category.id}`;
}

function startLearning(){
  if(!startButton)return;

  buildSteps();

  currentStep=0;
  questionStates={};
  activityStates={};
  nasaImage=null;
  nasaLoading=false;

  lessonCover.classList.add('hidden');
  learningExperience.classList.remove('hidden');

  renderStep();

  fetchNasaImage();
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
  const text=String(value??'')
    .replace(/\s+/g,' ')
    .trim();

  if(text.length<=maxLength){
    return text;
  }

  return`${text.slice(0,maxLength).trim()}...`;
}

if(startButton){
  startButton.addEventListener(
    'click',
    startLearning
  );
}else{
  console.error(
    'Start Learning button #startLearning was not found.'
  );
}

if(roadmapBack){
  roadmapBack.addEventListener('click',()=>{
    window.location.href=
      `roadmap.html?category=${category.id}`;
  });
}

if(previousButton){
  previousButton.addEventListener(
    'click',
    previousStep
  );
}

if(forwardButton){
  forwardButton.addEventListener(
    'click',
    nextStep
  );
}
