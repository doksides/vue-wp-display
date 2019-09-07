<template>
    <b-table hover responsive-sm striped foot-clone :items="stats" :fields="aveoppscore_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>                  
        <template slot="index" slot-scope="data">
            {{data.index + 1}}
        </template>                
    </b-table>
</template>

<script>

export default {
    name: 'AveOppScoresTable',
    props: ['caption', 'stats'],
    data(){
      return {
          aveoppscore_fields: [],        
      }
  },
    mounted(){
     this.aveoppscore_fields = [
      'index',
      { key:'position', sortable:true},
      { key: 'ave_opp_score',label: 'Average Opponent Score','class':'text-center',sortable: true},
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
