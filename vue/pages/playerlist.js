// let mapGetters = Vuex.mapGetters;

var PlayerStats = Vue.component('playerstats', {
  template: `
   <div class="col-lg-6 offset-lg-3 justify-content-center ">
   <div class="row">
    <div class="col">
     <div class="animated fadeInLeft" id="pheader">
        <div class="d-flex flex-row align-items-center align-content-center justify-content-around">
          <div>
              <h3 class="text-center bebas">{{playerName}}
              <span class="d-inline-block flag-icon" :title="player.country_full"   :class="'flag-icon-'+player.country | lowercase"></span>
              <i class="fa d-inline-block" v-bind:class="{'fa-male': player.gender === 'm','fa-female': player.gender === 'f' ,
      'fa-users': player.is_team == 'yes'}" aria-hidden="true"></i>
              </h3>
          </div>
          <div>
                <img width="100px" height="100px" class="img-thumbnail img-fluid mx-auto d-block shadow-sm" :src="player.photo" />
          </div>
          <div>
              <h4 class="text-center WireOne">{{pstats.pPosition}} position</h4>
          </div>
        </div>
      </div> <!-- #pheader-->
        <div class="d-flex align-items-center justify-content-center">
          <b-btn v-b-toggle.collapse1 class="m-3">Quick Stats</b-btn>
          <b-btn v-b-toggle.collapse2 class="m-3">Round by Round </b-btn>
          <b-btn v-b-toggle.collapse3 class="m-3">Charts</b-btn>
          <b-button title="Close" size="sm" @click="closeCard()" variant="outline-danger" :disabled="!show" :pressed.sync="show"><i class="fas fa-times"></i></b-button>
        </div>
    </div>
    </div>
    <div class="row">
    <div class="col">
        <b-collapse id="collapse1">
          <b-card class="animated flipInX">
          <div class="card-header text-center">Quick Stats</div>
              <ul class="list-group list-group-flush stats">
                  <li class="list-group-item">Points:
                      <span>{{pstats.pPoints}} / {{total_rounds}}</span>
                  </li>
                  <li class="list-group-item">Current rank:
                      <span>{{pstats.pRank}} </span>
                  </li>
                  <li class="list-group-item">Highest Score:
                      <span>{{pstats.pHiScore}}</span> in round <em>{{pstats.pHiScoreRounds}}</em>
                  </li>
                  <li class="list-group-item">Lowest Score:
                      <span>{{pstats.pLoScore}}</span> in round <em>{{pstats.pLoScoreRounds}}</em>
                  </li>
                  <li class="list-group-item">Ave Score:
                      <span>{{pstats.pAve}}</span>
                  </li>
                  <li class="list-group-item">Ave Opp Score:
                      <span>{{pstats.pAveOpp}}</span>
                  </li>
              </ul>
            </b-card>
      </b-collapse>
    <!---- Round By Round Results -->
      <b-collapse id="collapse2">
          <b-card class="animated fadeInUp">
            <h4>Round By Round Summary </h4>
            <ul class="list-group list-group-flush" v-for="(report, i) in pstats.pRbyR" :key="i">
                <li v-html="report.report" v-if="report.result=='win'" class="list-group-item list-group-item-success">{{report.report}}</li>
                <li v-html="report.report" v-else-if="report.result =='draw'" class="list-group-item list-group-item-warning">{{report.report}}</li>
                <li v-html="report.report" v-else-if="report.result =='loss'" class="list-group-item list-group-item-danger">{{report.report}}</li>
                <li v-html="report.report" v-else-if="report.result =='AR'" class="list-group-item list-group-item-info">{{report.report}}</li>
                <li v-html="report.report" v-else class="list-group-item list-group-item-light">{{report.report}}</li>
              </ul>
          </b-card>
        </b-collapse>
        <!-- Charts -->
        <b-collapse id="collapse3">
          <b-card class="animated fadeInDown">
          <div class="card-header text-center">Stats Charts</div>
          <div class="d-flex align-items-center justify-content-center">
              <div>
                <b-button @click="updateChart('mixed')" variant="link" class="text-decoration-none ml-1" :disabled="chartModel=='mixed'" :pressed="chartModel=='mixed'"><i class="fas fa-file-csv" aria-hidden="true"></i> Mixed Scores</b-button>
                <b-button @click="updateChart('rank')" variant="link" class="text-decoration-none ml-1" :disabled="chartModel=='rank'" :pressed="chartModel=='rank'"><i class="fas fa-chart-line" aria-hidden="true"></i> Rank per Rd</b-button>
                <b-button @click="updateChart('wins')" variant="link" class="text-decoration-none ml-1" :disabled="chartModel=='wins'" :pressed="chartModel=='wins'"><i class="fas fa-balance-scale fa-stack" aria-hidden="true"></i> Starts/Replies Wins(%)</b-button>
              </div>
          </div>
          <div id="chart">
            <apexchart v-if="chartModel=='mixed'" type=line height=400 :options="chartOptions" :series="seriesMixed" />
            <apexchart v-if="chartModel=='rank'" type='line' height=400 :options="chartOptionsRank" :series="seriesRank" />
            <apexchart v-if="chartModel=='wins'" type=radialBar height=400 :options="chartOptRadial" :series="seriesRadial" />
          </div>
        </b-card>
      </b-collapse>
      </div>
  </div>
</div>
  `,
  props: ['pstats'],
  components: {
    apexchart: VueApexCharts,
  },
  data: function () {
    return {
      player: '',
      show: true,
      playerName: '',
      allScores: [],
      allOppScores: [],
      allRanks: [],
      total_players: null,
      chartModel: 'mixed',
      seriesMixed: player_mixed_series,
      seriesRank: player_rank_series,
      seriesRadial: player_radial_chart_series,
      chartOptRadial: player_radial_chart_config,
      chartOptions: player_mixed_chart_config,
      chartOptionsRank: player_rank_chart_config,
    }
  },
  mounted: function () {
    this.doScroll();
    // console.log(this.showStats);
    console.log(this.seriesRadial)
  },
  created: function () {
    this.show = this.showStats;
    this.total_players = this.players.length;
    this.player = this.pstats.player[0];
    this.playerName = this.player.post_title;
    var rounds = _.range(1, this.total_rounds + 1);
    var rds = _.map(rounds, function(num){ return 'Rd '+ num; });
    this.chartOptions.xaxis.categories = rds;
    this.allScores = _.flatten(this.pstats.allScores);
    this.allOppScores = _.flatten(this.pstats.allOppScores);
    this.allRanks = _.flatten(this.pstats.allRanks);
    this.updateChart(this.chartModel);
  },
  methods: {
    doScroll: function () {
      // When the user scrolls the page, execute myFunction
      window.onscroll = function() {myFunction()};

      // Get the header
      var header = document.getElementById("pheader");

      // Get the offset position of the navbar
      var sticky = header.offsetTop;
      var h = header.offsetHeight + 50;

      // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
      function myFunction() {
        if (window.pageYOffset > (sticky + h)) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }

    },
    updateChart: function (type) {
      //console.log('-------------Updating..-----------------------');
      this.chartModel = type;
      this.chartOptions.title.align = 'left';
      var firstName = _.trim(_.split(this.playerName, ' ', 2)[0]);
      if ('rank' == type) {
        // this. = 'bar';
        this.chartOptionsRank.title.text =`Ranking: ${this.playerName}`;
        this.chartOptionsRank.yaxis.min = 0;
        this.chartOptionsRank.yaxis.max =this.total_players;
        this.seriesRank = [{
          name: `${firstName} rank this rd`,
          data: this.allRanks
         }]
      }
      if ('mixed'== type) {
        this.chartOptions.title.text = `Scores: ${this.playerName}`;
        this.chartOptions.yaxis.min = 100;
        this.chartOptions.yaxis.max = 900;
        this.seriesMixed = [
          {
            name: `${firstName}`,
            data: this.allScores
           },
          {
          name: 'Opponent',
          data: this.allOppScores
         }]
      }
      if ('wins' == type) {
        this.chartOptRadial.labels= [];
        this.chartOptRadial.colors =[];
        this.chartOptRadial.labels.unshift('Starts: % Wins','Replies: % Wins');
        this.chartOptRadial.colors.unshift('#7CFC00', '#BDB76B');
        console.log(this.chartOptRadial);
        var s = _.round(100 * (this.pstats.startWins / this.pstats.starts),1);
        var r = _.round(100 * (this.pstats.replyWins / this.pstats.replies),1);
        this.seriesRadial = [];
        this.seriesRadial.unshift(s,r);
        console.log(this.seriesRadial)
      }

    },
    closeCard: function () {
    // console.log('----------Closing Card--------------------------');
      this.$store.dispatch('DO_STATS', false);
    }
  },
  computed: {
    ...mapGetters({
      total_rounds: 'TOTAL_ROUNDS',
      players: 'PLAYERS',
      showStats: 'SHOWSTATS',
    }),
  },

});
var PlayerList =  Vue.component('allplayers',{
  template: `
  <div class="row row-eq-height align-items-center" id="players-list">
      <template v-if="showStats">
         <playerstats :pstats="pStats"></playerstats>
      </template>
      <template v-else>
    <div class="playerCols col-md-2 col-xs-6 col-sm-4 p-4 " v-for="player in players" :key="player.id" >
            <h4 class="mx-auto"><b-badge>{{player.tou_no}}</b-badge>
            {{player.post_title }}
            <span class="d-block mx-auto">
            <i class="mx-auto flag-icon" :class="'flag-icon-'+player.country | lowercase" :title="player.country_full"></i>
            <i class="ml-2 fa" :class="{'fa-male': player.gender == 'm',
        'fa-female': player.gender == 'f',
        'fa-users': player.is_team == 'yes' }"
                    aria-hidden="true"></i>
             </span>
            </h4>
            <div class="mx-auto text-center animated fadeIn">
            <b-img-lazy v-bind="imgProps" :alt="player.post_title" :src="player.photo" />
                <span class="d-block mx-auto">
                <span @click="showPlayerStats(player.id)" title="Open player's stats"><i class="fas fa-chart-bar" aria-hidden="true"></i></span>
                </span>
          </div>
       </div>
      </template>
    </div>
    `,
    components: {
      playerstats: PlayerStats,
    },
  data: function() {
    return {
      pStats: {},
      imgProps: {
        center: true,
        block: true,
        rounded: 'circle',
        fluid : true,
        blank: true,
        blankColor: '#bbb',
        width: '80px',
        height: '80px',
        class: 'shadow-sm'
      }
    }
  },
  methods: {
    showPlayerStats: function (id) {
      this.$store.commit('COMPUTE_PLAYER_STATS', id);
      this.pStats.player = this.player;
      this.pStats.pAveOpp = this.lastdata.ave_opp_score;
      this.pStats.pAve = this.lastdata.ave_score;
      this.pStats.pRank = this.lastdata.rank;
      this.pStats.pPosition = this.lastdata.position;
      this.pStats.pPoints = this.lastdata.points;
      this.pStats.pHiScore = this.player_stats.pHiScore;
      this.pStats.pLoScore = this.player_stats.pLoScore;
      this.pStats.pHiOppScore = this.player_stats.pHiOppScore;
      this.pStats.pLoOppScore = this.player_stats.pLoOppScore;
      this.pStats.pHiScoreRounds = this.player_stats.pHiScoreRounds;
      this.pStats.pLoScoreRounds = this.player_stats.pLoScoreRounds;
      this.pStats.allRanks = this.player_stats.allRanks;
      this.pStats.allScores = this.player_stats.allScores;
      this.pStats.allOppScores = this.player_stats.allOppScores;
      this.pStats.pRbyR = this.player_stats.pRbyR;
      this.pStats.startWins = this.player_stats.startWins;
      this.pStats.starts = this.player_stats.starts;
      this.pStats.replyWins = this.player_stats.replyWins;
      this.pStats.replies = this.player_stats.replies;

      this.$store.dispatch('DO_STATS',true);
    }
  },
  computed: {
    ...mapGetters({
      result_data: 'RESULTDATA',
      players: 'PLAYERS',
      total_players: 'TOTALPLAYERS',
      total_rounds: 'TOTAL_ROUNDS',
      showStats: 'SHOWSTATS',
      lastdata: 'LASTRDDATA',
      playerdata: 'PLAYERDATA',
      player: 'PLAYER',
      player_stats: 'PLAYER_STATS'
    }),
    // lastRdData: {
    //   get: function() {
    //     var len = this.result_data.length;
    //     return this.result_data[len - 1]
    //   },
    //   set: function(value) {
    //     this.lastRdData = value
    //   }
    // },
  }
});

 var Results = Vue.component('results', {
  template: `
    <b-table sticky-header hover responsive-sm striped foot-clone :fields="results_fields" :items="result(currentRound)" head-variant="dark" class="animated fadeInUp">
        <template slot="table-caption">
            {{caption}}
        </template>
  </b-table>
    `,
  props: ['caption', 'currentRound', 'resultdata'],
  data: function() {
    return {
      results_fields: [],
    };
  },
  created: function() {
    this.results_fields = [
      { key: 'rank', label: '#', class: 'text-center', sortable: true },
      { key: 'player', label: 'Player', sortable: true },
      // { key: 'position',label: 'Position','class':'text-center'},
      {
        key: 'score',
        label: 'Score',
        class: 'text-center',
        sortable: true,
        formatter: (value, key, item) => {
          if (item.oppo_score == 0 && item.score == 0) {
            return 'AR';
          } else {
            return item.score;
          }
        },
      },
      { key: 'oppo', label: 'Opponent' },
      // { key: 'opp_position', label: 'Position','class': 'text-center'},
      {
        key: 'oppo_score',
        label: 'Score',
        class: 'text-center',
        sortable: true,
        formatter: (value, key, item) => {
          if (item.oppo_score == 0 && item.score == 0) {
            return 'AR';
          } else {
            return item.oppo_score;
          }
        },
      },
      {
        key: 'diff',
        label: 'Spread',
        class: 'text-center',
        sortable: true,
        formatter: (value, key, item) => {
          if (item.oppo_score == 0 && item.score == 0) {
            return '-';
          }
          if (value > 0) {
            return `+${value}`;
          }
          return `${value}`;
        },
      },
    ];
  },
  methods: {
    result: function(r) {
      let round = r - 1;
      let data = _.clone(this.resultdata[round]);

      _.forEach(data, function(r) {
        let opp_no = r['oppo_no'];
        // Find where the opponent's current position and add to collection
        let row = _.find(data, { pno: opp_no });
        r['opp_position'] = row.position;
        // check result (win, loss, draw)
        let result = r.result;
        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'warning';
        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }
        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }
      });

      return _.chain(data)
        .sortBy('margin')
        .sortBy('points')
        .value()
        .reverse();
    },
  },
});

