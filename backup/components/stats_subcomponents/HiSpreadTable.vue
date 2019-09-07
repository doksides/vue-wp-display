<template>
    <b-table responsive-sm hover striped foot-clone :items="hiSpread()" :fields="hispread_fields" head-variant="dark">
        <template slot="table-caption">
            {{caption}}
        </template>
    </b-table>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'HiSpreadTable',
    props: ['caption','resultdata'],
    data(){
        return {
          hispread_fields: [],
      }
    },
    mounted(){
      this.hispread_fields= [
        'round',
        {key: 'diff', label: 'Spread', sortable: true},
        {key: 'score', label: 'Winning Score', sortable: true},
        {key: 'oppo_score', label: 'Losing Score', sortable: true},
        {key: 'player', label: 'Winner',sortable: true},
        {key: 'oppo', label: 'Loser',sortable: true}
      ];
    },
    methods:{
        hiSpread(){
            let data =_.clone(this.resultdata)
            return _.chain(data).map( function(r){
                return _.chain(r)
                .map(function(m) {
                    return m
                })
                .filter(function(n){ return n['result'] === 'win'; })
                .max(function(w){
                    return w.diff;
                })
                .value();
            })
            .sortBy('diff')
            .value()
            .reverse();
        }
    }

}
</script>

