const params=new URLSearchParams(window.location.search);
const categoryId=params.get('category');
const lessonId=params.get('lesson');
const category=COURSE_DATA[categoryId];

if(!category){
  window.location.replace('dashboard.html');
  throw new Error('Invalid category.');
}

let currentLesson=null;

for(const section of category.sections){
  const found=section.lessons.find(lesson=>lesson.id===lessonId);
  if(found){
    currentLesson=found;
    break;
  }
}

if(!currentLesson){
  window.location.replace(`roadmap.html?category=${category.id}`);
  throw new Error('Invalid lesson.');
}

document.title=`${currentLesson.title} | CosmoKlub`;
document.getElementById('coverCategory').textContent=category.title;
document.getElementById('lessonTitle').textContent=currentLesson.title;
document.getElementById('lessonDescription').textContent=currentLesson.description;
document.getElementById('lessonType').textContent=currentLesson.type==='quiz'?'Quiz':`${category.title} Lesson`;
document.getElementById('detailTitle').textContent=currentLesson.title;
document.getElementById('detailDescription').textContent=currentLesson.description;
document.getElementById('lessonDuration').textContent=currentLesson.duration;
document.getElementById('lessonXp').textContent=`${currentLesson.xp} XP`;

document.getElementById('backRoadmap').addEventListener('click',()=>{
  window.location.href=`roadmap.html?category=${category.id}`;
});

const lessonCover=document.getElementById('lessonCover');
const learningExperience=document.getElementById('learningExperience');
const learningStage=document.getElementById('learningStage');
const progressFill=document.getElementById('learningProgressFill');
const progressText=document.getElementById('learningProgressText');

let learningSteps=[];
let currentStep=0;
let selectedAnswer=null;
let questionAnswered=false;

document.getElementById('startLessonButton').addEventListener('click',startLearning);

document.getElementById('exitLesson').addEventListener('click',()=>{
  if(confirm('Leave this lesson and return to the roadmap?')){
    window.location.href=`roadmap.html?category=${category.id}`;
  }
});

async function startLearning(){
  if(!currentLesson.content){
    alert('This lesson does not have learning content yet.');
    return;
  }

  lessonCover.classList.add('hidden');
  learningExperience.classList.remove('hidden');

  learningStage.innerHTML=`
    <div class="learning-panel">
      <div class="learning-panel-body">
        <div class="learning-kicker">NASA</div>
        <h2>Preparing your lesson...</h2>
        <p>Loading official NASA imagery and learning content.</p>
      </div>
    </div>
  `;

  const nasaImage=await fetchNasaImage(currentLesson.nasaSearch||currentLesson.title);

  learningSteps=buildLearningSteps(currentLesson,nasaImage);
  currentStep=0;
  renderCurrentStep();
}

function buildLearningSteps(lesson,nasaImage){
  const steps=[];

  steps.push({
    type:'intro',
    title:lesson.title,
    text:lesson.content.intro
  });

  if(nasaImage){
    steps.push({
      type:'image',
      image:nasaImage
    });
  }

  lesson.content.sections?.forEach(section=>{
    steps.push({
      type:'content',
      title:section.title,
      text:section.text
    });
  });

  lesson.content.activities?.forEach(activity=>{
    steps.push({
      type:'activity',
      activity
    });
  });

  lesson.content.questions?.forEach(question=>{
    steps.push({
      type:'question',
      question
    });
  });

  if(lesson.content.keyFacts){
    steps.push({
      type:'facts',
      facts:lesson.content.keyFacts
    });
  }

  steps.push({
    type:'complete'
  });

  return steps;
}

