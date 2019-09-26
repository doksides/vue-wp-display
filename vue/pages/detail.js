
var tDetail = Vue.component('tdetail', {
  template: `
  <div class="container-fluid">
    <template v-if="loading||error">
      <div class="row justify-content-center align-content-center align-items-center">
        <div v-if="loading" class="col-12 justify-content-center align-self-center">
          <loading></loading>
        </div>
        <div v-if="error" class="col-12 justify-content-center align-self-center">
          <error>
            <p slot="error">{{error}}</p>
            <p slot="error_msg">{{error_msg}}</p>
          </error>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col-12 justify-content-center align-items-center">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 justify-content-center align-items-center">
          <div class="p-5 text-center d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start">
            <b-img slot="aside" vertical-align="center" class="align-self-center mr-3 rounded img-fluid"
              :src="tourney.event_logo" width="150" height="150" :alt="tourney.event_logo_title" />
            <h4 class="mx-1 display-4">
              {{tourney.title}}
            </h4>
          </div>
          <div class="p-5 d-flex flex-column justify-content-center align-items-center">
            <ul class="list-inline text-center" id="event-details">
              <li class="list-inline-item" v-if="tourney.start_date"><i class="fa fa-calendar"></i>
                {{tourney.start_date}}</li>
              <li class="list-inline-item" v-if="tourney.venue"><i class="fa fa-map-marker"></i> {{tourney.venue}}</li>
              <li v-if="tourney.tournament_director"><i class="fa fa-legal"></i>
                {{tourney.tournament_director}}</li>
            </ul>
            <h5>
              Categories <i class="fa fa-list" aria-hidden="true"></i>
            </h5>
            <ul class="list-inline text-center cate-list">
              <li v-for="(cat, c) in tourney.tou_categories" :key="c" class="list-inline-item">
                <template v-if="cat.event_id">
                  <router-link :to="{ name: 'CateDetail', params: { slug: tourney.slug , event_slug:cat.event_slug}}">
                    <span>{{cat.cat_name}}</span>
                  </router-link>
                </template>
                <template v-else>
                  <span>{{cat.cat_name}}</span>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
       `,
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
  },
  data: function() {
    return {
      slug: this.$route.params.slug,
      path: this.$route.path,
      pageurl: `${baseURL}tournament` + this.$route.path,
    };
  },
  beforeUpdate: function () {
    document.title = this.tourney.title;
  },
  watch: {
    // call again the method if the route changes
    $route: {
      immediate: true,
      handler: function() {
        // this.fetchData();
        this.$store.dispatch('FETCH_DETAIL', this.slug);

      },
    },
  },
  methods: {
    fetchData: function() {
       if (this.tourney.slug != this.slug) {
        // reset title because of breadcrumbs
        this.tourney.title = '';
        this.$store.dispatch('FETCH_DETAIL', this.slug);
        // this.$store.cache.dispatch("FETCH_DETAIL", this.slug, {
        //     timeout: 600000 //10 minutes
        // });
      }
    },
  },
  computed: {
    ...mapGetters({
      tourney: 'DETAIL',
      error: 'ERROR',
      loading: 'LOADING',
    }),
    breadcrumbs: function() {
      return [
        {
          text: 'Tournaments',
          to: {
            name: 'TourneysList',
          },
        },
        {
          text: this.tourney.title,
          active: true,
        },
      ];
    },
    error_msg: function() {
      return `We are currently experiencing network issues fetching this page ${
        this.pageurl} `;
    },
  },
});
