const params =
  new URLSearchParams(
    window.location.search
  );

const categoryId =
  params.get('category') || 'stars';

const category =
  COURSE_DATA[categoryId];


if (!category) {
  window.location.href =
    'dashboard.html';
}


document.title =
  `${category.title} Roadmap | CosmoKlub`;


document.getElementById(
  'categoryIcon'
).textContent =
  category.icon;


document.getElementById(
  'categoryMeta'
).textContent =
  `${category.rank} • LEVEL ${category.level}`;


document.getElementById(
  'categoryTitle'
).textContent =
  category.title;


document.getElementById(
  'categoryDescription'
).textContent =
  category.description;


const roadmapContainer =
  document.getElementById(
    'roadmapContainer'
  );


category.sections.forEach(
  (section, sectionIndex) => {

    const sectionElement =
      document.createElement(
        'section'
      );

    sectionElement.className =
      'course-section';


    sectionElement.innerHTML = `
      <div class="section-banner">

        <div class="section-number">
          SECTION ${sectionIndex + 1}
        </div>

        <h2>
          ${section.title}
        </h2>

        <p>
          ${section.subtitle}
        </p>

      </div>

      <div class="path"></div>
    `;


    const path =
      sectionElement.querySelector(
        '.path'
      );


    section.lessons.forEach(
      (lesson, index) => {

        const item =
          document.createElement(
            'div'
          );


        item.className =
          `path-item path-position-${index % 6}`;


        if (!lesson.unlocked) {
          item.classList.add(
            'locked'
          );
        }


        if (lesson.completed) {
          item.classList.add(
            'completed'
          );
        }


        if (
          lesson.type === 'quiz'
        ) {
          item.classList.add(
            'quiz'
          );
        }


        let symbol = '★';


        if (lesson.completed) {
          symbol = '✓';
        }

        else if (!lesson.unlocked) {
          symbol = '🔒';
        }

        else if (
          lesson.type === 'quiz'
        ) {
          symbol = '🏆';
        }


        item.innerHTML = `
          <button
            class="path-node"
            ${lesson.unlocked ? '' : 'disabled'}
          >
            ${symbol}
          </button>

          <div class="path-info">

            <div class="path-title">
              ${lesson.title}
            </div>

            <div class="path-meta">
              ${lesson.duration}
              •
              ${lesson.xp} XP
            </div>

          </div>
        `;


        const button =
          item.querySelector(
            '.path-node'
          );


        if (lesson.unlocked) {

          button.addEventListener(
            'click',
            () => {

              const url =
                new URL(
                  'lesson.html',
                  window.location.href
                );


              url.searchParams.set(
                'category',
                category.id
              );


              url.searchParams.set(
                'lesson',
                lesson.id
              );


              window.location.href =
                url.toString();

            }
          );

        }


        path.appendChild(item);

      }
    );


    roadmapContainer.appendChild(
      sectionElement
    );

  }
);
