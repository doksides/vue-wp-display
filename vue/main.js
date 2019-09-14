var lodash = document.createElement('script');
lodash.async = true;
lodash.setAttribute('src', scriptsLocation.lodash);
document.head.appendChild(lodash);
var player_mixed_series = [{ name: '',  data: [] }];
var player_rank_series = [{ name: '',  data: [] }];
var player_radial_chart_series = []  ;
var player_radial_chart_config = {
  plotOptions: {
    radialBar: {
      hollow: { size: '50%', }
    },
  },
  colors: [],
  labels: [],
};

player_rank_chart_config = {
  chart: {
    height: 400,
    zoom: {
      enabled: false
    },
    shadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 1
    },
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth' // straight
  },
  title: {
    text: '',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Rounds'
    }
  },
  yaxis: {
    title: {
      text: ''
    },
    min: null,
    max: null
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};
// import scrList from './pages/list.js';
// import tDetail from './pages/detail.js';
// import CateDetail from './pages/category.js';
// import Scoreboard from './pages/scoreboard.js';

Vue.filter('firstchar', function (value) {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase();
  });

  Vue.filter('lowercase', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.toLowerCase()
  })

  Vue.filter('addplus', function (value) {
    if (!value) return ''
    value = value.toString()
    var n = Math.floor(Number(value))
    if (n !== Infinity && String(n) === value && n > 0) {
      return '+' + value
    }
    return value
  })

  Vue.filter('pretty', function (value) {
    return JSON.stringify(JSON.parse(value), null, 2)
  })

  const routes = [
    {
      path: '/tourneys',
      name: 'TourneysList',
      component: scrList,
      meta: { title: 'NSF Tournaments - Results and Statistics' },
    },
    {
      path: '/tourneys/:slug',
      name: 'TourneyDetail',
      component: tDetail,
      meta: { title: 'Tournament Details' },
    },
    {
      path: '/tourney_detail/:event_slug',
      name: 'CateDetail',
      component: CateDetail,
      props: true,
      meta: { title: 'Results and Statistics' },
    },
    // {
    //   path: '/tourneys/:event_slug/board',
    //   name: 'Scoreboard',
    //   component: Scoreboard,
    //   props: true,
    //   meta: { title: 'Scoreboard' },
    // },
  ];

const router = new VueRouter({
  mode: 'history',
  routes: routes, // short for `routes: routes`
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
new Vue({
  el: document.querySelector('#app'),
  router,
  store,

})


