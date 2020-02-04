
export { RatingStats as default };
let RatingStats = Vue.component('rating_stats', {
  template: `<!-- Rating Stats -->
  <div class="row">
    <div class="col-8 offset-2 justify-content-center align-items-center">
      <b-table responsive="sm" hover striped foot-clone :items="computed_items" :fields="fields" head-variant="dark">
          <!-- A virtual column -->
          <template v-slot:cell(rating_change)="data">
            <span v-bind:class="{
           'text-info': data.item.rating_change == 0,
           'text-danger': data.item.rating_change < 0,
           'text-success': data.item.rating_change > 0 }">
            {{data.item.rating_change}}
            <i v-bind:class="{
             'fas fa-long-arrow-left':data.item.rating_change == 0,
             'fas fa-long-arrow-down': data.item.rating_change < 0,
             'fas fa-long-arrow-up': data.item.rating_change > 0 }" aria-hidden="true"></i>
           </span>
          </template>
          <template v-slot:cell(name)="data">
            <b-img-lazy :title="data.item.name" :alt="data.item.name" :src="data.item.photo" v-bind="picProps"></b-img-lazy>
          {{data.item.name}}
          </template>
          <template slot="table-caption">
            {{caption}}
          </template>
      </b-table>
    </div>
  </div>
    `,
  props: ['caption', 'computed_items'],
  data: function() {
    return {
      picProps: {
        block: false,
        rounded: 'circle',
        fluid: true,
        blank: true,
        width: '30px',
        height: '30px',
        class: 'shadow-sm, mx-1',
      },
      fields: [
        { key: 'position', label: 'Rank' },
        'name',
        { key: 'rating_change', label: 'Change', sortable: true },
        { key: 'expected_wins', label: 'E.wins' },
        { key: 'actual_wins', label: 'A.wins' },
        { key: 'old_rating', label: 'Old Rating' , sortable: true},
        { key: 'new_rating', label: 'New Rating' , sortable: true},
      ],
    };
  },

});
