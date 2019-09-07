< script >
// import Vue from "vue";
import axios from "axios";
import _  from "lodash";
// import VueHotkey from "v-hotkey";
import AlertError from "./util_components/AlertError.vue";
import AlertLoading from "./util_components/AlertLoading.vue";
import {mapGetters}from 'vuex'
// import sub-components
import PlayerList from './stats_subcomponents/PlayerList'
import PairingsTable from "./stats_subcomponents/PairingsTable";
import ResultsTable from "./stats_subcomponents/ResultsTable";
import StandingsTable from "./stats_subcomponents/StandingsTable";
import HiWinsTable from "./stats_subcomponents/HiWinsTable";
import HiLossTable from "./stats_subcomponents/HiLossTable";
import LowWinScoreTable from "./stats_subcomponents/LowWinScoreTable";
import ComboScoreTable from "./stats_subcomponents/CombinedScoresTable";
import TotalScoresTable from "./stats_subcomponents/TotalScoresTable";
import TotalOppScoresTable from "./stats_subcomponents/TotalOppScoresTable";
import AveScoresTable from "./stats_subcomponents/AveScoresTable";
import AveOppScoresTable from "./stats_subcomponents/AveOppScoresTable";
import HiSpreadTable from "./stats_subcomponents/HiSpreadTable";
import LoSpreadTable from "./stats_subcomponents/LoSpreadTable";
// import LuckyStiffTable from './stats_subcomponents/LuckyStiffTable'
// import TuffLuckTable from './stats_subcomponents/TuffLuckTable'

// Variables and constants
const baseURL = process.env.VUE_APP_ROOT_API;