function renderCurrentStep(){
  const step=learningSteps[currentStep];

  selectedAnswer=null;
  questionAnswered=false;
  updateProgress();

  if(step.type==='intro'){
    learningStage.innerHTML=`
      <div class="learning-panel">
        <div class="learning-panel-body">
          <div class="learning-kicker">${escapeHtml(category.title)}</div>
          <h2>${escapeHtml(step.title)}</h2>
          <p>${escapeHtml(step.text)}</p>
          <div class="learning-actions">
            <button class="learning-continue" id="continueButton">Continue</button>
          </div>
        </div>
      </div>
    `;
    bindContinue();
    return;
  }

  if(step.type==='image'){
    learningStage.innerHTML=`
      <div class="learning-panel">
        <div class="nasa-image-wrap">
          <img class="nasa-image" src="${escapeAttribute(step.image.url)}" alt="${escapeAttribute(step.image.title)}">
          <div class="nasa-credit">NASA Image and Video Library • ${escapeHtml(step.image.title)}</div>
        </div>
        <div class="learning-panel-body">
          <div class="learning-kicker">NASA Observation</div>
          <h2>${escapeHtml(step.image.title)}</h2>
          <p>${escapeHtml(step.image.description)}</p>
          <div class="learning-actions">
            <button class="learning-continue" id="continueButton">Continue</button>
          </div>
        </div>
      </div>
    `;
    bindContinue();
    return;
  }

  if(step.type==='content'){
    learningStage.innerHTML=`
      <div class="learning-panel">
        <div class="learning-panel-body">
          <div class="learning-kicker">Learn</div>
          <h2>${escapeHtml(step.title)}</h2>
          <p>${escapeHtml(step.text)}</p>
          <div class="learning-actions">
            <button class="learning-continue" id="continueButton">Continue</button>
          </div>
        </div>
      </div>
    `;
    bindContinue();
    return;
  }

  if(step.type==='activity'){
    if(step.activity.type==='ordering'){
      renderOrderingActivity(step.activity);
    }
    return;
  }

  if(step.type==='question'){
    renderQuestion(step.question);
    return;
  }

  if(step.type==='facts'){
    learningStage.innerHTML=`
      <div class="learning-panel">
        <div class="learning-panel-body">
          <div class="learning-kicker">Key Facts</div>
          <h2>What you learned</h2>
          <div class="key-facts">
            ${step.facts.map(fact=>`
              <div class="key-fact">
                <span>✦</span>
                <span>${escapeHtml(fact)}</span>
              </div>
            `).join('')}
          </div>
          <div class="learning-actions">
            <button class="learning-continue" id="continueButton">Finish Lesson</button>
          </div>
        </div>
      </div>
    `;
    bindContinue();
    return;
  }

  if(step.type==='complete'){
    learningStage.innerHTML=`
      <div class="learning-panel lesson-complete">
        <div class="complete-icon">★</div>
        <h2>Lesson Complete!</h2>
        <p>You completed <strong>${escapeHtml(currentLesson.title)}</strong>.</p>
        <div class="complete-xp">+${currentLesson.xp} XP</div>
        <div class="learning-actions" style="justify-content:center;">
          <button class="learning-continue" id="finishButton">Return to Roadmap</button>
        </div>
      </div>
    `;

    document.getElementById('finishButton').addEventListener('click',finishLesson);
  }
}

function renderQuestion(question){
  learningStage.innerHTML=`
    <div class="learning-panel">
      <div class="learning-panel-body">
        <div class="learning-kicker">Checkpoint</div>
        <h2>${escapeHtml(question.question)}</h2>
        <div class="answer-list">
          ${question.answers.map((answer,index)=>`
            <button class="answer-option" data-index="${index}">
              ${escapeHtml(answer)}
            </button>
          `).join('')}
        </div>
        <div id="answerFeedback"></div>
        <div class="learning-actions">
          <button class="learning-continue" id="checkButton" disabled>Check Answer</button>
        </div>
      </div>
    </div>
  `;

  const answers=document.querySelectorAll('.answer-option');
  const checkButton=document.getElementById('checkButton');

  answers.forEach(button=>{
    button.addEventListener('click',()=>{
      if(questionAnswered)return;

      answers.forEach(answer=>answer.classList.remove('selected'));
      button.classList.add('selected');
      selectedAnswer=Number(button.dataset.index);
      checkButton.disabled=false;
    });
  });

  checkButton.addEventListener('click',()=>{
    if(selectedAnswer===null)return;

    if(!questionAnswered){
      questionAnswered=true;

      const correct=selectedAnswer===question.correctAnswer;

      answers.forEach((button,index)=>{
        button.disabled=true;

        if(index===question.correctAnswer){
          button.classList.add('correct');
        }

        if(index===selectedAnswer&&!correct){
          button.classList.add('incorrect');
        }
      });

      document.getElementById('answerFeedback').innerHTML=`
        <div class="answer-feedback">
          <strong>${correct?'Correct!':'Not quite.'}</strong><br>
          ${escapeHtml(question.explanation)}
        </div>
      `;

      checkButton.textContent='Continue';
      return;
    }

    nextStep();
  });
}

