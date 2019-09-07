<template>
    <b-table responsive-sm hover striped foot-clone :items="stats" :fields="avescore_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>
        <template slot="index" slot-scope="data">
            {{data.index + 1}}
        </template>
    </b-table>
</template>

<script>
// import {_} from 'vue-underscore';

export default {
name: 'AveScoresTable',
    props: ['caption', 'stats'],
  data(){
      return {
          avescore_fields: [],
      }
  },
  mounted(){
    this.avescore_fields = [
        'index',
      { key:'position', sortable:true},
      { key: 'ave_score',label: 'Average Score','class':'text-center',sortable: true},
      { key: 'player',label: 'Player','class':'text-center'},
      { key: 'wonLost', label: 'Won-Lost', sortable: false,'class': 'text-center',
        formatter: (value, key, item) =>
        {
          let loss = item.round - item.points
          return   `${item.points} - ${loss}`
        }
      },
      { key: 'margin',label: 'Spread','class':'text-center',
      formatter: (value) =>{
        if(value > 0) {
         return `+${value}`
        }
         return `${value}`;
      }}
    ];
  }
}
</script>
