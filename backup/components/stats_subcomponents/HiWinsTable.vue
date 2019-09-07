<template>
    <!-- High Winning Scores -->
    <b-table responsive-sm hover striped foot-clone :items="getHiScore('win')" :fields="highwins_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>
    </b-table>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'HiWinsTable',
  props: ['caption','resultdata'],
  data(){
      return {
          highwins_fields:[],
      }
  },
  mounted(){
    this.highwins_fields = [
      { key: 'round', sortable: true},
      { key: 'score', label: 'Winning Score', sortable: true},
      { key: 'player',label: 'Winner', sortable: true},
      { key: 'oppo_score', label: 'Losing Score'},
      { key: 'oppo', label: 'Loser'},
    ];
  },
  methods:{
    getHiScore(result){
      let data =  _.clone( this.resultdata)
      return _.chain(data).map( function(r){
        return _.chain(r)
          .map(function(m) {
            return m
          })
          .filter(function(n){ return n['result'] ===result; })
          .maxBy(function(w){
            return w.score;
          })
          .value();
      })
      .sortBy('score')
      .value()
      .reverse();
    },
  }
}
</script>

