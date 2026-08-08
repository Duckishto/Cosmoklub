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
    /*
      If the dashboard was opened as:

      /dashboard

      change it to:

      /dashboard?tab=forum

      without reloading the page.
    */
    const params=new URLSearchParams(
      window.location.search
    );

    if(!VALID_TABS.includes(params.get('tab'))){
      setUrlTab(
        this.activeTab,
        true
      );
    }

    /*
      Browser Back / Forward support.
    */
    window.addEventListener(
      'popstate',
      this.handlePopState
    );

    /*
      Existing CosmoKlub animated starfield.
    */
    window.CosmoKlub.initStarfield();
  },

  beforeUnmount(){
    window.removeEventListener(
      'popstate',
      this.handlePopState
    );
  }
}).mount('#app');
