'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var tDetail = Vue.component('tdetail', {
  template: '<div class="container" id="main-container">\n  <template v-if="loading||error">\n        <div class="row">\n            <div v-if="loading" class="col">\n                <loading></loading>\n            </div>\n            <div v-if="error" class="col">\n              <error>\n              <p slot="error">{{error}}</p>\n              <p slot="error_msg">{{error_msg}}</p>\n              </error>\n            </div>\n        </div>\n    </template>\n    <template v-else>\n        <div class="row">\n          <div class="col">\n              <b-breadcrumb :items="breadcrumbs" />\n          </div>\n        </div>\n        <div class="row">\n         <div class="col">\n         <section class="jumbotron text-center">\n            <b-media tag="div" class="tourney-details animated fadeIn">\n                <b-img slot="aside" vertical-align="center" class="align-self-center mr-3 rounded img-fluid"\n                    :src="tourney.event_logo" width="150" height="150" :alt="tourney.event_logo_title" />\n                <h4 class="mx-1 display-4">\n                    {{tourney.title}}\n                </h4>\n                <div class="m-auto">\n                    <ul class="list-inline text-center" id="event-details">\n                        <li class="list-inline-item" v-if="tourney.start_date"><i class="fa fa-calendar"></i> {{tourney.start_date}}</li>\n                        <li class="list-inline-item" v-if="tourney.venue"><i class="fa fa-map-marker"></i> {{tourney.venue}}</li>\n                        <li v-if="tourney.tournament_director"><i class="fa fa-legal"></i>\n                            {{tourney.tournament_director}}</li>\n                    </ul>\n\n                    <h5>\n                    Categories <i class="fa fa-list" aria-hidden="true"></i>\n                    </h5>\n                    <ul class="list-inline text-center cate-list">\n                        <li v-for="(cat, c) in tourney.tou_categories" :key="c"  class="list-inline-item">\n                            <template  v-if="cat.event_id">\n                                <router-link :to="{ name: \'CateDetail\', params: { slug: tourney.slug , event_slug:cat.event_slug}}">\n                                    <span>{{cat.cat_name}}</span>\n                                </router-link>\n                            </template>\n                            <template v-else>\n                                <span>{{cat.cat_name}}</span>\n                            </template>\n                        </li>\n                    </ul>\n                </div>\n            </b-media>\n         </section>\n         </div>\n         </div>\n    </template>\n</div>\n    <!-- end -->\n    ',
  components: {
    loading: LoadingAlert,
    error: ErrorAlert
  },
  data: function data() {
    return {
      slug: this.$route.params.slug,
      path: this.$route.path,
      pageurl: baseURL + 'tournament' + this.$route.path
    };
  },
  beforeUpdate: function beforeUpdate() {
    document.title = this.tourney.title;
  },
  watch: {
    // call again the method if the route changes
    $route: {
      immediate: true,
      handler: function handler() {
        // this.fetchData();
        this.$store.dispatch('FETCH_DETAIL', this.slug);
      }
    }
  },
  methods: {
    fetchData: function fetchData() {
      if (this.tourney.slug != this.slug) {
        // reset title because of breadcrumbs
        this.tourney.title = '';
        this.$store.dispatch('FETCH_DETAIL', this.slug);
        // this.$store.cache.dispatch("FETCH_DETAIL", this.slug, {
        //     timeout: 600000 //10 minutes
        // });
      }
    }
  },
  computed: _extends({}, mapGetters({
    tourney: 'DETAIL',
    error: 'ERROR',
    loading: 'LOADING'
  }), {
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
      return 'We are currently experiencing network issues fetching this page ' + this.pageurl + ' ';
    }
  })
});