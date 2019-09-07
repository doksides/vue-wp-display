<template>
    <div class="col-sm-2 col-2">
        <h4>
            <b-badge variant="dark">{{ total_players }}</b-badge> Players
        </h4>
        <b-list-group v-for="player in players" :key="player.id" class="list-item">
            <b-list-group-item  v-b-modal="'statsmodal_'+ player.id" @click="showModal(player.id)" :id="player.id">
                <div class="d-flex w-80 justify-content-between">
                    <h5 class="mb-1" v-b-tooltip.hover :title="'Click here for ' +player.post_title +'\'s statistics'"><b-badge>{ {player.tou_no}}</b-badge> {{
                        player.post_title }}
                    </h5>
                    <i class="flag-icon" :class="'flag-icon-'+player.country | lowercase" :title="player.country_full"></i>
                </div>
                <p class="mb-1">
                    <b-img v-if="player.photo" rounded fluid width="30px" height="30px" left :src="player.photo" />
                    <img v-else class="rounded-circle img-fluid ml-0 float-left" width="30px " height="30px " src="../../assets/images/nophoto.jpg">

                    <!-- <span>{{player.country_full}}</span>                                -->
                    <i class="fa fa-2x fa-pull-right" :class="{'fa-male': player.gender == 'm',
            'fa-female': player.gender == 'f',
            'fa-users': player.is_team == 'yes' }"
                        aria-hidden="true"></i>
                    <span v-if="player.team">{{player.team}}</span>
                </p>
                <b-modal ok-only lazy class="player-modals" size="lg" :id="'statsmodal_'+player.id" centered :title="player.post_title + '\'s Round by Round Results and Statistics'">
                    <b-container fluid>
                        <b-row>
                            <b-col cols="4">
                                <h3 class="text-left">{{player.post_title}} <span class="pl-2 flag-icon" :title="player.country_full"
                                        :class="'flag-icon-'+player.country | lowercase"></span></h3>
                                <div>
                                    <b-img v-if="player.photo" rounded="rounded" thumbnail left fluid width="90px"
                                        height="90px" class="mt-2 ml-0" :src="player.photo" />
                                    <img v-else class="rounded img-fluid img-thumbnail mt-2 ml-0 float-left" width="90px "
                                        height="90px " src="../../assets/images/nophoto.jpg">
                                    <i class="fa fa-2x mt-4 mb-0 ml-5" v-bind:class="{'fa-male': player.gender === 'm',
                    'fa-female': player.gender === 'f' ,
                    'fa-users': player.is_team == 'yes' }"
                                        aria-hidden="true"></i>
                                </div>
                                <div class="qstats">
                                    <h4> <span>{{pPosition}}</span></h4>
                                </div>
                                <div class="pteam" v-if="player.team">{{player.team}}</div>
                                <div>
                                    <b-row>
                                        <b-col>
                                            <b-btn v-b-toggle.collapse1 class="m-1">Quick Stats</b-btn>
                                            <b-btn v-b-toggle.collapse2 class="m-1">Round by Round </b-btn>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-col>
                            <b-col>
                                <b-collapse visible id="collapse1">
                                    <b-card>
                                        <h4>Quick Stats &#x1f638;</h4>
                                        <ul class="list-group list-group-flush stats">
                                            <li class="list-group-item">Points:
                                                <span>{{pPoints}} / {{total_rounds}}</span>
                                            </li>
                                            <li class="list-group-item">Current rank:
                                                <span>{{pRank}} </span>
                                            </li>
                                            <li class="list-group-item">Highest Score:
                                                <span>{{pHiScore}}</span> in round <em>{{pHiScoreRounds}}</em>
                                            </li>
                                            <li class="list-group-item">Lowest Score:
                                                <span>{{pLoScore}}</span> in round <em>{{pLoScoreRounds}}</em>
                                            </li>
                                            <li class="list-group-item">Ave Score:
                                                <span>{{pAve}}</span>
                                            </li>
                                            <li class="list-group-item">Ave Opp Score:
                                                <span>{{pAveOpp}}</span>
                                            </li>
                                        </ul>
                                    </b-card>
                                </b-collapse>
                                <b-collapse id="collapse2">
                                    <b-card>
                                        <h4>Round By Round Summary </h4>
                                        <ul class="list-group list-group-flush" v-for="(report, i) in pRbyR" :key="i">
                                            <li v-html="report.report" v-if="report.result=='win'" class="list-group-item list-group-item-success">{{report.report}}</li>
                                            <li v-html="report.report" v-else-if="report.result =='draw'" class="list-group-item list-group-item-warning">{{report.report}}</li>
                                            <li v-html="report.report" v-else-if="report.result =='loss'" class="list-group-item list-group-item-danger">{{report.report}}</li>
                                            <li v-html="report.report" v-else-if="report.result =='AR'" class="list-group-item list-group-item-info">{{report.report}}</li>
                                            <li v-html="report.report" v-else class="list-group-item list-group-item-light">{{report.report}}</li>
                                        </ul>
                                    </b-card>
                                </b-collapse>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import _ from "lodash";