var Standings = Vue.component('standings',{
  template: `
    <b-table sticky-header responsive-sm hover striped foot-clone :items="result(currentRound)" :fields="standings_fields" head-variant="dark" class="animated fadeInUp">
        <template slot="table-caption">
            {{caption}}
        </template>
        <template>
            <template slot="rank" slot-scope="data">
            {{data.value.rank}}
            </template>
            <template slot="player" slot-scope="data">
            {{data.value.player}}
            </template>
            <template slot="wonLost"></template>
            <template slot="margin" slot-scope="data">
            {{data.value.margin}}
            </template>
            <template slot="lastGame">
            </template>
        </template>
    </b-table>
   `,
  props: ['caption', 'currentRound', 'resultdata'],
  data: function() {
    return {
      standings_fields: [],
    };
  },
  mounted: function() {
    this.standings_fields = [
      { key: 'rank', class: 'text-center', sortable: true },
      { key: 'player', class: 'text-center' },
      {
        key: 'wonLost',
        label: 'Won-Lost',
        class: 'text-center',
        formatter: (value, key, item) => {
          let loss = item.round - item.points;
          return `${item.points} - ${loss}`;
        },
      },
      {
        key: 'margin',
        label: 'Spread',
        class: 'text-center',
        sortable: true,
        formatter: value => {
          if (value > 0) {
            return `+${value}`;
          }
          return `${value}`;
        },
      },
      {
        key: 'lastGame',
        label: 'Last Game',
        sortable: false,
        formatter: (value, key, item) => {
          if (
            item.score == 0 &&
            item.oppo_score == 0 &&
            item.result == 'draw'
          ) {
            return `Awaiting result of game ${item.round} vs ${item.oppo}`;
          }
          return `a ${item.score}-${
            item.oppo_score
          }  ${item.result.toUpperCase()} vs ${item.oppo} `;
        },
      },
    ];
  },
  methods: {
    result(r) {
      let round = r - 1;
      let data = _.clone(this.resultdata[round]);
      _.forEach(data, function(r) {
        let opp_no = r['oppo_no'];
        // Find where the opponent's current position and add to collection
        let row = _.find(data, { pno: opp_no });
        r['opp_position'] = row['position'];
        // check result (win, loss, draw)
        let result = r['result'];

        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'warning';
        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }
        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }
        if (result === 'draw') {
          if (r['score'] == 0 && r['oppo_score'] == 0) {
            r['_cellVariants']['lastGame'] = 'info';
          } else {
            r['_cellVariants']['lastGame'] = 'warning';
          }
        }
      });

      return _.chain(data)
        .sortBy('margin')
        .sortBy('points')
        .value()
        .reverse();
    },
  },
});

