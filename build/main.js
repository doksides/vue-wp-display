(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// var lodash = document.createElement('script');
// let scriptsLocation = {};
// lodash.async = true;
// lodash.setAttribute('src', scriptsLocation.lodash);
// document.head.appendChild(lodash);
var store, scrList, tDetail, CateDetail; // import store from './store';
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
  meta: {
    title: 'NSF Tournaments - Results and Statistics'
  }
}, {
  path: '/tournaments/:slug',
  name: 'TourneyDetail',
  component: tDetail,
  meta: {
    title: 'Tournament Details'
  }
}, {
  path: '/tournament/:event_slug',
  name: 'CateDetail',
  component: CateDetail,
  props: true,
  meta: {
    title: 'Results and Statistics'
  }
} // {
//   path: '/tourneys/:event_slug/board',
//   name: 'Scoreboard',
//   component: Scoreboard,
//   props: true,
//   meta: { title: 'Scoreboard' },
// },
];
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2dWUvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsRUFBNkIsVUFBN0IsQyxDQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRyxDQUFDLE1BQUosQ0FBVyxXQUFYLEVBQXdCLFVBQVUsS0FBVixFQUFpQjtBQUNyQyxNQUFJLENBQUMsS0FBTCxFQUFZLE9BQU8sRUFBUDtBQUNaLEVBQUEsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFOLEVBQVI7QUFDQSxTQUFPLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFnQixXQUFoQixFQUFQO0FBQ0QsQ0FKSDtBQU1FLEdBQUcsQ0FBQyxNQUFKLENBQVcsV0FBWCxFQUF3QixVQUFVLEtBQVYsRUFBaUI7QUFDdkMsTUFBSSxDQUFDLEtBQUwsRUFBWSxPQUFPLEVBQVA7QUFDWixFQUFBLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBTixFQUFSO0FBQ0EsU0FBTyxLQUFLLENBQUMsV0FBTixFQUFQO0FBQ0QsQ0FKRDtBQU1BLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBWCxFQUFzQixVQUFVLEtBQVYsRUFBaUI7QUFDckMsTUFBSSxDQUFDLEtBQUwsRUFBWSxPQUFPLEVBQVA7QUFDWixFQUFBLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBTixFQUFSO0FBQ0EsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFNLENBQUMsS0FBRCxDQUFqQixDQUFSOztBQUNBLE1BQUksQ0FBQyxLQUFLLFFBQU4sSUFBa0IsTUFBTSxDQUFDLENBQUQsQ0FBTixLQUFjLEtBQWhDLElBQXlDLENBQUMsR0FBRyxDQUFqRCxFQUFvRDtBQUNsRCxXQUFPLE1BQU0sS0FBYjtBQUNEOztBQUNELFNBQU8sS0FBUDtBQUNELENBUkQ7QUFVQSxHQUFHLENBQUMsTUFBSixDQUFXLFFBQVgsRUFBcUIsVUFBVSxLQUFWLEVBQWlCO0FBQ3BDLFNBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBZixFQUFrQyxJQUFsQyxFQUF3QyxDQUF4QyxDQUFQO0FBQ0QsQ0FGRDtBQUlBLElBQU0sTUFBTSxHQUFHLENBQ2I7QUFDRSxFQUFBLElBQUksRUFBRSxjQURSO0FBRUUsRUFBQSxJQUFJLEVBQUUsY0FGUjtBQUdFLEVBQUEsU0FBUyxFQUFFLE9BSGI7QUFJRSxFQUFBLElBQUksRUFBRTtBQUFFLElBQUEsS0FBSyxFQUFFO0FBQVQ7QUFKUixDQURhLEVBT2I7QUFDRSxFQUFBLElBQUksRUFBRSxvQkFEUjtBQUVFLEVBQUEsSUFBSSxFQUFFLGVBRlI7QUFHRSxFQUFBLFNBQVMsRUFBRSxPQUhiO0FBSUUsRUFBQSxJQUFJLEVBQUU7QUFBRSxJQUFBLEtBQUssRUFBRTtBQUFUO0FBSlIsQ0FQYSxFQWFiO0FBQ0UsRUFBQSxJQUFJLEVBQUUseUJBRFI7QUFFRSxFQUFBLElBQUksRUFBRSxZQUZSO0FBR0UsRUFBQSxTQUFTLEVBQUUsVUFIYjtBQUlFLEVBQUEsS0FBSyxFQUFFLElBSlQ7QUFLRSxFQUFBLElBQUksRUFBRTtBQUFFLElBQUEsS0FBSyxFQUFFO0FBQVQ7QUFMUixDQWJhLENBb0JiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBMUJhLENBQWY7QUE2QkYsSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFKLENBQWM7QUFDM0IsRUFBQSxJQUFJLEVBQUUsU0FEcUI7QUFFM0IsRUFBQSxNQUFNLEVBQUUsTUFGbUIsQ0FFWDs7QUFGVyxDQUFkLENBQWY7QUFJQSxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUFDLEVBQUQsRUFBSyxJQUFMLEVBQVcsSUFBWCxFQUFvQjtBQUNwQyxFQUFBLFFBQVEsQ0FBQyxLQUFULEdBQWlCLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBekI7QUFDQSxFQUFBLElBQUk7QUFDTCxDQUhEO0FBS0EsSUFBSSxHQUFKLENBQVE7QUFDTixFQUFBLEVBQUUsRUFBRSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQURFO0FBRU4sRUFBQSxNQUFNLEVBQU4sTUFGTTtBQUdOLEVBQUEsS0FBSyxFQUFMO0FBSE0sQ0FBUiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHZhciBsb2Rhc2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuLy8gbGV0IHNjcmlwdHNMb2NhdGlvbiA9IHt9O1xyXG4vLyBsb2Rhc2guYXN5bmMgPSB0cnVlO1xyXG4vLyBsb2Rhc2guc2V0QXR0cmlidXRlKCdzcmMnLCBzY3JpcHRzTG9jYXRpb24ubG9kYXNoKTtcclxuLy8gZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsb2Rhc2gpO1xyXG5sZXQgc3RvcmUsIHNjckxpc3QsIHREZXRhaWwsIENhdGVEZXRhaWw7XHJcbi8vIGltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJztcclxuLy8gaW1wb3J0IHNjckxpc3QgZnJvbSAnLi9wYWdlcy9saXN0LmpzJztcclxuLy8gaW1wb3J0IHREZXRhaWwgZnJvbSAnLi9wYWdlcy9kZXRhaWwuanMnO1xyXG4vLyBpbXBvcnQgQ2F0ZURldGFpbCBmcm9tICcuL3BhZ2VzL2NhdGVnb3J5LmpzJztcclxuLy8gaW1wb3J0IFNjb3JlYm9hcmQgZnJvbSAnLi9wYWdlcy9zY29yZWJvYXJkLmpzJztcclxuXHJcblZ1ZS5maWx0ZXIoJ2ZpcnN0Y2hhcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pO1xyXG5cclxuICBWdWUuZmlsdGVyKCdsb3dlcmNhc2UnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKVxyXG4gIH0pXHJcblxyXG4gIFZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICB2YXIgbiA9IE1hdGguZmxvb3IoTnVtYmVyKHZhbHVlKSlcclxuICAgIGlmIChuICE9PSBJbmZpbml0eSAmJiBTdHJpbmcobikgPT09IHZhbHVlICYmIG4gPiAwKSB7XHJcbiAgICAgIHJldHVybiAnKycgKyB2YWx1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfSlcclxuXHJcbiAgVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh2YWx1ZSksIG51bGwsIDIpXHJcbiAgfSlcclxuXHJcbiAgY29uc3Qgcm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgIGNvbXBvbmVudDogc2NyTGlzdCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ05TRiBUb3VybmFtZW50cyAtIFJlc3VsdHMgYW5kIFN0YXRpc3RpY3MnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzLzpzbHVnJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IHREZXRhaWwsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdUb3VybmFtZW50IERldGFpbHMnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcnLFxyXG4gICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgIGNvbXBvbmVudDogQ2F0ZURldGFpbCxcclxuICAgICAgcHJvcHM6IHRydWUsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgcGF0aDogJy90b3VybmV5cy86ZXZlbnRfc2x1Zy9ib2FyZCcsXHJcbiAgICAvLyAgIG5hbWU6ICdTY29yZWJvYXJkJyxcclxuICAgIC8vICAgY29tcG9uZW50OiBTY29yZWJvYXJkLFxyXG4gICAgLy8gICBwcm9wczogdHJ1ZSxcclxuICAgIC8vICAgbWV0YTogeyB0aXRsZTogJ1Njb3JlYm9hcmQnIH0sXHJcbiAgICAvLyB9LFxyXG4gIF07XHJcblxyXG5jb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHtcclxuICBtb2RlOiAnaGlzdG9yeScsXHJcbiAgcm91dGVzOiByb3V0ZXMsIC8vIHNob3J0IGZvciBgcm91dGVzOiByb3V0ZXNgXHJcbn0pO1xyXG5yb3V0ZXIuYmVmb3JlRWFjaCgodG8sIGZyb20sIG5leHQpID0+IHtcclxuICBkb2N1bWVudC50aXRsZSA9IHRvLm1ldGEudGl0bGU7XHJcbiAgbmV4dCgpO1xyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gIGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyksXHJcbiAgcm91dGVyLFxyXG4gIHN0b3JlXHJcbn0pXHJcblxyXG5cclxuIl19