export default {
    name: "PlayerList",
    data() {
        return {
            pPoints: "",
            pRank: "",
            pPosition: "",
            pHiScore: "",
            pHiScoreRounds: "",
            pLoScore: "",
            pLoScoreRounds: "",
            pAve: "",
            pAveOpp: "",
            pRbyR: [],
            current_id : null
        }
    },
    methods: {
      showModal: function(id) {
      let data = JSON.parse(this.result_data);
      let player = _.filter(this.players, { id: id });
    // console.log(_.pickBy(this.players,'post_title'))
      let name = _.map(player, "post_title") + ""; // convert to string
      let player_tno = parseInt(_.map(player,'tou_no'));
    // console.log(this.lastRdData);
      let lastdata = _.find(this.lastRdData, { pno: player_tno });
    // console.log(player_tno,name);

      let pdata = _.chain(data)
        .map(function(m) {
          return _.filter(m, { pno: player_tno });
        })
        .value();
      let allScores = _.chain(pdata)
        .map(function(m) {
          let scores = _.flattenDeep(_.map(m, "score"));
          return scores;
        })
        .value();
      let pHiScore = _.maxBy(allScores) + "";
      let pLoScore = _.minBy(allScores) + "";

      let pHiScoreRounds = _.map(
        _.filter(
          _.flattenDeep(pdata),
          function(d) {
            return d.score == parseInt(pHiScore);
          },
          this
        ),
        "round"
      );

      this.pHiScoreRounds = pHiScoreRounds.join();

      let pLoScoreRounds = _.map(
        _.filter(
          _.flattenDeep(pdata),
          function(d) {
            return d.score == parseInt(pLoScore);
          },
          this
        ),
        "round"
      );

      this.pLoScoreRounds = pLoScoreRounds.join();

      let pRbyR = _.map(pdata, function(t) {
        return _.map(t, function(l) {
          let result = "";
          if (l.result === "win") {
            result = "won";
          } else if (l.result === "draw" && l.score == 0 && l.oppo_score == 0) {
            result = "AR";
          } else {
            result = "lost";
          }
         let starting = "replying";
          if (l.start == "y") {
            starting = "starting";
          }
          if (result == "AR") {
            l["report"] =
              "In round " +
              l.round +
              " " +
              name +
              '<em v-if="l.start">, (' +
              starting +
              ")</em> is playing <strong>" +
              l.oppo +
              "</strong>. Results are being awaited";
          } else {
            l["report"] =
              "In round " +
              l.round +
              " " +
              name +
              '<em v-if="l.start">, (' +
              starting +
              ")</em> played <strong>" +
              l.oppo +
              "</strong> and " +
              result +
              " <em>" +
              l.score +
              " - " +
              l.oppo_score +
              "</em> a difference of " +
              l.diff +
              '. <span class="summary">In this round, <em>' +
              name +
              "</em> is ranked <strong>" +
              l.position +
              "</strong> with <strong>" +
              l.points +
              "</strong> points and a cumulative spread of " +
              l.margin +
              " </span>";
          }
          return l;
        });
      });
    //   console.log(_.flattenDeep(this.pRbyR));
      this.pAveOpp = lastdata.ave_opp_score;
      this.pAve = lastdata.ave_score;
      this.pRank = lastdata.rank;
      this.pPosition = lastdata.position;
      this.pPoints = lastdata.points;
      this.pHiScore = pHiScore
      this.pLoScore = pLoScore
      this.pRbyR = _.flattenDeep(pRbyR)

    }
    },
    computed: {
     ...mapGetters({
        result_data: 'RESULTDATA',
        players: 'PLAYERS',
        total_players: 'TOTALPLAYERS',
    }),
    lastRdData:{
        get () {
            let data = JSON.parse(this.result_data);
            let len = data.length;
            return data[len-1]
        },
         set (value) {
            this.lastRdData = value
        }
     },
    total_rounds:{
        get () {
            let data = JSON.parse(this.result_data);
            return data.length;
        },
        set (value) {
            this.total_rounds = value
        }
     },

    }
}
</script>
<style>
.list-item{
    cursor: pointer;
    z-index: inherit;
}
.pagination * {
    z-index: 0;
}
.player-modals {
    z-index: 999;
}
.modal-title {
    text-align: center;
}
</style>
