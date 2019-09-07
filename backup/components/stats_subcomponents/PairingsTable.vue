const Pairings = Vue.component('pairing',
{
template:`
<table class="table table-hover table-responsive-sm table-striped">
    <caption>{{caption}}</caption>
    <thead class="thead-dark">
        <tr>
        <th scope="col">#</th>
        <th scope="col">Player</th>
        <th scope="col">Opponent</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(player,i) in pairing(currentRound)" :key="i">
        <th scope="row">{{i + 1}}</th>
        <td><sup v-if="player.start =='y'">*</sup>{{player.player}}</td>
        <td><sup v-if="player.start =='n'">*</sup>{{player.oppo}}</td>
        </tr>
    </tbody>
  </table>
`
props:['caption', 'currentRound', 'resultdata'],
methods:
        {
        // get pairing
        pairing(r)
            {
            let round = r-1;
            let round_res = this.resultdata[round];
            // Sort by player numbering if round 1 to obtain round 1 pairing
            if (r === 1)
                {
                round_res = _.sortBy(round_res, 'pno');
            }

            let paired_players = [];

            let rp = _.map(round_res, function(r)
                {
                let player = r['pno'];
                let opponent = r['oppo_no'];
                if (_.includes(paired_players, player))
                    {
                    return false;
                }
                paired_players.push(player);
                paired_players.push(opponent);
                return r;
            })
            return _.compact(rp);
        },
    }
}
})
