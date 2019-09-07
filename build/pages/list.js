'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var scrList = Vue.component('scrList', {
    template: '\n    <div class="container">\n    <template v-if="loading||error">\n        <div class="row">\n            <div v-if="loading" class="col">\n                <loading></loading>\n            </div>\n            <div v-if="error" class="col">\n                <error>\n                <p slot="error">{{error}}</p>\n                <p slot="error_msg">{{error_msg}}</p>\n                </error>\n            </div>\n        </div>\n    </template>\n    <template v-else>\n        <div class="row">\n            <div class="col">\n               <div class="d-flex flex-row justify-content-center">\n                    <h3 class="bebas">\n                        <i class="fa fa-trophy"></i> Tournaments\n                    </h3>\n               </div>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col">\n               <div class="d-flex flex-column justify-content-sm-end mb-3">\n                <b-pagination align="center" :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"\n                        :hide-ellipsis="false" aria-label="Navigation" />\n\n                <p class="text-muted"> You are on page {{currentPage}} of {{WPpages}} pages with <span class="emphasize">{{WPtotal}}</span> tournaments!</p>\n                </div>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col">\n                <ul class="list-unstyled tourney-list">\n                    <b-media tag="li" no-body v-for="item in tourneys" :key="item.id" class="animated bounceInLeft">\n                        <b-media-aside vertical-align="center">\n                            <router-link :to="{ name: \'TourneyDetail\', params: { slug: item.slug}}">\n                                <b-img fluid vertical-align="center" class="align-self-center mr-0 thumbnail"\n                                    :src="item.event_logo" width="100" height="100" :alt="item.event_logo_title" />\n                            </router-link>\n                        </b-media-aside>\n                        <b-media-body class="ml-0 my-1">\n                            <h4 class="mb-1 display-5">\n                                <router-link v-if="item.slug" :to="{ name: \'TourneyDetail\', params: { slug: item.slug}}">\n                                    {{item.title}}\n                                </router-link>\n                            </h4>\n                            <div class="text-center">\n                                <div class="d-inline p-1">\n                                    <small><i class="fa fa-calendar"></i>\n                                        {{item.start_date}}\n                                    </small>\n                                </div>\n                                <div class="d-inline p-1">\n                                    <small><i class="fa fa-map-marker"></i>\n                                        {{item.venue}}\n                                    </small>\n                                </div>\n                                <div class="d-inline p-1">\n                                    <router-link v-if="item.slug" :to="{ name: \'TourneyDetail\', params: { slug: item.slug}}">\n                                        <small title="Browse tourney"><i class="fa fa-link"></i>\n                                        </small>\n                                    </router-link>\n                                </div>\n                                <ul class="list-unstyled list-inline text-center category-list">\n                                    <li class="list-inline-item mx-auto"\n                                    v-for="category in item.tou_categories">{{category.cat_name}}</li>\n                                </ul>\n                            </div>\n                        </b-media-body>\n                    </b-media>\n                    </ul>\n                <template>\n                <p class="my-0 py-0"><small class="text-muted">You are on page {{currentPage}} of {{WPpages}} pages with <span class="emphasize">{{WPtotal}}</span>\n                tournaments!</small></p>\n                    <b-pagination align="center" :total-rows="+WPtotal" @change="fetchList" v-model="currentPage" :per-page="10"\n                        :hide-ellipsis="false" aria-label="Navigation" />\n                </template>\n            </div>\n        </div>\n    </template>\n</div>',
    components: {
        loading: LoadingAlert,
        error: ErrorAlert
    },
    data: function data() {
        return {
            path: this.$route.path,
            currentPage: 1
        };
    },
    created: function created() {
        document.title = 'Home - NSF Scrabble Tournaments';
        console.log('List component mounted!');
        this.fetchList(this.currentPage);
    },
    methods: {
        fetchList: function fetchList(pageNum) {
            this.$store.dispatch('FETCH_API', pageNum, {
                // timeout: 3600000 //1 hour cache
            });
            this.currentRound = pageNum;
        }

    },
    computed: _extends({}, mapGetters({
        tourneys: 'TOUAPI',
        error: 'ERROR',
        loading: 'LOADING',
        WPtotal: 'WPTOTAL',
        WPpages: 'WPPAGES'
    }), {
        error_msg: function error_msg() {
            return 'Sorry we are currently having trouble finding the list of tournaments.';
        }
    })
});