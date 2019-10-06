//'use strict';

// import { Header } from './pages/header.js';
// import {Footer} from './pages/footer.js';

var lodash = document.createElement('script');
lodash.async = true;
lodash.setAttribute('src', scriptsLocation.lodash);
document.head.appendChild(lodash);

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
  if (!value) return '';
  value = value.toString();
  return value.toLowerCase();
});

Vue.filter('addplus', function (value) {
  if (!value) return '';
  value = value.toString();
  var n = Math.floor(Number(value));
  if (n !== Infinity && String(n) === value && n > 0) {
    return '+' + value;
  }
  return value;
});

Vue.filter('pretty', function (value) {
  return JSON.stringify(JSON.parse(value), null, 2);
});

var routes = [{
  path: '/tournaments',
  name: 'TourneysList',
  component: scrList,
  meta: { title: 'NSF Tournaments - Results and Statistics' }
}, {
  path: '/tournaments/:slug',
  name: 'TourneyDetail',
  component: tDetail,
  meta: { title: 'Tournament Details' }
}, {
  path: '/tournament/:event_slug',
  name: 'CateDetail',
  component: CateDetail,
  props: true,
  meta: { title: 'Results and Statistics' }
}];

var router = new VueRouter({
  mode: 'history',
  routes: routes // short for `routes: routes`
});
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title;
  next();
});

new Vue({
  el: document.querySelector('#app'),
  router: router,
  store: store
});