function renderOrderingActivity(activity){
  const shuffledItems=shuffleArray(
    activity.items.map((item,index)=>({
      text:item,
      correctIndex:index
    }))
  );

  learningStage.innerHTML=`
    <div class="learning-panel">
      <div class="learning-panel-body">
        <div class="learning-kicker">Interactive Activity</div>
        <h2>${escapeHtml(activity.title)}</h2>
        <p>${escapeHtml(activity.question)}</p>
        <div class="ordering-help">Use ↑ and ↓ to arrange the stages from first to last.</div>
        <div class="ordering-list" id="orderingList">
          ${shuffledItems.map((item,index)=>`
            <div class="ordering-item" data-correct-index="${item.correctIndex}">
              <div class="ordering-number">${index+1}</div>
              <div class="ordering-text">${escapeHtml(item.text)}</div>
              <div class="ordering-controls">
                <button class="ordering-button ordering-up" title="Move up">↑</button>
                <button class="ordering-button ordering-down" title="Move down">↓</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div id="orderingFeedback"></div>
        <div class="learning-actions">
          <button class="learning-continue" id="checkOrderButton">Check Order</button>
        </div>
      </div>
    </div>
  `;

  const list=document.getElementById('orderingList');
  const checkButton=document.getElementById('checkOrderButton');
  let checked=false;

  updateOrderingNumbers();

  list.addEventListener('click',event=>{
    if(checked)return;

    const button=event.target.closest('.ordering-button');
    if(!button)return;

    const item=button.closest('.ordering-item');

    if(button.classList.contains('ordering-up')){
      const previous=item.previousElementSibling;
      if(previous){
        list.insertBefore(item,previous);
      }
    }

    if(button.classList.contains('ordering-down')){
      const next=item.nextElementSibling;
      if(next){
        list.insertBefore(next,item);
      }
    }

    updateOrderingNumbers();
  });

  checkButton.addEventListener('click',()=>{
    if(checked){
      nextStep();
      return;
    }

    const items=[...list.querySelectorAll('.ordering-item')];
    const isCorrect=items.every((item,index)=>{
      return Number(item.dataset.correctIndex)===index;
    });

    if(isCorrect){
      checked=true;

      items.forEach(item=>{
        item.classList.add('ordering-correct');
      });

      document.getElementById('orderingFeedback').innerHTML=`
        <div class="answer-feedback">
          <strong>Correct!</strong><br>
          ${escapeHtml(activity.explanation)}
        </div>
      `;

      list.querySelectorAll('.ordering-button').forEach(button=>{
        button.disabled=true;
      });

      checkButton.textContent='Continue';
      return;
    }

    document.getElementById('orderingFeedback').innerHTML=`
      <div class="answer-feedback">
        <strong>Not quite.</strong><br>
        Some stages are still out of order. Try moving them again.
      </div>
    `;
  });
}

function updateOrderingNumbers(){
  document.querySelectorAll('.ordering-item').forEach((item,index)=>{
    const number=item.querySelector('.ordering-number');
    if(number){
      number.textContent=index+1;
    }
  });
}

function shuffleArray(array){
  const copy=[...array];

  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }

  const unchanged=copy.every((item,index)=>item.correctIndex===index);

  if(unchanged&&copy.length>1){
    [copy[0],copy[1]]=[copy[1],copy[0]];
  }

  return copy;
}

function bindContinue(){
  document.getElementById('continueButton').addEventListener('click',nextStep);
}

function nextStep(){
  if(currentStep>=learningSteps.length-1)return;

  currentStep++;
  renderCurrentStep();

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}

function updateProgress(){
  const total=learningSteps.length;
  const displayedStep=currentStep+1;
  const percentage=Math.round((displayedStep/total)*100);

  progressText.textContent=`${displayedStep} / ${total}`;
  progressFill.style.width=`${percentage}%`;
}

async function fetchNasaImage(query){
  try{
    const url=`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const response=await fetch(url);

    if(!response.ok){
      throw new Error(`NASA Image API returned HTTP ${response.status}`);
    }

    const data=await response.json();
    const items=data.collection?.items||[];

    if(items.length===0){
      return null;
    }

    const item=items.find(result=>result.links?.[0]?.href)||items[0];
    const metadata=item.data?.[0]||{};
    const imageUrl=item.links?.[0]?.href;

    if(!imageUrl){
      return null;
    }

    return{
      url:imageUrl,
      title:metadata.title||'NASA astronomy image',
      description:cleanNasaDescription(
        metadata.description||
        'Official astronomy imagery provided by NASA.'
      )
    };
  }catch(error){
    console.error('NASA image loading failed:',error);
    return null;
  }
}

function cleanNasaDescription(description){
  const text=String(description||'').replace(/\s+/g,' ').trim();

  if(text.length<=650){
    return text;
  }

  return text.slice(0,647).trim()+'...';
}

function finishLesson(){
  const result=completeLesson(
    category.id,
    currentLesson.id,
    ccurrentLesson.xp
  };

  console.log('CosmoKlub lesson completed:',result);
  window.location.href=`roadmap.html?category=${category.id}`;
}

function escapeHtml(value){
  const div=document.createElement('div');
  div.textContent=String(value??'');
  return div.innerHTML;
}

function escapeAttribute(value){
  return escapeHtml(value).replace(/"/g,'&quot;');
}
