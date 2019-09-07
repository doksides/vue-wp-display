<template>
   <!-- Low Winning Scores -->
  <b-table responsive-sm hover striped foot-clone :items="getLowScore('win')" :fields="lowwins_fields" head-variant="dark">
        <template slot="table-caption">
        {{caption}}
        </template>
    </b-table>
</template>

<script>
import _ from 'lodash';
export default {
    name:'LowWinScoreTable',
    props: ['caption','resultdata'],
    data(){
      return {
        lowwins_fields:[],
      }
    },
    mounted(){
    this.lowwins_fields = [
      { key: 'round', sortable: true},
      { key: 'score', label: 'Winning Score', sortable: true},
      { key: 'player',label: 'Winner', sortable: true},
      { key: 'oppo_score', label: 'Losing Score'},
      { key: 'oppo', label: 'Loser'},
    ];
    },
    methods: {
    getLowScore(result) {
      let data = _.clone(this.resultdata)
      return _.chain(data).map( function(r){
        return _.chain(r)
          .map(function(m) {
            return m
          })
          .filter(function(n){ return n['result'] ===result; })
          .minBy(function(w){
            return w.score;
          })
          .value();
      })
      .sortBy('score')
      .value()

    }
    }
}
</script>

<style>

</style>
