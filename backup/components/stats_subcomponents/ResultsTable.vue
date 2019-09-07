<template>
  <b-table  hover responsive-sm striped foot-clone :fields="results_fields"
  :items="result(currentRound)" head-variant="dark">
    <template slot="table-caption">
        {{caption}}
    </template>
  </b-table>
</template>

<script>

import _ from 'lodash';

export default {
  name: 'ResultsTable',
  props: ['caption','currentRound','resultdata'],
  data(){
      return {
          results_fields:[],
      }
  },
  mounted(){
    this.results_fields = [
      { key: 'rank', label: '#','class':'text-center',sortable: true},
      { key: 'player', label: 'Player',sortable: true },
      // { key: 'position',label: 'Position','class':'text-center'},
      { key: 'score',label: 'Score','class':'text-center',sortable: true,
        formatter: (value, key, item)=>
        {
           if(item.oppo_score == 0 && item.score == 0){
             return 'AR'
           }else{
             return item.score
           }
        }
      },
      { key: 'oppo',label: 'Opponent' },
      // { key: 'opp_position', label: 'Position','class': 'text-center'},
      { key: 'oppo_score',label: 'Score','class': 'text-center',sortable: true,
        formatter: (value, key, item)=>
        {
           if(item.oppo_score == 0 && item.score == 0){
             return 'AR'
           }else{
             return item.oppo_score
           }
        }
      },
      { key: 'diff', label: 'Spread','class': 'text-center',sortable: true, formatter: (value, key, item) =>{
        if(item.oppo_score == 0 && item.score == 0){
             return '-'
        }
        if(value > 0) {
         return `+${value}`
        }
         return `${value}`;
      }}
    ];
  },
  methods: {
      result(r) {
      let round = r-1;
      let data = _.clone(this.resultdata[round]);

      _.forEach(data, function(r){
        let opp_no = r['oppo_no'];
        // Find where the opponent's current position and add to collection
        let row = _.find(data, {'pno': opp_no});
        r['opp_position'] = row['position'];
        // check result (win, loss, draw)
        let result = r['result'];
        r['_cellVariants'] = []
        r['_cellVariants']['lastGame'] = 'warning'
        if(result === 'win'){
          r['_cellVariants']['lastGame'] = 'success'
        }
        if(result === 'loss'){
          r['_cellVariants']['lastGame'] = 'danger'
        }
      })

      return  _.chain(data)
      .sortBy('margin')
      .sortBy('points')
      .value()
      .reverse()
    }
  }
}
</script>
