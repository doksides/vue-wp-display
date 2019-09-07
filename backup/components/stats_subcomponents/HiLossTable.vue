<template>
   <!-- High Losing Scores -->
   <b-table responsive-sm hover striped foot-clone :items="getHiScore('loss')" :fields="hiloss_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>
    </b-table>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'HiLossTable',
  props: ['caption','resultdata'],
  data(){
      return {
         hiloss_fields: [],
      }
  },
  mounted(){
    this.hiloss_fields = [
      { key: 'round', sortable: true},
      { key: 'score', label: 'Losing Score', sortable: true},
      { key: 'player',label: 'Loser', sortable: true},
      { key: 'oppo_score', label: 'Winning Score'},
      { key: 'oppo', label: 'Winner'},
    ]
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
          .max(function(w){
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