export default
{
  name:"CateDetail",
  components:
    {
    "player-list":PlayerList,
    "alert-error":AlertError,
    "alert-loading":AlertLoading,
    "pairings-table":PairingsTable,
    "results-table":ResultsTable,
    "standings-table":StandingsTable,
    "hiwins-table":HiWinsTable,
    "hiloss-table":HiLossTable,
    "lowwin-table":LowWinScoreTable,
    "combo-table":ComboScoreTable,
    "totalscores-table":TotalScoresTable,
    "totaloppscores-table":TotalOppScoresTable,
    "avescores-table":AveScoresTable,
    "aveoppscores-table":AveOppScoresTable,
    "hispread-table":HiSpreadTable,
    "lospread-table":LoSpreadTable
    // 'luckystiff-table': LuckyStiffTable,
    // 'tuffluck-table': TuffLuckTable

  },
  data()
    {
    return
        {
      playerListState:false,
      playerListCondition:"Show",
      parent_slug:this.$route.params.slug,
      slug:this.$route.params.event_slug,
      category:"",
      path:this.$route.path,
      pageurl:baseURL + this.$route.path,
      // gameid: this.$route.query.id,
      isActive:false,
      event_title:"",
      tourney_title:"",
      gamedata:[],
      tabIndex:2,
      resultdata:[],
      currentRound:null,
      total_rounds:null,
      tab_heading:"",
      caption:"",
      showPagination:false,
      luckystiff:[],
      tuffluck:[],
      logo:"",
      timer:"",
      event_data:[],
      loading:true,
      error:""
    };

  },
    mounted:async function ()
      {
      let url = `$
          {baseURL}t_data`;
      this.loading = true;
      try
          {
        let
              {data } = await axios.get(url,
              {params:
                  {slug:this.slug }});
        this.event_data = data[0];
        this.$store.dispatch('SET_PLAYERS_RESULTS', this.event_data);
        this.resultdata = JSON.parse(this.event_data.results)
        this.getData();
        }catch (error)
          {
        this.error = error.toString();
        this.loading = false;
        }

  },
  updated:function()
    {
    this.getHeader(this.tabIndex);
  },
  beforeDestroy:function()
    {
    this.cancelAutoUpdate();
  },
  methods:
    {
    getData:function()
        {
      this.category = this.event_data.event_category[0]["name"];
      this.tourney_title = this.event_data.tourney[0]["post_title"];
      this.event_title = this.tourney_title + " (" + this.category + ")";
      this.parent_slug = this.event_data.tourney[0]["post_name"];
      this.logo = this.event_data.tourney[0].event_logo.guid;
      this.total_rounds = this.resultdata.length;
      this.currentRound = this.total_rounds;
      // this.luckystiff = this.tufflucky("win");
      // this.tuffluck = this.tufflucky("loss");
      this.loading = false;
    },
    playerListToggle:function()
        {
      // this.playerListState != this.playerListState
      if (this.playerListState)
            {
        this.playerListCondition = "Hide";
      }else
            {
        this.playerListCondition = "Show";
      }
    },
    getHeader:function(val)
        {
      switch (val)
            {
        case 0:
          this.showPagination = true;
          this.tab_heading = `Round $
                {this.currentRound}Pairing`;
          this.caption = `Round $
                {this.currentRound}Pairing`;
          break;
        case 1:
          this.showPagination = true;
          this.tab_heading = `Round $
                {this.currentRound}Result`;
          this.caption = `Round $
                {this.currentRound}Result`;
          break;
        case 2:
          this.showPagination = true;
          this.tab_heading = `Standings after Round $
                {this.currentRound}`;
          this.caption = `Standings after Round $
                {this.currentRound}`;
          break;
        case 3:
          this.showPagination = false;
          this.tab_heading = "High Winning Scores";
          this.caption = "High Winning Scores";
          break;
        case 4:
          this.showPagination = false;
          this.tab_heading = "High Losing Scores";
          this.caption = "High Losing Scores";
          break;
        case 5:
          this.showPagination = false;
          this.tab_heading = "Low Winning Scores";
          this.caption = "Low Winning Scores";
          break;
        case 6:
          this.showPagination = false;
          this.tab_heading = "Combined Scores";
          this.caption = "High Combined Score per round";
          break;
        case 7:
          this.showPagination = false;
          this.tab_heading = "Total Scores";
          this.caption = "Total Player Scores Statistics";
          break;
        case 8:
          this.showPagination = false;
          this.tab_heading = "Total Opponent Scores";
          this.caption = "Total Opponent Scores Statistics";
          break;
        case 9:
          this.showPagination = false;
          this.tab_heading = "Average Scores";
          this.caption = "Ranking by Average Player Scores";
          break;
        case 10:
          this.showPagination = false;
          this.tab_heading = "Average Scores";
          this.caption = "Ranking by Average Opponent Scores";
          break;
        case 11:
          this.showPagination = false;
          this.tab_heading = "High Spreads";
          this.caption = "Highest Spread per round ";
          break;
        case 12:
          this.showPagination = false;
          this.tab_heading = "Low Spreads";
          this.caption = "Lowest Spreads per round";
          break;
        case 13:
          this.showPagination = false;
          this.tab_heading = "Lucky Stiffs";
          this.caption = "Lucky Stiffs (frequent low margin/spread winners)";
          break;
        case 14:
          this.showPagination = false;
          this.tab_heading = "Tuff Luck";
          this.caption = "Tuff Luck (frequent low margin/spread losers)";
          break;
        default:
          this.showPagination = false;
          this.tab_heading = "Select a Tab";
          this.caption = "";
          break;
      }
      // return true
    },
    roundChange:function(page)
        {
      // console.log(this.currentRound)
      this.currentRound = page;
    },
    cancelAutoUpdate:function()
        {
      clearInterval(this.timer);
    },
    fetchStats:function(key)
        {
      // common methods for avescore,aveoppscore etc tables
      // let len = this.resultdata.length;
      let resultdata = JSON.parse(this.event_data.results);
      let lastRdData = resultdata[this.total_rounds-1];
      return _.sortBy(lastRdData, key).reverse();
    },
    tufflucky:function(result = "win")
        {
      // method runs both luckystiff and tuffluck tables
      let data = JSON.parse(this.event_data.results);
      let players = _.map(this.players, "post_title");
      let lsdata = [];
      let highsix = _.chain(players)
        .map(function (n)
            {
          let res = _.chain(data)
            .map(function (list)
                {
              return _.chain(list)
                .filter(function (d)
                    {
                  return d["player"] === n && d["result"] === result;
                })
                .value();
            })
            .flattenDeep()
            .sortBy("diff")
            .value();
          if (result === "win")
                {
            return _.first(res, 6);
          }
          return _.takeRight(res, 6);
        })
        .filter(function (n)
            {
          return n.length > 5;
        })
        .value();

      _.map(highsix, function(h)
            {
        let lastdata = _.takeRight(data);
        let diff = _.chain(h)
          .map("diff")
          .map(function (n)
                {
            return Math.abs(n);
          })
          .value();
        let name = h[0]["player"];
        let sum = _.reduce(
          diff,
          function (memo, num)
                {
            return memo + num;
          },
          0);
        let player_data = _.find(lastdata,
                {player:name });
        let mar = player_data["margin"];
        let won = player_data["points"];
        let loss = player_data["round"] - won;
        // push values into lsdata array
        lsdata.push(
                {
          player:name,
          spread:diff,
          sum_spread:sum,
          cummulative_spread:mar,
          won_loss:`$
                    {won} - $
                    {loss}`
        });
      });
      return _.sortBy(lsdata, "sum_spread");
    },
    toNextRd:function()
        {
      let x = this.total_rounds;
      let n = this.currentRound + 1;
      if (n <= x)
            {
        this.currentRound = n;
      }
    },
    toPrevRd:function()
        {
      let n = this.currentRound - 1;
      if (n >= 1)
            {
        this.currentRound = n;
      }
    },
    toFirstRd:function()
        {
      if (this.currentRound != 1)
            {
        this.currentRound = 1;
      }
    },
    toLastRd:function()
        {
      // console.log(' going to last round')
      if (this.currentRound != this.total_rounds)
            {
        this.currentRound = this.total_rounds;
      }
    }
  },
  computed:{
     ...mapGetters(
        {
      players:'PLAYERS',
      total_players:'TOTALPLAYERS',
    }),
    breadcrumbs:function()
        {
      return [
        {text:"Home", to:
                {name:"Main"}},
        {text:this.tourney_title, to:
                {name:"TourneyDetail"}},
        {text:this.category, active:true }
      ];
    },
    error_msg:function()
        {
      return `We are currently network issues with $
            {this.pageurl}`;
    }
  }
};
</script>
<template src="./CateDetail/category.html"></template>
<style src="./CateDetail/category.css"scoped></style>
