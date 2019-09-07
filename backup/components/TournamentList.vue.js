//<script>
import { mapGetters } from "vuex";
import AlertError from "./util_components/AlertError";
import AlertLoading from "./util_components/AlertLoading";

export default {
  name: "tlist",
  data() {
    return {
      path: this.$route.path,
      currentPage: 1
    };
  },
  created() {
    this.fetchList(this.currentPage);
  },
  components: {
    "alert-error": AlertError,
    "alert-loading": AlertLoading,
  },
  methods: {
    fetchList: function(pageNum) {
      this.$store.cache.dispatch("FETCH_API", pageNum, {
        timeout: 3600000 //1 hour cache
     });
      this.currentRound = pageNum;
      // console.log(this.tourneys)
    }
  },
  computed: {
    ...mapGetters({
      tourneys: "TOUAPI",
      error: "ERROR",
      loading: "LOADING",
      WPtotal: "WPTOTAL",
      WPpages: "WPPAGES"
    }),
    error_msg: function() {
      return `Sorry we are currently having trouble finding the list of tournaments.`;
    }
  }
};
//</script>
<template src ="./TourneyListing/listing.html"></template>
<style src="./TourneyListing/listing.css"></style>
