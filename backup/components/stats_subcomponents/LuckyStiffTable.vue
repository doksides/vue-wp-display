<template>
    <b-table responsive-sm hover striped foot-clone :items="data" :fields="luckystiff_fields" head-variant="dark">
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
    name: 'LuckyStiffTable',
    props: ['data', 'caption'],
    data(){
        return {
           luckystiff_fields: [] 
        }
    },
    mounted(){
        this.luckystiff_fields= [
            'index',
            {key: 'sum_spread', label: 'Sum of Spread', sortable: true},
            {key: 'spread', label: 'Winning Spread', sortable: true},
            {key: 'won_loss', label: 'Won-Lost'},
            'cummulative_spread', 'player'
        ]
    }
}
</script>

<style>

</style>
