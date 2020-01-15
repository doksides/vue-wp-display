export { store as default };

import { baseURL, authURL, profileURL, statsURL } from './config.js'
const store = new Vuex.Store({
  strict: true,
  state: {
    touapi: [],
    touaccesstime: '',
    detail: [],
    lastdetailaccess: '',
    event_stats: [],
    players: [],
    result_data: [],
    total_players: null,
    error: '',
    loading: true,
    login_loading: false,
    login_success: false,
    accessToken: localStorage.getItem('t_token') || '',
    user_data: localStorage.getItem('t_user') || '',
    ongoing: false,
    currentPage: null,
    WPtotal: null,
    WPpages: null,
    category: '',
    parentslug: '',
    event_title: '',
    tourney_title: '',
    logo_url: '',
    total_rounds: null,
    final_round_stats: [],
    rating_stats: [],
    showstats: false,
    player_last_rd_data: [],
    playerdata: [],
    player: null,
    all_players: [],
    all_players_tou_data:[],
    player_stats: [],
  },
  getters: {
    PLAYER_STATS: state => state.player_stats,
    LASTRDDATA: state => state.player_last_rd_data,
    PLAYERDATA: state => state.playerdata,
    PLAYER: state => state.player,
    ALL_PLAYERS: state => state.all_players,
    ALL_PLAYERS_TOU_DATA: state => state.all_players_tou_data,
    SHOWSTATS: state => state.showstats,
    TOUAPI: state => state.touapi,
    TOUACCESSTIME: state => state.touaccesstime,
    DETAIL: state => state.detail,
    LASTDETAILACCESS: state => state.lastdetailaccess,
    EVENTSTATS: state => state.event_stats,
    PLAYERS: state => state.players,
    TOTALPLAYERS: state => state.total_players,
    RESULTDATA: state => state.result_data,
    RATING_STATS: state => state.rating_stats,
    ERROR: state => state.error,
    LOADING: state => state.loading,
    ACCESS_TOKEN: state => state.accessToken,
    USER: state => JSON.parse(state.user_data),
    LOGIN_LOADING: state => state.login_loading,
    LOGIN_SUCCESS: state => state.login_success,
    CURRPAGE: state => state.currentPage,
    WPTOTAL: state => state.WPtotal,
    WPPAGES: state => state.WPpages,
    CATEGORY: state => state.category,
    TOTAL_ROUNDS: state => state.total_rounds,
    FINAL_ROUND_STATS: state => state.final_round_stats,
    PARENTSLUG: state => state.parentslug,
    EVENT_TITLE: state => state.event_title,
    TOURNEY_TITLE: state => state.tourney_title,
    ONGOING_TOURNEY: state => state.ongoing,
    LOGO_URL: state => state.logo_url,
  },
  mutations: {
    SET_SHOWSTATS: (state, payload) => {
      state.showstats = payload;
    },
    SET_FINAL_RD_STATS: (state, resultstats) => {
      let len = resultstats.length;
      if (len > 1) {
        state.final_round_stats = _.last(resultstats);
      }
    },
    SET_TOUDATA: (state, payload) => {
      state.touapi = payload;
    },
    SET_EVENTDETAIL: (state, payload) => {
      state.detail = payload;
    },
    SET_LAST_ACCESS_TIME: (state, payload) => {
      state.touaccesstime = payload;
    },
    SET_DETAIL_LAST_ACCESS_TIME: (state, payload) => {
      state.lastdetailaccess = payload;
    },
    SET_WP_CONSTANTS: (state, payload) => {
      state.WPpages = payload['x-wp-totalpages'];
      state.WPtotal = payload['x-wp-total'];
    },
    SET_PLAYERS: (state, payload) => {
      let a = payload.map(function (val, index, key) {
        // console.log(key[index]['post_title']);
        key[index]['tou_no'] = index + 1;
        return val;
      });
      state.total_players = payload.length;
      state.players = a;
    },
    SET_ALL_PLAYERS: (state, payload) => {
      state.all_players = payload;
    },
    SET_ALL_PLAYERS_TOU_DATA: (state, payload) => {
      state.all_players_tou_data.push(payload);
    },
    SET_RATING_STATS: (state, payload) => {
      state.rating_stats = payload;
    },
    SET_RESULT: (state, payload) => {
      let p = state.players;
      let r = _.map(payload, function (z) {
        return _.map(z, function (o) {
          let i = o.pno - 1;
          o.photo = p[i].photo;
          o.id = p[i].id;
          o.country = p[i].country;
          o.country = p[i].country;
          o.country_full = p[i].country_full;
          o.gender = p[i].gender;
          o.is_team = p[i].is_team;
          let x = o.oppo_no - 1;
          o.opp_photo = p[x].photo;
          o.opp_id = p[x].id;
          return o;
        })
      });
      // console.log(r);
      state.result_data = r;
    },
    SET_ONGOING: (state, payload) => {
      state.ongoing = payload;
    },
    SET_EVENTSTATS: (state, payload) => {
      state.event_stats = payload;
    },
    SET_CURRPAGE: (state, payload) => {
      state.currentPage = payload;
    },
    SET_ERROR: (state, payload) => {
      state.error = payload;
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload;
    },
    SET_USER_DATA: (state, payload) => {
      state.user_data = payload;
    },
    SET_LOGIN_SUCCESS: (state, payload) => {
      state.login_success = payload;
    },
    SET_LOGIN_LOADING: (state, payload) => {
      state.login_loading = payload;
    },
    SET_TOTAL_ROUNDS: (state, payload) => {
      state.total_rounds = payload;
    },
    SET_CATEGORY: (state, payload) => {
      state.category = payload;
    },
    SET_TOURNEY_TITLE: (state, payload) => {
      state.tourney_title = payload;
    },
    SET_PARENTSLUG: (state, payload) => {
      state.parentslug = payload;
    },
    SET_EVENT_TITLE: (state, payload) => {
      state.event_title = payload;
    },
    SET_LOGO_URL: (state, payload) => {
      state.logo_url = payload;
    },
    //
    COMPUTE_PLAYER_STATS: (state, payload) => {
      let len = state.result_data.length;
      let lastround = state.result_data[len - 1];
      let player = (state.player = _.filter(state.players, { id: payload }));
      let name = _.map(player, 'post_title') + ''; // convert to string
      let player_tno = parseInt(_.map(player, 'tou_no'));
      state.player_last_rd_data = _.find(lastround, { pno: player_tno });

      let pdata = (state.playerdata = _.chain(state.result_data)
        .map(function (m) {
          return _.filter(m, { pno: player_tno });
        })
        .value());

      let allScores = (state.player_stats.allScores = _.chain(pdata)
        .map(function (m) {
          let scores = _.flattenDeep(_.map(m, 'score'));
          return scores;
        })
        .value());

      let allOppScores = (state.player_stats.allOppScores = _.chain(pdata)
        .map(function (m) {
          let oppscores = _.flattenDeep(_.map(m, 'oppo_score'));
          return oppscores;
        })
        .value());

      state.player_stats.allRanks = _.chain(pdata)
        .map(function (m) {
          let r = _.flattenDeep(_.map(m, 'position'));
          return r;
        })
        .value();

      let pHiScore = (state.player_stats.pHiScore = _.maxBy(allScores) + '');
      let pLoScore = (state.player_stats.pLoScore = _.minBy(allScores) + '');

      state.player_stats.pHiOppScore = _.maxBy(allOppScores) + '';
      state.player_stats.pLoOppScore = _.minBy(allOppScores) + '';

      let pHiScoreRounds = _.map(
        _.filter(
          _.flattenDeep(pdata),
          function (d) {
            return d.score == parseInt(pHiScore);
          },
          this
        ),
        'round'
      );
      let pLoScoreRounds = _.map(
        _.filter(
          _.flattenDeep(pdata),
          function (d) {
            return d.score == parseInt(pLoScore);
          },
          this
        ),
        'round'
      );

      state.player_stats.pHiScoreRounds = pHiScoreRounds.join();
      state.player_stats.pLoScoreRounds = pLoScoreRounds.join();

      let pRbyR = _.map(pdata, function (t) {
        return _.map(t, function (l) {
          let result = '';
          if (l.result === 'win') {
            result = 'won';
          } else if (l.result === 'awaiting') {
            result = 'AR';
          } else if (l.result === 'draw') {
            result = 'drew';
          } else {
            result = 'lost';
          }
          let starting = 'replying';
          if (l.start == 'y') {
            starting = 'starting';
          }
          if (result == 'AR') {
            l.report =
              'In round ' +
              l.round +
              ' ' +
              name +
              '<em v-if="l.start">, (' +
              starting +
              ')</em> is playing <strong>' +
              l.oppo +
              '</strong>. Results are being awaited';
          } else {
            l.report =
              'In round ' + l.round + ' ' +
              name + '<em v-if="l.start">, (' + starting +
              ')</em> played <strong>' + l.oppo +
              '</strong> and ' + result +
              ' <em>' + l.score + ' - ' +
              l.oppo_score + ',</em> a difference of ' +
              l.diff + '. <span class="summary"><em>' +
              name + '</em> is ranked <strong>' + l.position +
              '</strong> with <strong>' + l.points +
              '</strong> points and a cumulative spread of ' +
              l.margin + ' </span>';
          }
          return l;
        });
      });
      state.player_stats.pRbyR = _.flattenDeep(pRbyR);

      let allWins = _.map(
        _.filter(_.flattenDeep(pdata), function (p) {
          return 'win' == p.result;
        })
      );

      state.player_stats.startWins = _.filter(allWins, ['start', 'y']).length;
      state.player_stats.replyWins = _.filter(allWins, ['start', 'n']).length;
      let starts = _.map(
        _.filter(_.flattenDeep(pdata), function (p) {
          if (p.start == 'y') {
            return p;
          }
        })
      );

      state.player_stats.starts = starts.length;
      state.player_stats.replies = state.total_rounds - starts.length;
    },
  },
  actions: {
    DO_STATS: (context, payload) => {
      context.commit('SET_SHOWSTATS', payload);
    },
    async AUTH_TOKEN(context, payload) {
      let url = `${authURL}token/validate`;
      //let url = postURL;
      payload = JSON.parse(payload);
      try {
       let response = await axios.post(url,
        {
          title: 'Plius Alittle test API Posting',
          content: 'Another minor Post from WP API',
          status: 'publish'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer  ${payload}`
          }
         })
        let res = response.data;
        // console.log(res);
        if (res.code == "jwt_auth_valid_token") {
          context.commit('SET_LOGIN_SUCCESS', true);
        }
      } catch (err) {
        context.commit('SET_LOGIN_SUCCESS', false);
        context.commit('SET_ERROR', err.toString());
      }
    },
    async DO_LOGIN(context, payload) {
      context.commit('SET_LOGIN_LOADING', true);
      let url = `${authURL}token`;
      let response = await axios.post(url, {
        username: payload.user,
        password: payload.pass
      })
      try {
        let data = response.data;
        if (data.token) {
          localStorage.setItem('t_token', JSON.stringify(data.token))
          localStorage.setItem('t_user', JSON.stringify(data.user_display_name))
          console.log(data);
          context.commit('SET_LOGIN_LOADING', false);
          context.commit('SET_LOGIN_SUCCESS', true);
        } else {
          context.commit('SET_LOGIN_LOADING', false);
          context.commit('SET_LOGIN_SUCCESS', false);
        }
      }
      catch (err) {
        context.commit('SET_LOGIN_LOADING', false);
        context.commit('SET_LOGIN_SUCCESS', false);
        context.commit('SET_ERROR', err.message.toString());
      }

    },
    async GET_ALL_PLAYERS(context, payload) {
      let url = `${profileURL}`;
      let response = await axios
        .get( url, {
          //params: { page: payload },
          // headers: {'Authorization': `Bearer  ${token}`}
        })
      try {
        let r = response.data
        let data = _.map(r, function (d) {
          d.country = d.country.toLowerCase();
          d.gender = d.gender.toLowerCase();
         return d;
        })
        context.commit('SET_ALL_PLAYERS', data);
       } catch (e) {
        context.commit('SET_ERROR', e.toString());
       }
    },
    async GET_PLAYER_TOU_DATA(context, payload) {
      let url = `${statsURL}${payload}`;
      let response = await axios
        .get( url, {
          //params: { page: payload },
          // headers: {'Authorization': `Bearer  ${token}`}
        })
      try {
        let data = response.data
        data.country = data.country.toLowerCase();
        data.gender = data.gender.toLowerCase();
        context.commit('SET_ALL_PLAYERS_TOU_DATA', data);
       } catch (e) {
        context.commit('SET_ERROR', e.toString());
       }
    },
    async FETCH_API (context, payload)  {
      context.commit('SET_LOADING', true);
      let url = `${baseURL}tournament`;
      // let token = context.getters.ACCESS_TOKEN
      let response = await axios
        .get(url, {
          params: { page: payload },
          // headers: {'Authorization': `Bearer  ${token}`}
        })
         try {
           let headers = response.headers;
          //  console.log('Getting lists of tournaments');
          let data = response.data.map(data => {
            // Format and assign Tournament start date into a letiable
            let startDate = data.start_date;
            data.start_date = moment(new Date(startDate)).format(
              'dddd, MMMM Do YYYY'
            );
            return data;
          });
          //console.log(moment(headers.date));
          console.log("%c" + moment(headers.date), "font-size:30px;color:green;");
          context.commit('SET_LAST_ACCESS_TIME', headers.date);
          context.commit('SET_WP_CONSTANTS', headers);
          context.commit('SET_TOUDATA', data);
          context.commit('SET_CURRPAGE', payload);
          context.commit('SET_LOADING', false);
        }
        catch(error) {
          context.commit('SET_LOADING', false);
          context.commit('SET_ERROR', error.toString());
        }
    },
    async FETCH_DETAIL (context, payload) {
      context.commit('SET_LOADING', true);
      let url = `${baseURL}tournament`;
      try {
        let response = await axios.get(url, { params: { slug: payload } });
         let headers = response.headers;
         let data = response.data[0];
         let startDate = data.start_date;
         data.start_date = moment(new Date(startDate)).format(
           'dddd, MMMM Do YYYY');
         context.commit('SET_WP_CONSTANTS', headers);
         context.commit('SET_DETAIL_LAST_ACCESS_TIME', headers.date);
         context.commit('SET_EVENTDETAIL', data);
         context.commit('SET_LOADING', false);
       } catch (error) {
         context.commit('SET_LOADING', false);
         context.commit('SET_ERROR', error.toString());
       }

    },
    async FETCH_DATA (context, payload) {
      context.commit('SET_LOADING', true);
      // console.log(context);
      let url = `${baseURL}t_data`;
      try {
        let response = await axios.get(url, { params: { slug: payload } })
        let data = response.data[0];
        let players = data.players;
        let results = JSON.parse(data.results);

        // console.log('FETCH DATA $store')
        // console.log(data);
        let category = data.event_category[0].name.toLowerCase();
        let logo = data.tourney[0].event_logo.guid;
        let tourney_title = data.tourney[0].post_title;
        let parent_slug = data.tourney[0].post_name;
        let event_title = tourney_title + ' (' + category + ')';
        let total_rounds = results.length;
        context.commit('SET_EVENTSTATS', data.tourney);
        context.commit('SET_ONGOING', data.ongoing);
        context.commit('SET_PLAYERS', players);
        context.commit('SET_RESULT', results);
        let rating_stats = null;
        if (data.stats_json) {
          rating_stats = JSON.parse(data.stats_json);
        }
        context.commit('SET_RATING_STATS', rating_stats);
        context.commit('SET_FINAL_RD_STATS', results);
        context.commit('SET_CATEGORY', category);
        context.commit('SET_LOGO_URL', logo);
        context.commit('SET_TOURNEY_TITLE', tourney_title);
        context.commit('SET_EVENT_TITLE', event_title);
        context.commit('SET_TOTAL_ROUNDS', total_rounds);
        context.commit('SET_PARENTSLUG', parent_slug);
        context.commit('SET_LOADING', false);
      }
      catch (error)
      {
        context.commit('SET_ERROR', error.toString());
        context.commit('SET_LOADING', false);
      };
    },
    FETCH_RESDATA (context, payload) {
      context.commit('SET_LOADING', true);
          let url = `${baseURL}t_data`;
          axios.get(url, { params: { slug: payload } }).then(response=>{
          let data = response.data[0];
          let players = data.players;
          let results = JSON.parse(data.results);
          let category = data.event_category[0].name.toLowerCase();
          let logo = data.tourney[0].event_logo.guid;
          let tourney_title = data.tourney[0].post_title;
          let parent_slug = data.tourney[0].post_name;
          let event_title = tourney_title + ' (' + category + ')';
          let total_rounds = results.length;
          context.commit('SET_EVENTSTATS', data.tourney);
          context.commit('SET_ONGOING', data.ongoing);
          context.commit('SET_PLAYERS', players);
          context.commit('SET_RESULT', results);
          context.commit('SET_FINAL_RD_STATS', results);
          context.commit('SET_CATEGORY', category);
          context.commit('SET_LOGO_URL', logo);
          context.commit('SET_TOURNEY_TITLE', tourney_title);
          context.commit('SET_EVENT_TITLE', event_title);
          context.commit('SET_TOTAL_ROUNDS', total_rounds);
          context.commit('SET_PARENTSLUG', parent_slug);
          context.commit('SET_LOADING', false);
          }).catch(error =>{
          context.commit('SET_ERROR', error.toString());
          console.log(error);
          context.commit('SET_LOADING', false);
        });
    }
  },
});

// export default store;
