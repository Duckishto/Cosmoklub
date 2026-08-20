(function(){
  'use strict';

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const finePointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  );

  function addRevealGroups(){
    const groups = [
      '.uc-band h2',
      '.uc-photo-grid .uc-photo',
      '.uc-phototwos-grid .uc-phototwos',
      '.uc-tool-grid .uc-tool',
      '.uc-panels .uc-panel',
      '.faq-list .faq-item',
      '.site-footer'
    ];

    groups.forEach(selector => {
      const nodes = [...document.querySelectorAll(selector)];

      nodes.forEach((node, index) => {
        node.classList.add('forum-reveal');

        node.style.setProperty(
          '--forum-delay',
          `${Math.min(index, 6) * 80}ms`
        );
      });
    });
  }

  function startRevealObserver(){
    const nodes = [
      ...document.querySelectorAll('.forum-reveal')
    ];

    if(
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    ){
      nodes.forEach(node => {
        node.classList.add('is-visible');
      });

      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if(!entry.isIntersecting){
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -7% 0px'
      }
    );

    nodes.forEach(node => {
      observer.observe(node);
    });
  }

  function attachTilt(node){
    let frame = null;
    let nextX = 0;
    let nextY = 0;

    function render(){
      frame = null;

      node.style.setProperty(
        '--forum-tilt-x',
        `${nextY * -4.2}deg`
      );

      node.style.setProperty(
        '--forum-tilt-y',
        `${nextX * 5.2}deg`
      );
    }

    function move(event){
      const rect = node.getBoundingClientRect();

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      nextX = ((localX / rect.width) - 0.5) * 2;
      nextY = ((localY / rect.height) - 0.5) * 2;

      node.style.setProperty(
        '--forum-light-x',
        `${localX}px`
      );

      node.style.setProperty(
        '--forum-light-y',
        `${localY}px`
      );

      node.classList.add('forum-tilting');

      if(frame === null){
        frame = requestAnimationFrame(render);
      }
    }

    function reset(){
      nextX = 0;
      nextY = 0;

      node.classList.remove('forum-tilting');

      node.style.setProperty(
        '--forum-tilt-x',
        '0deg'
      );

      node.style.setProperty(
        '--forum-tilt-y',
        '0deg'
      );
    }

    node.addEventListener(
      'pointermove',
      move,
      { passive: true }
    );

    node.addEventListener(
      'pointerleave',
      reset,
      { passive: true }
    );

    node.addEventListener(
      'pointercancel',
      reset,
      { passive: true }
    );
  }

  function startInteractiveCards(){
    if(
      reducedMotion.matches ||
      !finePointer.matches
    ){
      return;
    }

    document
      .querySelectorAll(
        '.uc-photo, .uc-phototwos, .uc-tool'
      )
      .forEach(attachTilt);
  }

  function startHeroParallax(){
    const hero = document.querySelector('.uc-hero');

    if(
      !hero ||
      reducedMotion.matches ||
      !finePointer.matches
    ){
      return;
    }

    let frame = null;
    let x = 50;
    let y = 50;

    function render(){
      frame = null;

      hero.style.setProperty(
        '--forum-hero-x',
        `${x}%`
      );

      hero.style.setProperty(
        '--forum-hero-y',
        `${y}%`
      );
    }

    hero.addEventListener(
      'pointermove',
      event => {
        const rect = hero.getBoundingClientRect();

        x =
          48 +
          (
            (event.clientX - rect.left) /
            rect.width
          ) * 4;

        y =
          48 +
          (
            (event.clientY - rect.top) /
            rect.height
          ) * 4;

        if(frame === null){
          frame = requestAnimationFrame(render);
        }
      },
      { passive: true }
    );

    hero.addEventListener(
      'pointerleave',
      () => {
        x = 50;
        y = 50;

        if(frame === null){
          frame = requestAnimationFrame(render);
        }
      },
      { passive: true }
    );
  }

  function init(){
    if(
      document.body.classList.contains(
        'forum-motion-ready'
      )
    ){
      return;
    }

    document.body.classList.add(
      'forum-motion-ready'
    );

    addRevealGroups();
    startRevealObserver();
    startInteractiveCards();
    startHeroParallax();
  }

  if(document.readyState === 'loading'){
    document.addEventListener(
      'DOMContentLoaded',
      () => requestAnimationFrame(init),
      { once: true }
    );
  }else{
    requestAnimationFrame(init);
  }
})();
