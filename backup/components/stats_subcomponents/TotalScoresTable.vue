<template>
    <b-table  responsive-sm hover striped foot-clone :items="stats" :fields="totalscore_fields" head-variant="dark">
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
    name: 'TotalScoresTable',
    props: ['caption', 'stats'],
  data(){
      return {
          totalscore_fields: [],        
      }
  },
  mounted(){
    this.totalscore_fields = [
      'index',
      { key:'position', sortable:true},
      { key: 'total_score',label: 'Total Score','class':'text-center',sortable: true},
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

<style>

</style>