const Pairings =Vue.component('pairings',  {
  template: `
<table class="table table-sm table-hover table-responsive-sm table-striped  animated fadeInUp">
    <caption>{{caption}}</caption>
    <thead class="thead-dark">
        <tr>
        <th scope="col">#</th>
        <th scope="col">Player</th>
        <th scope="col">Opponent</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(player,i) in pairing(currentRound)" :key="i">
        <th scope="row">{{i + 1}}</th>
        <td><sup v-if="player.start =='y'">*</sup>{{player.player}}</td>
        <td><sup v-if="player.start =='n'">*</sup>{{player.oppo}}</td>
        </tr>
    </tbody>
  </table>
`,
  props: ['caption', 'currentRound', 'resultdata'],

  methods: {
    // get pairing
    pairing(r) {
      let round = r - 1;
      let round_res = this.resultdata[round];
      // Sort by player numbering if round 1 to obtain round 1 pairing
      if (r === 1) {
        round_res = _.sortBy(round_res, 'pno');
      }

      let paired_players = [];

      let rp = _.map(round_res, function(r) {
        let player = r['pno'];
        let opponent = r['oppo_no'];
        if (_.includes(paired_players, player)) {
          return false;
        }
        paired_players.push(player);
        paired_players.push(opponent);
        return r;
      });
      return _.compact(rp);
    },
  },
});




