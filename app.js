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

function updateTabUrl(tab,replace=false){
  const url=new URL(window.location.href);
  url.searchParams.set('tab',tab);

  const method=replace?'replaceState':'pushState';

  window.history[method](
    {tab},
    '',
    url
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

  methods:{
    setTab(tab){
      if(!VALID_TABS.includes(tab))return;
      if(this.activeTab===tab)return;

      this.activeTab=tab;
      updateTabUrl(tab);
    },

    handlePopState(){
      this.activeTab=getTabFromUrl();
    }
  },

  mounted(){
    if(!new URLSearchParams(window.location.search).has('tab')){
      updateTabUrl(this.activeTab,true);
    }

    window.addEventListener(
      'popstate',
      this.handlePopState
    );

    window.CosmoKlub.initStarfield();
  },

  beforeUnmount(){
    window.removeEventListener(
      'popstate',
      this.handlePopState
    );
  }
}).mount('#app');
