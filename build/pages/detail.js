(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {LoadingAlert, ErrorAlert} from './alerts';
var LoadingAlert, ErrorAlert;
var tDetail = Vue.component('tdetail', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n          <loading></loading>\n        </div>\n        <div v-if=\"error\" class=\"col-12 justify-content-center align-self-center\">\n          <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <div class=\"p-5 text-center d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start\">\n            <b-img slot=\"aside\" vertical-align=\"center\" class=\"align-self-center mr-3 rounded img-fluid\"\n              :src=\"tourney.event_logo\" width=\"150\" height=\"150\" :alt=\"tourney.event_logo_title\" />\n            <h4 class=\"mx-1 display-4\">\n              {{tourney.title}}\n            </h4>\n          </div>\n          <div class=\"p-5 d-flex flex-column justify-content-center align-items-center\">\n            <ul class=\"list-inline text-center\" id=\"event-details\">\n              <li class=\"list-inline-item\" v-if=\"tourney.start_date\"><i class=\"fa fa-calendar\"></i>\n                {{tourney.start_date}}</li>\n              <li class=\"list-inline-item\" v-if=\"tourney.venue\"><i class=\"fa fa-map-marker\"></i> {{tourney.venue}}</li>\n              <li v-if=\"tourney.tournament_director\"><i class=\"fa fa-legal\"></i>\n                {{tourney.tournament_director}}</li>\n            </ul>\n            <h5>\n              Categories <i class=\"fa fa-list\" aria-hidden=\"true\"></i>\n            </h5>\n            <ul class=\"list-inline text-center cate-list\">\n              <li v-for=\"(cat, c) in tourney.tou_categories\" :key=\"c\" class=\"list-inline-item\">\n                <template v-if=\"cat.event_id\">\n                  <router-link :to=\"{ name: 'CateDetail', params: { slug: tourney.slug , event_slug:cat.event_slug}}\">\n                    <span>{{cat.cat_name}}</span>\n                  </router-link>\n                </template>\n                <template v-else>\n                  <span>{{cat.cat_name}}</span>\n                </template>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n       ",
  components: {
    loading: LoadingAlert,
    error: ErrorAlert
  },
  data: function data() {
    return {
      slug: this.$route.params.slug,
      path: this.$route.path,
      pageurl: "".concat(baseURL, "tournament") + this.$route.path
    };
  },
  beforeUpdate: function beforeUpdate() {
    document.title = this.tourney.title;
  },
  created: function created() {
    this.fetchData();
  },

  /* watch: {
    // call again the method if the route changes
    $route: {
      immediate: true,
      handler: function() {
        this.fetchData();
       // this.$store.dispatch('FETCH_DETAIL', this.slug);
      },
    },
  }, */
  // beforeRouteUpdate (to, from, next) {
  //   this.fetchData();
  // },
  methods: {
    fetchData: function fetchData() {
      var _this = this;

      if (this.tourney.slug != this.slug) {
        // reset title because of breadcrumbs
        this.tourney.title = '';
      }

      var e = this.toulist.find(function (event) {
        return event.slug === _this.slug;
      });

      if (e) {
        var now = moment();
        var a = moment(this.last_access_time);
        var time_elapsed = now.diff(a, 'seconds');

        if (time_elapsed < 300) {
          console.log('-------Match Found in Tourney List----------');
          console.log(e);
          console.log(time_elapsed);
          this.tourney = e;
        } else {
          this.$store.dispatch('FETCH_DETAIL', this.slug);
        }
      } else {
        this.$store.dispatch('FETCH_DETAIL', this.slug);
      }
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    // tourney: 'DETAIL',
    error: 'ERROR',
    loading: 'LOADING',
    last_access_time: 'TOUACCESSTIME',
    toulist: 'TOUAPI'
  }), {
    tourney: {
      get: function get() {
        return this.$store.getters.DETAIL;
      },
      set: function set(newVal) {
        this.$store.commit('SET_EVENTDETAIL', newVal);
      }
    },
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'Tournaments',
        to: {
          name: 'TourneysList'
        }
      }, {
        text: this.tourney.title,
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues. Please refresh to try again ";
    }
  })
}); // export default tDetail;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2dWUvcGFnZXMvZGV0YWlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtBQUNBLElBQUksWUFBSixFQUFrQixVQUFsQjtBQUVBLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsU0FBZCxFQUF5QjtBQUNyQyxFQUFBLFFBQVEsZ3VGQUQ2QjtBQTREckMsRUFBQSxVQUFVLEVBQUU7QUFDVixJQUFBLE9BQU8sRUFBRSxZQURDO0FBRVYsSUFBQSxLQUFLLEVBQUU7QUFGRyxHQTVEeUI7QUFnRXJDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMLE1BQUEsSUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsSUFEcEI7QUFFTCxNQUFBLElBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxJQUZiO0FBR0wsTUFBQSxPQUFPLEVBQUUsVUFBRyxPQUFILGtCQUF5QixLQUFLLE1BQUwsQ0FBWTtBQUh6QyxLQUFQO0FBS0QsR0F0RW9DO0FBdUVyQyxFQUFBLFlBQVksRUFBRSx3QkFBWTtBQUN4QixJQUFBLFFBQVEsQ0FBQyxLQUFULEdBQWlCLEtBQUssT0FBTCxDQUFhLEtBQTlCO0FBQ0QsR0F6RW9DO0FBMEVyQyxFQUFBLE9BQU8sRUFBRSxtQkFBVztBQUNsQixTQUFLLFNBQUw7QUFDRCxHQTVFb0M7O0FBNkVyQzs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxTQUFTLEVBQUUscUJBQVc7QUFBQTs7QUFDbkIsVUFBSSxLQUFLLE9BQUwsQ0FBYSxJQUFiLElBQXFCLEtBQUssSUFBOUIsRUFBb0M7QUFDbkM7QUFDQSxhQUFLLE9BQUwsQ0FBYSxLQUFiLEdBQXFCLEVBQXJCO0FBQ0Q7O0FBQ0QsVUFBSSxDQUFDLEdBQUcsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixVQUFBLEtBQUs7QUFBQSxlQUFJLEtBQUssQ0FBQyxJQUFOLEtBQWUsS0FBSSxDQUFDLElBQXhCO0FBQUEsT0FBdkIsQ0FBUjs7QUFDQSxVQUFJLENBQUosRUFBTztBQUNMLFlBQUksR0FBRyxHQUFHLE1BQU0sRUFBaEI7QUFDQSxZQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxnQkFBTixDQUFoQjtBQUNBLFlBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUFZLFNBQVosQ0FBckI7O0FBQ0EsWUFBSSxZQUFZLEdBQUcsR0FBbkIsRUFBd0I7QUFDdEIsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhDQUFaO0FBQ0EsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7QUFDQSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWjtBQUNBLGVBQUssT0FBTCxHQUFlLENBQWY7QUFFRCxTQU5ELE1BTU87QUFDUCxlQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLGNBQXJCLEVBQXFDLEtBQUssSUFBMUM7QUFDQztBQUNGLE9BYkQsTUFhTztBQUNMLGFBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsY0FBckIsRUFBcUMsS0FBSyxJQUExQztBQUNEO0FBQ0Y7QUF2Qk0sR0ExRjRCO0FBbUhyQyxFQUFBLFFBQVEsb0JBQ0gsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFDakI7QUFDQSxJQUFBLEtBQUssRUFBRSxPQUZVO0FBR2pCLElBQUEsT0FBTyxFQUFFLFNBSFE7QUFJakIsSUFBQSxnQkFBZ0IsRUFBRSxlQUpEO0FBS2pCLElBQUEsT0FBTyxFQUFFO0FBTFEsR0FBaEIsQ0FERztBQVFOLElBQUEsT0FBTyxFQUFFO0FBQ1AsTUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNmLGVBQU8sS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixNQUEzQjtBQUNELE9BSE07QUFJUCxNQUFBLEdBQUcsRUFBRSxhQUFVLE1BQVYsRUFBa0I7QUFDckIsYUFBSyxNQUFMLENBQVksTUFBWixDQUFtQixpQkFBbkIsRUFBc0MsTUFBdEM7QUFDRDtBQU5NLEtBUkg7QUFnQk4sSUFBQSxXQUFXLEVBQUUsdUJBQVc7QUFDdEIsYUFBTyxDQUNMO0FBQ0UsUUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFLFFBQUEsRUFBRSxFQUFFO0FBQ0YsVUFBQSxJQUFJLEVBQUU7QUFESjtBQUZOLE9BREssRUFPTDtBQUNFLFFBQUEsSUFBSSxFQUFFLEtBQUssT0FBTCxDQUFhLEtBRHJCO0FBRUUsUUFBQSxNQUFNLEVBQUU7QUFGVixPQVBLLENBQVA7QUFZRCxLQTdCSztBQThCTixJQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQjtBQUNEO0FBaENLO0FBbkg2QixDQUF6QixDQUFkLEMsQ0FzSkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBpbXBvcnQge0xvYWRpbmdBbGVydCwgRXJyb3JBbGVydH0gZnJvbSAnLi9hbGVydHMnO1xyXG5sZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5cclxudmFyIHREZXRhaWwgPSBWdWUuY29tcG9uZW50KCd0ZGV0YWlsJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJlcnJvclwiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicC01IHRleHQtY2VudGVyIGQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cclxuICAgICAgICAgICAgPGItaW1nIHNsb3Q9XCJhc2lkZVwiIHZlcnRpY2FsLWFsaWduPVwiY2VudGVyXCIgY2xhc3M9XCJhbGlnbi1zZWxmLWNlbnRlciBtci0zIHJvdW5kZWQgaW1nLWZsdWlkXCJcclxuICAgICAgICAgICAgICA6c3JjPVwidG91cm5leS5ldmVudF9sb2dvXCIgd2lkdGg9XCIxNTBcIiBoZWlnaHQ9XCIxNTBcIiA6YWx0PVwidG91cm5leS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwibXgtMSBkaXNwbGF5LTRcIj5cclxuICAgICAgICAgICAgICB7e3RvdXJuZXkudGl0bGV9fVxyXG4gICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicC01IGQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSB0ZXh0LWNlbnRlclwiIGlkPVwiZXZlbnQtZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW1cIiB2LWlmPVwidG91cm5leS5zdGFydF9kYXRlXCI+PGkgY2xhc3M9XCJmYSBmYS1jYWxlbmRhclwiPjwvaT5cclxuICAgICAgICAgICAgICAgIHt7dG91cm5leS5zdGFydF9kYXRlfX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW1cIiB2LWlmPVwidG91cm5leS52ZW51ZVwiPjxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT4ge3t0b3VybmV5LnZlbnVlfX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWlmPVwidG91cm5leS50b3VybmFtZW50X2RpcmVjdG9yXCI+PGkgY2xhc3M9XCJmYSBmYS1sZWdhbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIHt7dG91cm5leS50b3VybmFtZW50X2RpcmVjdG9yfX08L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8aDU+XHJcbiAgICAgICAgICAgICAgQ2F0ZWdvcmllcyA8aSBjbGFzcz1cImZhIGZhLWxpc3RcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyIGNhdGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWZvcj1cIihjYXQsIGMpIGluIHRvdXJuZXkudG91X2NhdGVnb3JpZXNcIiA6a2V5PVwiY1wiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJjYXQuZXZlbnRfaWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ0NhdGVEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogdG91cm5leS5zbHVnICwgZXZlbnRfc2x1ZzpjYXQuZXZlbnRfc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3tjYXQuY2F0X25hbWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICAgICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBwYWdldXJsOiBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgICsgdGhpcy4kcm91dGUucGF0aCxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVVcGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy50b3VybmV5LnRpdGxlO1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xyXG4gIH0sXHJcbiAgLyogd2F0Y2g6IHtcclxuICAgIC8vIGNhbGwgYWdhaW4gdGhlIG1ldGhvZCBpZiB0aGUgcm91dGUgY2hhbmdlc1xyXG4gICAgJHJvdXRlOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICAgICAgIC8vIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LCAqL1xyXG4gIC8vIGJlZm9yZVJvdXRlVXBkYXRlICh0bywgZnJvbSwgbmV4dCkge1xyXG4gIC8vICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICAvLyB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICBpZiAodGhpcy50b3VybmV5LnNsdWcgIT0gdGhpcy5zbHVnKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgdGl0bGUgYmVjYXVzZSBvZiBicmVhZGNydW1ic1xyXG4gICAgICAgIHRoaXMudG91cm5leS50aXRsZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBlID0gdGhpcy50b3VsaXN0LmZpbmQoZXZlbnQgPT4gZXZlbnQuc2x1ZyA9PT0gdGhpcy5zbHVnKTtcclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICBsZXQgbm93ID0gbW9tZW50KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IG1vbWVudCh0aGlzLmxhc3RfYWNjZXNzX3RpbWUpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVfZWxhcHNlZCA9IG5vdy5kaWZmKGEsICdzZWNvbmRzJyk7XHJcbiAgICAgICAgaWYgKHRpbWVfZWxhcHNlZCA8IDMwMCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS1NYXRjaCBGb3VuZCBpbiBUb3VybmV5IExpc3QtLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRpbWVfZWxhcHNlZCk7XHJcbiAgICAgICAgICB0aGlzLnRvdXJuZXkgPSBlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREVUQUlMJywgdGhpcy5zbHVnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICAvLyB0b3VybmV5OiAnREVUQUlMJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgbGFzdF9hY2Nlc3NfdGltZTogJ1RPVUFDQ0VTU1RJTUUnLFxyXG4gICAgICB0b3VsaXN0OiAnVE9VQVBJJ1xyXG4gICAgfSksXHJcbiAgICB0b3VybmV5OiB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzdG9yZS5nZXR0ZXJzLkRFVEFJTDtcclxuICAgICAgfSxcclxuICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdTRVRfRVZFTlRERVRBSUwnLCBuZXdWYWwpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXkudGl0bGUsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzLiBQbGVhc2UgcmVmcmVzaCB0byB0cnkgYWdhaW4gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbi8vIGV4cG9ydCBkZWZhdWx0IHREZXRhaWw7XHJcbiJdfQ==
