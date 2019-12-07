var player_mixed_series = [{ name: '',  data: [] }];
var player_rank_series = [{ name: '',  data: [] }];
var player_radial_chart_series = []  ;
var player_radial_chart_config = {
  plotOptions: {
    radialBar: {
      hollow: { size: '50%', }
    },
  },
  colors: [],
  labels: [],
};

var player_rank_chart_config = {
  chart: {
    height: 400,
    zoom: {
      enabled: false
    },
    shadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 1
    },
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth' // straight
  },
  title: {
    text: '',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Rounds'
    }
  },
  yaxis: {
    title: {
      text: ''
    },
    min: null,
    max: null
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};

var PlayerStats = Vue.component('playerstats', {
  template: `
  <div class="col-lg-10 offset-lg-1 justify-content-center">
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <div class="animated fadeInLeftBig" id="pheader">
          <div class="d-flex align-items-center align-content-center justify-content-center mt-5">
            <div>
              <h4 class="text-center bebas">{{playerName}}
                <span class="d-block mx-auto" style="font-size:small">
                  <i class="mx-3 flag-icon" :class="'flag-icon-'+player.country | lowercase"
                    :title="player.country_full"></i>
                  <i class="mx-3 fa" :class="{'fa-male': player.gender == 'm',
                   'fa-female': player.gender == 'f','fa-users': player.is_team == 'yes' }" aria-hidden="true">
                  </i>
                </span>
              </h4>
            </div>
            <div>
              <img width="100px" height="100px" class="img-thumbnail img-fluid mx-3 d-block shadow-sm"
                :src="player.photo" />
            </div>
            <div>
              <h4 class="text-center yanone mx-3">{{pstats.pPosition}} position</h4>
            </div>
          </div>
        </div> <!-- #pheader-->

        <div class="d-flex align-items-center align-content-center justify-content-center">
          <b-btn v-b-toggle.collapse1 class="m-1">Quick Stats</b-btn>
          <b-btn v-b-toggle.collapse2 class="m-1">Round by Round </b-btn>
          <b-btn v-b-toggle.collapse3 class="m-1">Charts</b-btn>
          <b-button title="Close" size="sm" @click="closeCard()" class="m-1" variant="outline-danger" :disabled="!show"
            :pressed.sync="show"><i class="fas fa-times"></i></b-button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <b-collapse id="collapse1">
          <b-card class="animated flipInX">
            <div class="card-header text-center">Quick Stats</div>
            <ul class="list-group list-group-flush stats">
              <li class="list-group-item">Points:
                <span>{{pstats.pPoints}} / {{total_rounds}}</span>
              </li>
              <li class="list-group-item">Rank:
                <span>{{pstats.pRank}} </span>
              </li>
              <li class="list-group-item">Highest Score:
                <span>{{pstats.pHiScore}}</span> (rd <em>{{pstats.pHiScoreRounds}}</em>)
              </li>
              <li class="list-group-item">Lowest Score:
                <span>{{pstats.pLoScore}}</span> (rd <em>{{pstats.pLoScoreRounds}}</em>)
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
              <li v-html="report.report" v-if="report.result=='win'" class="list-group-item list-group-item-success">
                {{report.report}}</li>
              <li v-html="report.report" v-else-if="report.result =='draw'"
                class="list-group-item list-group-item-warning">{{report.report}}</li>
              <li v-html="report.report" v-else-if="report.result =='loss'"
                class="list-group-item list-group-item-danger">{{report.report}}</li>
              <li v-html="report.report" v-else-if="report.result =='awaiting'" class="list-group-item list-group-item-info">
                {{report.report}}</li>
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
                <b-button @click="updateChart('mixed')" variant="link" class="text-decoration-none ml-1"
                  :disabled="chartModel=='mixed'" :pressed="chartModel=='mixed'"><i class="fas fa-file-csv"
                    aria-hidden="true"></i> Mixed Scores</b-button>
                <b-button @click="updateChart('rank')" variant="link" class="text-decoration-none ml-1"
                  :disabled="chartModel=='rank'" :pressed="chartModel=='rank'"><i class="fas fa-chart-line"
                    aria-hidden="true"></i> Rank per Rd</b-button>
                <b-button @click="updateChart('wins')" variant="link" class="text-decoration-none ml-1"
                  :disabled="chartModel=='wins'" :pressed="chartModel=='wins'"><i class="fas fa-balance-scale fa-stack"
                    aria-hidden="true"></i> Starts/Replies Wins(%)</b-button>
              </div>
            </div>
            <div id="chart">
              <apexchart v-if="chartModel=='mixed'" type=line height=400 :options="chartOptions"
                :series="seriesMixed" />
              <apexchart v-if="chartModel=='rank'" type='line' height=400 :options="chartOptionsRank"
                :series="seriesRank" />
              <apexchart v-if="chartModel=='wins'" type=radialBar height=400 :options="chartOptRadial"
                :series="seriesRadial" />
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
      chartModel: 'rank',
      seriesMixed: player_mixed_series,
      seriesRank: player_rank_series,
      seriesRadial: player_radial_chart_series,
      chartOptRadial: player_radial_chart_config,
      chartOptionsRank: player_rank_chart_config,
      chartOptions: {
        chart: {
          height: 400,
          zoom: {
            enabled: false
          },
          shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.5
          },
        },
        colors: ['#8FBC8F', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight' // smooth
        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Rounds'
          }
        },
        yaxis: {
          title: {
            text: ''
          },
          min: null,
          max: null
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    }
  },
  mounted: function () {
    this.doScroll();
    console.log(this.seriesRadial)
    this.show = this.showStats;
    this.allScores = _.flatten(this.pstats.allScores);
    this.allOppScores = _.flatten(this.pstats.allOppScores);
    this.allRanks = _.flatten(this.pstats.allRanks);
    this.updateChart(this.chartModel);
    this.total_players = this.players.length;
    this.player = this.pstats.player[0];
    this.playerName = this.player.post_title;
  },
  beforeDestroy() {
    this.closeCard();
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
    setChartCategories: function(){
      let rounds = _.range(1, this.total_rounds + 1);
      let rds = _.map(rounds, function(num){ return 'Rd '+ num; });
      this.chartOptions.xaxis.categories = rds;
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
      if ('mixed' == type) {
        this.setChartCategories()
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
    ...Vuex.mapGetters({
      total_rounds: 'TOTAL_ROUNDS',
      players: 'PLAYERS',
      showStats: 'SHOWSTATS',
    }),
  },

});

var PlayerList = Vue.component('allplayers', {
  template: `
  <div class="row justify-content-center align-items-center">
    <template v-if="showStats">
        <playerstats :pstats="pStats"></playerstats>
    </template>
    <template v-else>
    <div id="p-list" class="col-12">
    <transition-group tag="div" name="players-list">
    <div class="playerCols mx-2 p-2 mb-4" v-for="player in data" :key="player.id">
        <div class="d-flex flex-column">
            <h5 class="oswald"><small>#{{player.pno}}</small>
            {{player.player}}<span class="ml-2" @click="sortPos()" style="cursor: pointer; font-size:0.8em"><i v-if="asc" class="fa fa-sort-numeric-down" aria-hidden="true" title="Click to sort DESC by current rank"></i><i v-else class="fa fa-sort-numeric-up" aria-hidden="true" title="Click to sort ASC by current rank"></i></span><span v-if="sorted" class="ml-3" @click="restoreSort()" style="cursor: pointer; font-size:0.8em"><i class="fa fa-undo" aria-hidden="true" title="Click to reset list"></i></span>
            <span class="d-block mx-auto my-1"  style="font-size:small">
            <i class="mx-auto flag-icon" :class="'flag-icon-'+player.country | lowercase" :title="player.country_full"></i>
            <i class="ml-2 fa" :class="{'fa-male': player.gender == 'm',
        'fa-female': player.gender == 'f',
        'fa-users': player.is_team == 'yes' }"
                    aria-hidden="true"></i>
              <span style="color:tomato; font-size:1.4em" class="ml-5" v-if="sorted">{{player.position}}</span>
             </span>
            </h5>
            <div class="d-block text-center animated fadeIn pgallery">
              <b-img-lazy v-bind="imgProps" :alt="player.player" :src="player.photo" :id="'popover-'+player.id"></b-img-lazy>
              <div class="d-block mt-2 mx-auto">
              <span @click="showPlayerStats(player.id)" title="Show  stats">
              <i class="fas fa-chart-bar" aria-hidden="true"></i>
              </span>
              <span class="ml-4" title="Show Scorecard">
                  <router-link exact :to="{ name: 'Scoresheet', params: {  event_slug:slug, pno:player.pno}}">
                  <i class="fas fa-clipboard" aria-hidden="true"></i>
                  </router-link>
              </span>
              </div>
              <!---popover -->
              <b-popover @show="getLastGames(player.pno)" placement="bottom"  :target="'popover-'+player.id" triggers="hover" boundary-padding="5">
              <div class="d-flex flex-row justify-content-center">
                <div class="d-flex flex-column flex-wrap align-content-between align-items-start mr-2 justify-content-around">
                  <span class="flex-grow-1 align-self-center" style="font-size:1.5em;">{{mstat.position}}</span>
                  <span class="flex-shrink-1 d-inline-block text-muted"><small>{{mstat.wins}}-{{mstat.draws}}-{{mstat.losses}}</small></span>
                </div>
                <div class="d-flex flex-column flex-wrap align-content-center">
                <span class="text-primary d-inline-block" style="font-size:0.8em; text-decoration:underline">Last Game: Round {{mstat.round}}</span>
                    <span class="d-inline-block p-1 text-white sdata-res text-center"
                      v-bind:class="{'bg-warning': mstat.result === 'draw',
                          'bg-info': mstat.result === 'awaiting',
                          'bg-danger': mstat.result === 'loss',
                          'bg-success': mstat.result === 'win' }">
                          {{mstat.score}}-{{mstat.oppo_score}} ({{mstat.result|firstchar}})
                    </span>
                    <div>
                    <img :src="mstat.opp_photo" :alt="mstat.oppo" class="rounded-circle m-auto d-inline-block" width="25" height="25">
                    <span class="text-info d-inline-block" style="font-size:0.9em"><small>#{{mstat.oppo_no}} {{mstat.oppo|abbrv}}</small></span>
                    </div>
                </div>
              </div>
              </b-popover>
          </div>
          </div>
         </div>
         </transition-group>
        </div>
      </template>
    </div>
    `,
  components: {
    playerstats: PlayerStats,
  },
  props: ['slug'],
  data: function () {
    return {
      pStats: {},
      imgProps: {
        center: true,
        block: true,
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '70px',
        height: '70px',
        style: 'cursor: pointer',
        class: 'shadow-sm',
      },
      dataFlat: {},
      mstat: {},
      data: {},
      sorted: false,
      asc: true
    }
  },
  beforeMount: function() {
    let resultdata = this.result_data;
    this.dataFlat = _.flattenDeep(_.clone(resultdata));
    this.data = _.chain(resultdata).last().sortBy('pno').value();
    console.log('-----------DATA-------------------------');
    console.log(this.data);
    console.log('------------------------------------');
  },
  methods: {
    getLastGames: function (tou_no) {
      console.log(tou_no)
      let c = _.clone(this.dataFlat);
      let res = _.chain(c)
        .filter(function(v) {
           return v.pno === tou_no;
        }).takeRight().value();
      this.mstat = _.first(res);
      // console.log(this.mstat)
    },
    sortPos: function () {
      this.sorted = true;
      this.asc = !this.asc;
      console.log('Sorting..');
      let sortDir = 'asc';
      if (false == this.asc) {
        sortDir = 'desc';
      }
      let sorted = _.orderBy(this.data, 'rank', sortDir);
      console.log(sorted);
      this.data = sorted;
    },
    restoreSort: function () {
      this.sorted = false;
      this.asc = true;
      this.data = _.orderBy(this.data, 'pno', 'asc');
    },
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
    ...Vuex.mapGetters({
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

  }
});

 var Results = Vue.component('results', {
   template: `
    <b-table hover stacked="sm" striped foot-clone :fields="results_fields" :items="result(currentRound)" head-variant="dark" class="animated fadeInUp">
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
        r['_cellVariants']['lastGame'] = 'info';
        if (result === 'draw') {
        r['_cellVariants']['lastGame'] = 'warning';
        }
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
    <b-table responsive stacked="sm" hover striped foot-clone :items="result(currentRound)" :fields="standings_fields" head-variant="dark" class="animated fadeInUp">
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
      imgProps: {
        rounded: 'circle',
        center: true,
        block: true,
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '25px',
        height: '25px',
        class: 'shadow-sm',
      },
    };
  },
  mounted: function() {
    this.standings_fields = [
      { key: 'rank', class: 'text-center', sortable: true },
      { key: 'player', class: 'text-center' },
      {
        key: 'wonLost',
        label: 'Win-Draw-Loss',
        class: 'text-center',
        formatter: (value, key, item) => {
          return `${item.wins} - ${item.draws} - ${item.losses}`;
        },
      },
      {
        key: 'points',
        label: 'Points',
        class: 'text-center',
        formatter: (value, key, item) => {
          if (item.ar > 0) {
            return `${item.points}*`;
          }
          return `${item.points}`;
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
            item.result == 'awaiting'
          ) {
            return `Awaiting result of game ${item.round} vs ${item.oppo}`;
          }else{
            return `a ${item.score}-${item.oppo_score}
            ${item.result.toUpperCase()} vs ${item.oppo} `;
          }
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
        if (result === 'awaiting') {
          r['_cellVariants']['lastGame'] = 'info';
        }
        if (result === 'draw') {
          r['_cellVariants']['lastGame'] = 'warning';
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
<table class="table table-hover table-responsive table-striped  animated fadeInUp">
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
        <td :id="'popover-'+player.id"><b-img-lazy v-bind="imgProps" :alt="player.player" :src="player.photo"></b-img-lazy><sup v-if="player.start =='y'">*</sup>{{player.player}}</td>
        <td :id="'popover-'+player.opp_id"><b-img-lazy v-bind="imgProps" :alt="player.oppo" :src="player.opp_photo"></b-img-lazy><sup  v-if="player.start =='n'">*</sup>{{player.oppo}}</td>
        </tr>
    </tbody>
  </table>
`,
  props: ['caption', 'currentRound', 'resultdata'],
  data() {
    return {
      imgProps: {
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        style:'margin-right:.5em',
        width: '25px',
        height: '25px',
        class: 'shadow-sm',
      },
    }
  },
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

export {Pairings, Standings, PlayerList, Results}

