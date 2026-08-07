const params =
  new URLSearchParams(
    window.location.search
  );


const categoryId =
  params.get('category');


const lessonId =
  params.get('lesson');


const category =
  COURSE_DATA[categoryId];


if (!category) {

  window.location.href =
    'dashboard.html';

}


let currentLesson =
  null;


category.sections.forEach(
  section => {

    const found =
      section.lessons.find(
        lesson =>
          lesson.id === lessonId
      );


    if (found) {
      currentLesson =
        found;
    }

  }
);


if (!currentLesson) {

  window.location.href =
    `roadmap.html?category=${category.id}`;

}


document.title =
  `${currentLesson.title} | CosmoKlub`;


document.getElementById(
  'coverCategory'
).textContent =
  category.title;


document.getElementById(
  'lessonTitle'
).textContent =
  currentLesson.title;


document.getElementById(
  'lessonDescription'
).textContent =
  currentLesson.description;


document.getElementById(
  'lessonType'
).textContent =
  currentLesson.type === 'quiz'
    ? 'Quiz'
    : `${category.title} Lesson`;


document.getElementById(
  'detailTitle'
).textContent =
  currentLesson.title;


document.getElementById(
  'detailDescription'
).textContent =
  currentLesson.description;


document.getElementById(
  'lessonDuration'
).textContent =
  currentLesson.duration;


document.getElementById(
  'lessonXp'
).textContent =
  `${currentLesson.xp} XP`;


document.getElementById(
  'backRoadmap'
).addEventListener(
  'click',
  () => {

    window.location.href =
      `roadmap.html?category=${category.id}`;

  }
);


document.getElementById(
  'startLessonButton'
).addEventListener(
  'click',
  () => {

    console.log(
      'Starting lesson:',
      currentLesson
    );


    alert(
      `Starting: ${currentLesson.title}\n\n` +
      'The actual NASA learning content will be added next.'
    );

  }
);
