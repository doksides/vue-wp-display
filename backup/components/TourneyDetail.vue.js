<script>
import { mapGetters } from 'vuex'
import AlertError from './util_components/AlertError.vue'
import AlertLoading from './util_components/AlertLoading.vue'
const baseURL = process.env.VUE_APP_ROOT_API
export default {
  name: 'TourneyDetail',
  components: { 'alert-error': AlertError,
    'alert-loading': AlertLoading},
  data () {
    return {
      slug: this.$route.params.slug,
      path: this.$route.path,
      pageurl: baseURL + this.$route.path,
      socialTitle: 'Results and Statistics',
      slide: 0,
      sliding: null
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': {
      immediate: true,
      handler(){
        this.fetchData()
      }
    }
  },
  // mounted () {
  //  this.fetchData()
  // },
  methods: {
    fetchData: function () {
    // let data = this.getDetail()
    if(!this.tourney.length > 0){
    //  this.$store.dispatch('FETCH_DETAIL', this.slug)
     this.$store.cache.dispatch("FETCH_DETAIL", this.slug, {
        timeout: 600000 //10 minutes
     });
    }
  },
    onSlideStart: function () {
      this.sliding = true
    },
    onSlideEnd: function () {
      this.sliding = false
    }
  },
  computed: {
     ...mapGetters({
      tourney: 'DETAIL',
      error: 'ERROR',
      loading: 'LOADING'
    }),
    breadcrumbs: function () {
      return [{text: 'Home', to: { name: 'Main' } }, {text: this.tourney.title, active: true}]
    },
    error_msg: function () {
       return `We are currently experiencing network issues fetching this page ${this.pageurl} `;
    }
  }

}
</script>
<template src="./TourneyDetail/detail.html"></template>
<style scoped src="./TourneyDetail/detail.css"></style>
