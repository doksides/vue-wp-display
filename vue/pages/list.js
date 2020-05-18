let mapGetters = Vuex.mapGetters;
// let LoadingAlert, ErrorAlert;
import {LoadingAlert, ErrorAlert} from './alerts.js';
let scrList = Vue.component('scrList', {
  template: `
  <div class="container-fluid">
    <template v-if="loading||error">
      <div class="row justify-content-center align-content-center align-items-center">
          <div v-if="loading" class="col-12 justify-content-center align-self-center">
              <loading></loading>
          </div>
          <div v-else class="col-12 justify-content-center align-content-center align-self-center">
              <error>
              <p slot="error">{{error}}</p>
              <p slot="error_msg">{{error_msg}}</p>
              </error>
          </div>
      </div>
    </template>
    <template v-else>
      <div class="row no-gutters">
        <div class="col-12 justify-content-center align-items-center">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 justify-content-center align-items-center">
            <h2 class="bebas text-center">
                <i class="fa fa-trophy"></i> Tournaments
            </h2>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-10 offset-lg-1">
          <div class="d-flex flex-column flex-lg-row align-items-center justify-content-around">
            <div class="text-center my-4 mx-1" title="All tourneys">
              <button type="button" class="tagbutton btn btn-light" @click="fetchList(currentPage)" :class="{'active':0 === activeList}"> All <span class="badge badge-dark">
              {{total_tourneys}} </span>
              </button>
            </div>
            <div v-for="cat in categories"  :key="cat.id"
            class="text-center my-4 mx-1" v-if="cat.count>0">
              <button type="button" @click="filterCat(cat.id)" class="  tagbutton btn" :class="{
              'btn-light':cat.slug === 'general',
              'btn-light':cat.slug === 'open',
              'btn-light':cat.slug === 'intermediate',
              'btn-light':cat.slug === 'masters',
              'btn-light':cat.slug === 'ladies',
              'btn-light':cat.slug === 'veterans',
              'active':cat.id === activeList,
              }"> {{cat.name}} <span class="badge badge-dark"> {{cat.count}} </span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-start align-contents-center">
        <div class="col-12">
          <div class="d-flex flex-column flex-lg-row justify-content-around align-items-center">
            <b-pagination :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"
            :hide-ellipsis="false" aria-label="Navigation" />
            <p class="text-muted"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class="emphasize">{{WPtotal}}</span> total <em>{{activeCat}}</em> tournaments!</small></p>
          </div>
        </div>
      </div>
      <div class="row">
      <div class="col-12 col-lg-10 offset-lg-1" v-for="item in tourneys" :key="item.id">
      <div class="d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft" >
        <div class="mr-lg-5">
          <router-link :to="{ name: 'TourneyDetail', params: { slug: item.slug}}">
          <b-img fluid thumbnail rounded="circle" class="logo"
                :src="item.event_logo":alt="item.event_logo_title" />
          </router-link>
        </div>
        <div class="mr-lg-auto">
          <h4 class="mb-1">
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
            <li class="list-inline-item mx-1"
            v-for="category in item.tou_categories">{{category.cat_name}}</li>
        </ul>
        </div>
        </div>
      </div>
      </div>
      </div>
      <div class="row justify-content-start align-items-center">
        <div class="col-12 col-lg-10 offset-lg-1">
          <b-pagination :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"
          :hide-ellipsis="false" aria-label="Navigation" />
          <p class="text-muted"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class="emphasize">{{WPtotal}}</span> total <em>{{activeCat}}</em> tournaments!</small></p>
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
      path: this.$route.path,
      currentPage: 1,
      activeList: 0,
      activeCat: 'all',
    };
    },
  created: function () {
    console.log('List.js loaded')
    document.title = 'Scrabble Tournaments - NSF';
    this.fetchList(this.currentPage);
  },
  methods: {
    fetchList: function(pageNum) {
      this.currentPage = pageNum;
      let params = {};
      params.page = pageNum;
      this.$store.dispatch('FETCH_API', params);
      this.$store.dispatch('FETCH_CATEGORIES');
      console.log('done!');
      console.log(this.activeList, this.activeCat);
    },
    filterCat: function(cat_id){
      this.activeList = cat_id;
      let a = this.categories.filter(c => c.id == cat_id);
      this.activeCat = a[0].name;
      console.log(this.activeList, this.activeCat);
      let params = {};
      params.page = 1;
      params.category = cat_id ;
      this.$store.dispatch('FETCH_API', params);
      this.$store.dispatch('FETCH_CATEGORIES');
    }

  },
  computed: {
    ...mapGetters({
      categories: 'CATEGORIES_COUNT',
      tourneys: 'TOUAPI',
      error: 'ERROR',
      loading: 'LOADING',
      WPtotal: 'WPTOTAL',
      WPpages: 'WPPAGES',
    }),
    total_tourneys: function () {
      if (this.categories.length > 0) {
       let c = this.categories;
       let t = c.reduce((total, cat) =>
        total + cat.count, 0);
        return t;
      }
      return 0;
    },
    breadcrumbs: function() {
      return [
        {
          text: 'NSF News',
          href: '/'
        },
        {
          text: 'Tournaments',
          active: true,
          to: {
            name: 'TourneysList',
          },
        },
      ];
    },
    error_msg: function() {
      return `Sorry we are currently having trouble finding the list of tournaments.`;
    },
  },
});
 export default scrList;