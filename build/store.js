'use strict';

var baseURL = '/wp-json/wp/v2/';
var store = new Vuex.Store({
    strict: true,
    state: {
        touapi: [],
        detail: [],
        event_stats: [],
        players: [],
        result_data: [],
        total_players: null,
        error: '',
        loading: true,
        currentPage: null,
        WPtotal: null,
        WPpages: null,
        category: '',
        parentslug: '',
        event_title: '',
        tourney_title: '',
        logo_url: '',
        total_rounds: null,
        showstats: false
    },
    getters: {
        SHOWSTATS: function SHOWSTATS(state) {
            return state.showstats;
        },
        TOUAPI: function TOUAPI(state) {
            return state.touapi;
        },
        DETAIL: function DETAIL(state) {
            return state.detail;
        },
        EVENTSTATS: function EVENTSTATS(state) {
            return state.event_stats;
        },
        PLAYERS: function PLAYERS(state) {
            return state.players;
        },
        TOTALPLAYERS: function TOTALPLAYERS(state) {
            return state.total_players;
        },
        RESULTDATA: function RESULTDATA(state) {
            return state.result_data;
        },
        ERROR: function ERROR(state) {
            return state.error;
        },
        LOADING: function LOADING(state) {
            return state.loading;
        },
        CURRPAGE: function CURRPAGE(state) {
            return state.currentPage;
        },
        WPTOTAL: function WPTOTAL(state) {
            return state.WPtotal;
        },
        WPPAGES: function WPPAGES(state) {
            return state.WPpages;
        },
        CATEGORY: function CATEGORY(state) {
            return state.category;
        },
        TOTAL_ROUNDS: function TOTAL_ROUNDS(state) {
            return state.total_rounds;
        },
        PARENTSLUG: function PARENTSLUG(state) {
            return state.parentslug;
        },
        EVENT_TITLE: function EVENT_TITLE(state) {
            return state.event_title;
        },
        TOURNEY_TITLE: function TOURNEY_TITLE(state) {
            return state.tourney_title;
        },
        LOGO_URL: function LOGO_URL(state) {
            return state.logo_url;
        }
    },
    mutations: {
        SET_SHOWSTATS: function SET_SHOWSTATS(state, payload) {
            state.showstats = payload;
        },
        SET_TOUDATA: function SET_TOUDATA(state, payload) {
            state.touapi = payload;
        },
        SET_EVENTDETAIL: function SET_EVENTDETAIL(state, payload) {
            state.detail = payload;
        },
        SET_WP_CONSTANTS: function SET_WP_CONSTANTS(state, payload) {
            state.WPpages = payload['x-wp-totalpages'];
            state.WPtotal = payload['x-wp-total'];
        },
        SET_PLAYERS: function SET_PLAYERS(state, payload) {
            var a = payload.map(function (val, index, key) {
                // console.log(key[index]['post_title']);
                key[index]['tou_no'] = index + 1;
                return val;
            });
            state.total_players = payload.length;
            state.players = a;
        },
        SET_RESULT: function SET_RESULT(state, payload) {
            state.result_data = payload;
        },
        SET_EVENTSTATS: function SET_EVENTSTATS(state, payload) {
            state.event_stats = payload;
        },
        SET_CURRPAGE: function SET_CURRPAGE(state, payload) {
            state.currentPage = payload;
        },
        SET_ERROR: function SET_ERROR(state, payload) {
            state.error = payload;
        },
        SET_LOADING: function SET_LOADING(state, payload) {
            state.loading = payload;
        },
        SET_TOTAL_ROUNDS: function SET_TOTAL_ROUNDS(state, payload) {
            state.total_rounds = payload;
        },
        SET_CATEGORY: function SET_CATEGORY(state, payload) {
            state.category = payload;
        },
        SET_TOURNEY_TITLE: function SET_TOURNEY_TITLE(state, payload) {
            state.tourney_title = payload;
        },
        SET_PARENTSLUG: function SET_PARENTSLUG(state, payload) {
            state.parentslug = payload;
        },
        SET_EVENT_TITLE: function SET_EVENT_TITLE(state, payload) {
            state.event_title = payload;
        },
        SET_LOGO_URL: function SET_LOGO_URL(state, payload) {
            state.logo_url = payload;
        }

    },
    actions: {
        FETCH_API: function FETCH_API(context, payload) {
            context.commit('SET_LOADING', true);
            var url = baseURL + 'tournament';
            axios.get(url, { params: { page: payload } }).then(function (response) {
                var headers = response.headers;
                //var data = response.data;
                var data = response.data.map(function (data) {
                    // Format and assign Tournament start date into a variable
                    var startDate = data.start_date;
                    data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                    return data;
                });
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_TOUDATA', data);
                context.commit('SET_CURRPAGE', payload);
                context.commit('SET_LOADING', false);
            }).catch(function (error) {
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', error.toString());
            });
        },
        FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
            context.commit('SET_LOADING', true);
            var url = baseURL + 'tournament';
            axios.get(url, { params: { slug: payload } }).then(function (response) {
                var headers = response.headers;
                var data = response.data[0];
                var startDate = data.start_date;
                data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_EVENTDETAIL', data);
                context.commit('SET_LOADING', false);
            }).catch(function (error) {
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', error.toString());
            });
        },

        FETCH_DATA: function FETCH_DATA(context, payload) {
            context.commit('SET_LOADING', true);
            var url = baseURL + 't_data';
            axios.get(url, { params: { slug: payload } }).then(function (response) {
                var data = response.data[0];
                var players = data.players;
                var results = JSON.parse(data.results);
                var category = data.event_category[0].name;
                var logo = data.tourney[0].event_logo.guid;
                var tourney_title = data.tourney[0].post_title;
                // console.log(data.tourney[0]);
                var parent_slug = data.tourney[0].post_name;
                var event_title = tourney_title + " (" + category + ")";
                var total_rounds = results.length;
                context.commit('SET_EVENTSTATS', data.tourney);
                context.commit('SET_PLAYERS', players);
                context.commit('SET_RESULT', results);
                context.commit('SET_CATEGORY', category);
                context.commit('SET_LOGO_URL', logo);
                context.commit('SET_TOURNEY_TITLE', tourney_title);
                context.commit('SET_EVENT_TITLE', event_title);
                context.commit('SET_TOTAL_ROUNDS', total_rounds);
                context.commit('SET_PARENTSLUG', parent_slug);
                context.commit('SET_LOADING', false);
            }).catch(function (error) {
                context.commit('SET_ERROR', error.toString());
                context.commit('SET_LOADING', false);
            });
        },
        SET_PLAYERS_RESULTS: function SET_PLAYERS_RESULTS(context, payload) {
            var players = payload.players;
            var results = payload.results;
            setTimeout(function () {
                context.commit('SET_PLAYERS', players);
                context.commit('SET_RESULT', results);
            }, 1000);
        }
        //  plugins: [vuexLocal.plugin],
    }
});

// export default store;