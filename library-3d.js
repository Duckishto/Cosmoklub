(function(){
  'use strict';

  const canvas=document.getElementById('library-3d-canvas');
  const THREE=window.THREE;

  if(!canvas||!THREE){
    return;
  }

  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer=window.matchMedia('(pointer: coarse)');

  let isLibrary=false;
  let isVisible=!document.hidden;
  let frameId=null;
  let lastTime=performance.now();

  const pointer={x:0,y:0};
  const pointerTarget={x:0,y:0};

  const renderer=new THREE.WebGLRenderer({
    canvas,
    alpha:true,
    antialias:!coarsePointer.matches,
    powerPreference:'high-performance'
  });

  renderer.setClearColor(0x000000,0);
  renderer.outputEncoding=THREE.sRGBEncoding;

  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x050410,.026);

  const camera=new THREE.PerspectiveCamera(48,1,.1,150);
  camera.position.set(0,0,15);

  const world=new THREE.Group();
  scene.add(world);

  function makeStarField(){
    const mobile=window.innerWidth<720;
    const count=mobile?650:1500;
    const positions=new Float32Array(count*3);
    const colors=new Float32Array(count*3);
    const cool=new THREE.Color(0x7dd3fc);
    const warm=new THREE.Color(0xd8b4fe);
    const color=new THREE.Color();

    for(let i=0;i<count;i+=1){
      const radius=11+Math.random()*45;
      const theta=Math.random()*Math.PI*2;
      const phi=Math.acos(2*Math.random()-1);
      const index=i*3;

      positions[index]=radius*Math.sin(phi)*Math.cos(theta);
      positions[index+1]=radius*Math.cos(phi)*.68;
      positions[index+2]=radius*Math.sin(phi)*Math.sin(theta)-12;

      color.copy(cool).lerp(warm,Math.random());
      const brightness=.45+Math.random()*.55;
      colors[index]=color.r*brightness;
      colors[index+1]=color.g*brightness;
      colors[index+2]=color.b*brightness;
    }

    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));

    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size:mobile?.045:.035,
        transparent:true,
        opacity:.8,
        depthWrite:false,
        vertexColors:true,
        blending:THREE.AdditiveBlending
      })
    );
  }

  const stars=makeStarField();
  world.add(stars);

  const planetSystem=new THREE.Group();
  planetSystem.position.set(5.7,.1,-1.8);
  world.add(planetSystem);

  const planetGlow=new THREE.Mesh(
    new THREE.SphereGeometry(3.15,48,48),
    new THREE.MeshBasicMaterial({
      color:0x5b21b6,
      transparent:true,
      opacity:.055,
      depthWrite:false,
      blending:THREE.AdditiveBlending
    })
  );
  planetGlow.scale.setScalar(1.18);
  planetSystem.add(planetGlow);

  const planet=new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.05,5),
    new THREE.MeshBasicMaterial({
      color:0xa78bfa,
      wireframe:true,
      transparent:true,
      opacity:.15,
      depthWrite:false,
      blending:THREE.AdditiveBlending
    })
  );
  planet.rotation.set(.18,0,-.12);
  planetSystem.add(planet);

  const planetCore=new THREE.Mesh(
    new THREE.SphereGeometry(2.92,40,40),
    new THREE.MeshPhongMaterial({
      color:0x12072a,
      emissive:0x21084c,
      emissiveIntensity:.52,
      transparent:true,
      opacity:.76,
      shininess:75
    })
  );
  planetSystem.add(planetCore);

  const ringMaterial=new THREE.MeshBasicMaterial({
    color:0xc084fc,
    transparent:true,
    opacity:.2,
    depthWrite:false,
    blending:THREE.AdditiveBlending
  });

  const outerRing=new THREE.Mesh(
    new THREE.TorusGeometry(4.55,.014,8,220),
    ringMaterial
  );
  outerRing.rotation.set(1.16,.18,.38);
  planetSystem.add(outerRing);

  const innerRing=new THREE.Mesh(
    new THREE.TorusGeometry(3.78,.008,8,180),
    ringMaterial.clone()
  );
  innerRing.material.opacity=.11;
  innerRing.rotation.set(.88,-.3,-.35);
  planetSystem.add(innerRing);

  const orbitDots=new THREE.Group();
  const dotGeometry=new THREE.SphereGeometry(.055,8,8);
  const dotMaterial=new THREE.MeshBasicMaterial({
    color:0xe9d5ff,
    transparent:true,
    opacity:.8,
    blending:THREE.AdditiveBlending
  });

  for(let i=0;i<18;i+=1){
    const dot=new THREE.Mesh(dotGeometry,dotMaterial);
    const angle=(i/18)*Math.PI*2;
    const radius=4.2+(i%3)*.18;
    dot.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius*.32,Math.sin(angle)*1.05);
    dot.scale.setScalar(.55+Math.random()*.8);
    orbitDots.add(dot);
  }
  orbitDots.rotation.set(.55,0,.14);
  planetSystem.add(orbitDots);

  const violetLight=new THREE.PointLight(0x8b5cf6,2.4,24);
  violetLight.position.set(6,4,7);
  scene.add(violetLight);

  const blueLight=new THREE.PointLight(0x22d3ee,1.2,20);
  blueLight.position.set(-7,-2,5);
  scene.add(blueLight);

  const ambientLight=new THREE.AmbientLight(0x7c3aed,.55);
  scene.add(ambientLight);

  function resize(){
    const width=Math.max(1,canvas.clientWidth);
    const height=Math.max(1,canvas.clientHeight);
    const pixelRatio=Math.min(window.devicePixelRatio||1,coarsePointer.matches?1.25:1.6);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width,height,false);

    camera.aspect=width/height;
    camera.updateProjectionMatrix();

    if(width<720){
      camera.fov=56;
      planetSystem.position.set(3.9,-1.2,-3.4);
      planetSystem.scale.setScalar(.77);
    }else{
      camera.fov=48;
      planetSystem.position.set(5.7,.1,-1.8);
      planetSystem.scale.setScalar(1);
    }
    camera.updateProjectionMatrix();

    if(isLibrary){
      renderer.render(scene,camera);
    }
  }

  function currentTab(){
    return new URLSearchParams(window.location.search).get('tab')||'forum';
  }

  function syncActiveTab(){
    const nextIsLibrary=currentTab()==='library';

    if(nextIsLibrary===isLibrary){
      return;
    }

    isLibrary=nextIsLibrary;
    document.body.classList.toggle('library-3d-active',isLibrary);

    if(isLibrary){
      lastTime=performance.now();
      start();
    }else{
      stop();
    }
  }

  function animate(time){
    frameId=null;

    if(!isLibrary||!isVisible){
      return;
    }

    const delta=Math.min(.05,(time-lastTime)/1000);
    lastTime=time;

    pointer.x+=(pointerTarget.x-pointer.x)*.045;
    pointer.y+=(pointerTarget.y-pointer.y)*.045;

    camera.position.x=pointer.x*.55;
    camera.position.y=-pointer.y*.34;
    camera.lookAt(0,0,-2);

    world.rotation.y=pointer.x*.035;
    world.rotation.x=-pointer.y*.025;

    if(!reducedMotion.matches){
      stars.rotation.y+=delta*.014;
      stars.rotation.x+=delta*.003;
      planet.rotation.y+=delta*.055;
      planet.rotation.x+=delta*.012;
      outerRing.rotation.z+=delta*.03;
      innerRing.rotation.z-=delta*.022;
      orbitDots.rotation.z+=delta*.075;
      planetSystem.position.y=(window.innerWidth<720?-1.2:.1)+Math.sin(time*.00045)*.11;
    }

    renderer.render(scene,camera);
    frameId=requestAnimationFrame(animate);
  }

  function start(){
    if(frameId===null&&isLibrary&&isVisible){
      frameId=requestAnimationFrame(animate);
    }
  }

  function stop(){
    if(frameId!==null){
      cancelAnimationFrame(frameId);
      frameId=null;
    }
  }

  function handlePointer(event){
    if(!isLibrary||coarsePointer.matches){
      return;
    }

    pointerTarget.x=(event.clientX/window.innerWidth)*2-1;
    pointerTarget.y=(event.clientY/window.innerHeight)*2-1;
  }

  function handleVisibility(){
    isVisible=!document.hidden;
    if(isVisible){
      lastTime=performance.now();
      start();
    }else{
      stop();
    }
  }

  ['pushState','replaceState'].forEach(method=>{
    const original=window.history[method];
    window.history[method]=function(){
      const result=original.apply(this,arguments);
      window.dispatchEvent(new Event('cosmoklub:navigation'));
      return result;
    };
  });

  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',handlePointer,{passive:true});
  window.addEventListener('popstate',syncActiveTab);
  window.addEventListener('cosmoklub:navigation',syncActiveTab);
  document.addEventListener('visibilitychange',handleVisibility);

  resize();
  syncActiveTab();
})();
