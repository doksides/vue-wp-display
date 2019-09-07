<template>
    <b-table  responsive-sm hover striped foot-clone :items="result(currentRound)" :fields="standings_fields" head-variant="dark">
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
</template>

<script>
import _ from 'lodash';

export default {
  name: 'StandingsTable',
  props: ['caption','currentRound','resultdata'],
  data(){
      return {
          standings_fields:[],
      }
  },
  mounted(){
    this.standings_fields = [
      { key: 'rank','class': 'text-center',sortable: true},
      { key: 'player','class': 'text-center'},
      { key: 'wonLost', label: 'Won-Lost', 'class': 'text-center',
        formatter: (value, key, item) =>
        {
          let loss = item.round - item.points
          return   `${item.points} - ${loss}`
        }
      },
      { key: 'margin', label: 'Spread','class': 'text-center',sortable: true, formatter: (value) =>{
        if(value > 0) {
          return `+${value}`
        }
          return `${value}`;
      }},
      { key: 'lastGame',label: 'Last Game', sortable: false,         formatter: (value, key, item) =>
        {
        if(item.score == 0 && item.oppo_score == 0 && item.result =='draw'){
          return `Awaiting result of game ${item.round} vs ${item.oppo}`
        }
        return `a ${item.score}-${item.oppo_score}  ${item.result.toUpperCase()} vs ${item.oppo} `
        }
      }
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
        if(result === 'draw'){
          if(r['score'] == 0 && r['oppo_score'] == 0){
            r['_cellVariants']['lastGame'] = 'info'
          }else{
            r['_cellVariants']['lastGame'] = 'warning'
          }
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
