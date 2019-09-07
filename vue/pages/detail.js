
var tDetail = Vue.component('tdetail', {
  template: `<div class="container" id="main-container">
  <template v-if="loading||error">
        <div class="row">
            <div v-if="loading" class="col">
                <loading></loading>
            </div>
            <div v-if="error" class="col">
              <error>
              <p slot="error">{{error}}</p>
              <p slot="error_msg">{{error_msg}}</p>
              </error>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="row">
          <div class="col">
              <b-breadcrumb :items="breadcrumbs" />
          </div>
        </div>
        <div class="row">
         <div class="col">
         <section class="jumbotron text-center">
            <b-media tag="div" class="tourney-details animated fadeIn">
                <b-img slot="aside" vertical-align="center" class="align-self-center mr-3 rounded img-fluid"
                    :src="tourney.event_logo" width="150" height="150" :alt="tourney.event_logo_title" />
                <h4 class="mx-1 display-4">
                    {{tourney.title}}
                </h4>
                <div class="m-auto">
                    <ul class="list-inline text-center" id="event-details">
                        <li class="list-inline-item" v-if="tourney.start_date"><i class="fa fa-calendar"></i> {{tourney.start_date}}</li>
                        <li class="list-inline-item" v-if="tourney.venue"><i class="fa fa-map-marker"></i> {{tourney.venue}}</li>
                        <li v-if="tourney.tournament_director"><i class="fa fa-legal"></i>
                            {{tourney.tournament_director}}</li>
                    </ul>

                    <h5>
                    Categories <i class="fa fa-list" aria-hidden="true"></i>
                    </h5>
                    <ul class="list-inline text-center cate-list">
                        <li v-for="(cat, c) in tourney.tou_categories" :key="c"  class="list-inline-item">
                            <template  v-if="cat.event_id">
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
            </b-media>
         </section>
         </div>
         </div>
    </template>
</div>
    <!-- end -->
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
