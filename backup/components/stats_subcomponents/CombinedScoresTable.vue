<template>
  <b-table responsive-sm hover striped foot-clone :items="hicombo()" :fields="hicombo_fields" head-variant="dark">
    <template slot="table-caption">
        {{caption}}
    </template>
  </b-table>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'ComboScoreTable',
    props: ['caption','resultdata'],
    data(){
        return {
            hicombo_fields:[],
        }
    },
    mounted(){
        this.hicombo_fields = [
            { key:'round', sortable:true},
            { key: 'combo_score', label: 'Combined Score', sortable: true,'class': 'text-center'},
            { key: 'score',label: 'Winning Score','class':'text-center',sortable: true},
            { key: 'oppo_score',label: 'Losing Score','class':'text-center',sortable: true},
            { key: 'player',label: 'Winner','class':'text-center'},
            { key: 'oppo',label: 'Loser','class':'text-center'}
        ];
    },
    methods: {
     hicombo(){
      let data = _.clone(this.resultdata)
      return _.chain(data).map( function(r){
        return _.chain(r)
          .map(function(m) {
            return m
          })
          .filter(function(n){ return n['result'] ==='win'; })
          .maxBy(function(w){
            return w.combo_score;
          })
          .value();
      })
      .sortBy('combo_score')
      .value()
      .reverse();
    },
  }
}
</script>

