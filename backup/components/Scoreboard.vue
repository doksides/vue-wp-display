<script>
// import Vue from "vue";
// import moment from 'moment'
import  _  from 'lodash';
import axios from "axios";
import {mapGetters} from 'vuex'
import AlertError from "./util_components/AlertError.vue";
import AlertLoading from "./util_components/AlertLoading.vue";

const baseURL = process.env.VUE_APP_ROOT_API;

export default {
  name: "Scoreboard",
  data() {
    return {
      itemsPerRow: 5,
      per_page: 15,
      parent_slug: this.$route.params.slug,
      slug: this.$route.params.event_slug,
      // total_players: null,
      reloading: false,
      loading: true,
      error: "",
      currentPage: 1,
      period: 0.5,
      timer: null,
      windowHeight: 0,
      scoreboard_data: [],
      response_data: [],
      category: "",
      // players: [],
      total_rounds: 0,
      currentRound: null,
      event_title: "",
      is_live_game: true
    };
  },
  head: {
    title: function() {
      return {
        inner: this.event_title
      };
    },
    meta: [
      {
        name: "description",
        content: "Nigeria Scrabble Federation Tournaments",
        id: "desc"
      }
    ]
    //omited
  },
  components: {
    "alert-error": AlertError,
    "alert-loading": AlertLoading
  },
  computed: {
    ...mapGetters({
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
    }),
    rowCount: function() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    }
  },
  watch: {
    windowHeight: function(newHeight) {
      if (newHeight > 750) {
        //  console.log(`old: ${oldHeight} new: ${newHeight}`)

        this.per_page = 20;
        if (_.isEmpty(this.response_data)) {
          this.getData();
        } else {
          this.processDetails(this.currentPage);
        }
      }

      if (newHeight < 750) {
        // console.log(`old: ${oldHeight} new: ${newHeight}`)
        this.per_page = 15;
        if (_.isEmpty(this.response_data)) {
          this.getData();
        } else {
          this.processDetails(this.currentPage);
        }
      }
    }
  },
  created: function() {
    this.getData()
  },
  mounted: function() {
    this.timer = setInterval(
      function() {
        this.reload();
      }.bind(this),
      this.period * 60000
    );
    this.$nextTick(() => {
      // window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener("resize", this.getWindowHeight);
      // Initialize
      this.getWindowHeight();
    });
  },
  beforeDestroy: function() {
    // window.removeEventListener('resize', this.getWindowWidth);
    window.removeEventListener("resize", this.getWindowHeight);
    this.cancelAutoUpdate();
  },
  methods: {
    getAsyncData: function() {
      var self = this;
      window.setTimeout(function() {
        self.title = this.event_title;
        self.$emit("updateHead");
      }, 2000);
    },
    getWindowWidth: function() {
      this.windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    },
    getWindowHeight: function() {
      this.windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    },
    cancelAutoUpdate: function() {
      clearInterval(this.timer);
    },
    reload: function() {
      if (this.is_live_game == true) {
        this.getData();
      } else {
        this.processDetails(this.currentPage);
      }
    },
    itemCountInRow: function(index) {
      return this.scoreboard_data.slice(
        (index - 1) * this.itemsPerRow,
        index * this.itemsPerRow
      );
    },
    getData: async function() {
      let url = `${baseURL}t_data`;
      this.loading = true;
      try {
        let { data } = await axios.get(url, { params: { slug: this.slug } });
        this.response_data = data[0];
        this.$store.dispatch('SET_PLAYERS_RESULTS',this.response_data);
        //this.resultdata = JSON.parse(this.response_data.results)
        this.reloading = this.loading = false;
        this.category = this.response_data.event_category[0]["name"];
        this.event_title = this.response_data.tourney[0]["post_title"];
        this.event_title = `Scoreboard ${this.event_title} - ${this.category}`;
        var self = this;
        self.$emit("updateHead");
        // this.slug = this.response_data.slug;
        // this.players = this.response_data.players;
        // this.total_players = this.response_data.players.length;
        this.is_live_game = this.response_data.ongoing[0];
        // console.log(this.is_live_game)
        this.processDetails(this.currentPage);
      } catch (error) {
        this.error = error.toString();
        this.reloading = this.loading = false;
      }
    },
    processDetails: function(currentPage) {
      let res = this.response_data;
      if (_.isEmpty(res) || this.is_live_game == true) {
        //  console.log('..getting from server, no result data available')
        this.getData();
      }
      if (!this.is_live_game == true && !_.isNull(this.timer)) {
        // console.log(this.is_live_game +':cancelling timers')
        this.cancelAutoUpdate();
      }
      //let currentPage = parseInt(this.currentPage)
      // let cat_params = this.$route.params.category
      let resultdata = JSON.parse(res.results);
      let initialRdData = _.initial(_.clone(resultdata));
      let previousRdData = _.last(initialRdData);
      let lastRdD = _.last(_.clone(resultdata));
      let lastRdData = _.map(
        lastRdD,
        (player)  => {
          let x = player.pno - 1;

          player.photo = this.players[x].photo;
          player.gender = this.players[x].gender;
          player.country_full = this.players[x].country_full;
          player.country = this.players[x].country;
          if (
            player.result == "draw" &&
            player.score == 0 &&
            player.oppo_score == 0
          ) {
            player.result = "AR";
          }
          if (previousRdData) {
            let playerData = _.find(previousRdData, {
              player: player.player
            });
            player.lastposition = playerData["position"];
            player.lastrank = playerData["rank"];
            // previous rounds results
            player.prevresults = _.chain(initialRdData)
              .flattenDeep()
              .filter(function(v) {
                return v.player === player.player;
              })
              .map("result")
              .value();
          }
          return player;
        }
      );

      this.total_rounds = resultdata.length;
      this.currentRound = lastRdData[0]["round"];
      let chunks = _.chunk(lastRdData, this.per_page);
      // this.loading = false
      // this.reloading = false
      this.scoreboard_data = chunks[currentPage - 1];
    }
  }
};
</script>
<template src="./Scoreboard/board.html"></template>
<style src="./Scoreboard/board.css" scoped></style>
