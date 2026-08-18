const { createApp } = Vue;

window.CosmoKlub = window.CosmoKlub || {};

const VALID_TABS=[
  'forum',
  'library',
  'planetarium',
  'chat'
];

function getTabFromUrl(){
  const params=new URLSearchParams(window.location.search);
  const tab=params.get('tab');

  return VALID_TABS.includes(tab)
    ?tab
    :'forum';
}

function setUrlTab(tab,replace=false){
  const url=new URL(window.location.href);

  if(url.searchParams.get('tab')===tab){
    return;
  }

  url.searchParams.set('tab',tab);

  if(replace){
    window.history.replaceState(
      {tab},
      '',
      url
    );
  }else{
    window.history.pushState(
      {tab},
      '',
      url
    );
  }
}

/* =========================================================
   LIQUID GLASS FAB
   ========================================================= */

function attachLiquidFab(node){
  if(!node){
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
    currentStretchX+=
      (targetStretchX-currentStretchX)*0.15;

    currentStretchY+=
      (targetStretchY-currentStretchY)*0.15;

    currentRotate+=
      (targetRotate-currentRotate)*0.15;

    node.style.setProperty(
      '--fab-scale-x',
      currentStretchX.toFixed(4)
    );

    node.style.setProperty(
      '--fab-scale-y',
      currentStretchY.toFixed(4)
    );

    node.style.setProperty(
      '--fab-rotate',
      `${currentRotate.toFixed(2)}deg`
    );

    const moving=
      Math.abs(
        currentStretchX-targetStretchX
      )>0.001||
      Math.abs(
        currentStretchY-targetStretchY
      )>0.001||
      Math.abs(
        currentRotate-targetRotate
      )>0.05;

    if(moving){
      animationFrame=
        requestAnimationFrame(
          animateLiquid
        );
    }else{
      animationFrame=null;
    }
  }

  function startAnimation(){
    if(!animationFrame){
      animationFrame=
        requestAnimationFrame(
          animateLiquid
        );
    }
  }

  function handlePointerMove(event){
    const rect=
      node.getBoundingClientRect();

    const localX=
      event.clientX-rect.left;

    const localY=
      event.clientY-rect.top;

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

    const normalizedX=
      (percentX-50)/50;

    const normalizedY=
      (percentY-50)/50;

    node.style.setProperty(
      '--fab-glass-x',
      `${percentX}%`
    );

    node.style.setProperty(
      '--fab-glass-y',
      `${percentY}%`
    );

    node.style.setProperty(
      '--fab-liquid-x',
      normalizedX.toFixed(3)
    );

    node.style.setProperty(
      '--fab-liquid-y',
      normalizedY.toFixed(3)
    );

    node.style.setProperty(
      '--fab-highlight-x',
      `${50+normalizedX*21}%`
    );

    node.style.setProperty(
      '--fab-highlight-y',
      `${32+normalizedY*18}%`
    );

    const now=performance.now();

    const deltaTime=Math.max(
      8,
      now-previousTime
    );

    if(
      previousX!==null&&
      previousY!==null
    ){
      const velocityX=
        (event.clientX-previousX)/
        deltaTime;

      const velocityY=
        (event.clientY-previousY)/
        deltaTime;

      const speed=Math.min(
        1,
        Math.hypot(
          velocityX,
          velocityY
        )*.9
      );

      targetStretchX=
        1+
        Math.min(
          .12,
          Math.abs(
            velocityX
          )*.085
        );

      targetStretchY=
        1+
        Math.min(
          .12,
          Math.abs(
            velocityY
          )*.085
        );

      if(
        Math.abs(velocityX)>
        Math.abs(velocityY)
      ){
        targetStretchY=
          1-
          Math.min(
            .055,
            speed*.045
          );
      }else{
        targetStretchX=
          1-
          Math.min(
            .055,
            speed*.045
          );
      }

      targetRotate=Math.max(
        -6,
        Math.min(
          6,
          velocityX*5
        )
      );
    }

    previousX=event.clientX;
    previousY=event.clientY;
    previousTime=now;

    node.classList.add(
      'liquid-fab-hover'
    );

    startAnimation();
  }

  function resetLiquid(){
    previousX=null;
    previousY=null;

    targetStretchX=1;
    targetStretchY=1;
    targetRotate=0;

    node.style.setProperty(
      '--fab-glass-x',
      '50%'
    );

    node.style.setProperty(
      '--fab-glass-y',
      '25%'
    );

    node.style.setProperty(
      '--fab-liquid-x',
      '0'
    );

    node.style.setProperty(
      '--fab-liquid-y',
      '0'
    );

    node.style.setProperty(
      '--fab-highlight-x',
      '50%'
    );

    node.style.setProperty(
      '--fab-highlight-y',
      '28%'
    );

    node.classList.remove(
      'liquid-fab-hover'
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
        'liquid-fab-pressed'
      );
    }
  );

  node.addEventListener(
    'pointerup',
    ()=>{
      node.classList.remove(
        'liquid-fab-pressed'
      );
    }
  );

  node.addEventListener(
    'pointerleave',
    ()=>{
      node.classList.remove(
        'liquid-fab-pressed'
      );
    }
  );
}

createApp({
  data(){
    return{
      activeTab:getTabFromUrl(),

      tabComponents:{
        forum:Forum,
        library:Library,
        chat:Chat,
        planetarium:Planetarium
      }
    };
  },

  watch:{
    activeTab(newTab){
      if(!VALID_TABS.includes(newTab)){
        this.activeTab='forum';
        return;
      }

      setUrlTab(newTab);
    }
  },

  methods:{
    setTab(tab){
      if(!VALID_TABS.includes(tab)){
        return;
      }

      this.activeTab=tab;
    },

    handlePopState(){
      const tab=getTabFromUrl();

      if(this.activeTab!==tab){
        this.activeTab=tab;
      }
    }
  },

  mounted(){
    const params=
      new URLSearchParams(
        window.location.search
      );

    if(
      !VALID_TABS.includes(
        params.get('tab')
      )
    ){
      setUrlTab(
        this.activeTab,
        true
      );
    }

    window.addEventListener(
      'popstate',
      this.handlePopState
    );

    window.CosmoKlub.initStarfield();

    /*
      Liquid Glass +
      button.
    */
    this.$nextTick(()=>{
      const fab=
        document.querySelector(
          '.nav-fab'
        );

      attachLiquidFab(fab);
    });
  },

  beforeUnmount(){
    window.removeEventListener(
      'popstate',
      this.handlePopState
    );
  }
}).mount('#app');
