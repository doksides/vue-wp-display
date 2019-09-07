<template>
    <b-table responsive-sm hover striped foot-clone :items="loSpread()" :fields="lospread_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>
    </b-table>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'LoSpreadTable',
    props: ['caption','resultdata'],
    data(){
        return {
          lospread_fields: [],
      }
    },
    mounted(){
      this.lospread_fields= [
        'round',
        {key: 'diff', label: 'Spread', sortable: true},
        {key: 'score', label: 'Winning Score', sortable: true},
        {key: 'oppo_score', label: 'Losing Score', sortable: true},
        {key: 'player', label: 'Winner',sortable: true},
        {key: 'oppo', label: 'Loser',sortable: true}
      ];
    },
    methods:{
        loSpread(){
            let data = _.clone(this.resultdata)
            return _.chain(data).map( function(r){
            return _.chain(r)
            .map(function(m) {
                return m
            })
            .filter(function(n){ return n['result'] === 'win'; })
            .minBy(function(w){
                return w.diff;
            })
            .value();
            })
        .sortBy('diff')
        .value();
       }
    }

}
</script>

