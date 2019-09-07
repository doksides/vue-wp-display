<template>
    <b-table  responsive-sm hover striped foot-clone :items="data" :fields="tuffluck_fields" head-variant="dark">
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
    name: 'TuffLuckTable',
    props: ['data', 'caption'],
    data(){
        return {
           tuffluck_fields: [] 
        }
    },
    mounted(){
        this.tuffluck_fields = [
            'index',
            {key: 'sum_spread', label: 'Sum of Spread', sortable: true},
            {key: 'spread', label: 'Losing Spread', sortable: true},
            {key: 'won_loss', label: 'Won-Lost'},
            'cummulative_spread',
            'player'
        ] 
    }
}
</script>

<style>

</style>
