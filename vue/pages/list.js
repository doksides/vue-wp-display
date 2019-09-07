var scrList = Vue.component('scrList', {
  template: `
    <div class="container">
    <template v-if="loading||error">
        <div class="row justify-content-center align-items-center">
            <div v-if="loading" class="col align-self-center">
                <loading></loading>
            </div>
            <div v-if="error" class="col align-self-center">
                <error>
                <p slot="error">{{error}}</p>
                <p slot="error_msg">{{error_msg}}</p>
                </error>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="row justify-content-center align-items-center">
            <div class="col-12">
                <h2 class="text-center bebas">
                    <i class="fa fa-trophy"></i> Tournaments
                </h2>
            </div>
        </div>
        <div class="row justify-content-center align-items-center">
            <div class="col-12 d-flex flex-column">
              <b-pagination align="center" :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"
                        :hide-ellipsis="false" aria-label="Navigation" />
              <p class="text-muted"> You are on page {{currentPage}} of {{WPpages}} pages with <span class="emphasize">{{WPtotal}}</span> tournaments!</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <ul class="list-unstyled tourney-list">
                    <b-media tag="li" no-body v-for="item in tourneys" :key="item.id" class="animated bounceInLeft">
                        <b-media-aside vertical-align="center">
                            <router-link :to="{ name: 'TourneyDetail', params: { slug: item.slug}}">
                                <b-img fluid vertical-align="center" class="align-self-center mr-0 thumbnail"
                                    :src="item.event_logo" width="100" height="100" :alt="item.event_logo_title" />
                            </router-link>
                        </b-media-aside>
                        <b-media-body class="ml-0 my-1">
                            <h4 class="mb-1 display-5">
                                <router-link v-if="item.slug" :to="{ name: 'TourneyDetail', params: { slug: item.slug}}">
                                    {{item.title}}
                                </router-link>
                            </h4>
                            <div class="text-center">
                                <div class="d-inline p-1">
                                    <small><i class="fa fa-calendar"></i>
                                        {{item.start_date}}
                                    </small>
                                </div>
                                <div class="d-inline p-1">
                                    <small><i class="fa fa-map-marker"></i>
                                        {{item.venue}}
                                    </small>
                                </div>
                                <div class="d-inline p-1">
                                    <router-link v-if="item.slug" :to="{ name: 'TourneyDetail', params: { slug: item.slug}}">
                                        <small title="Browse tourney"><i class="fa fa-link"></i>
                                        </small>
                                    </router-link>
                                </div>
                                <ul class="list-unstyled list-inline text-center category-list">
                                    <li class="list-inline-item mx-auto"
                                    v-for="category in item.tou_categories">{{category.cat_name}}</li>
                                </ul>
                            </div>
                        </b-media-body>
                    </b-media>
                    </ul>
                </div>
            </div>
            <div class="row">
              <div class="col-lg-12 d-flex flex-column justify-content-lg-end">
                <p class="my-0 py-0"><small class="text-muted">You are on page {{currentPage}} of {{WPpages}} pages with <span class="emphasize">{{WPtotal}}</span>
                tournaments!</small></p>
                    <b-pagination align="center" :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"
                        :hide-ellipsis="false" aria-label="Navigation" />
            </div>
         </div>
    </template>
</div>`,
  components: {
    loading: LoadingAlert,
    error: ErrorAlert,
  },
  data: function() {
    return {
      path: this.$route.path,
      currentPage: 1,
    };
    },
  created: function() {
    document.title = 'Home - NSF Scrabble Tournaments';
    console.log('List component mounted!');
      this.fetchList(this.currentPage);
  },
  methods: {
    fetchList: function(pageNum) {
      this.$store.dispatch('FETCH_API', pageNum, {
        // timeout: 3600000 //1 hour cache
      });
      this.currentRound = pageNum;
    },

  },
  computed: {
    ...mapGetters({
      tourneys: 'TOUAPI',
      error: 'ERROR',
      loading: 'LOADING',
      WPtotal: 'WPTOTAL',
      WPpages: 'WPPAGES',
    }),
    error_msg: function() {
      return `Sorry we are currently having trouble finding the list of tournaments.`;
    },
  },
});