'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var baseURL = '/wp-json/wp/v2/';
var store = new Vuex.Store({
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
    showstats: false,
    player_last_rd_data: [],
    playerdata: [],
    player: null,
    player_stats: {}
  },
  getters: {
    PLAYER_STATS: function PLAYER_STATS(state) {
      return state.player_stats;
    },
    LASTRDDATA: function LASTRDDATA(state) {
      return state.player_last_rd_data;
    },
    PLAYERDATA: function PLAYERDATA(state) {
      return state.playerdata;
    },
    PLAYER: function PLAYER(state) {
      return state.player;
    },
    SHOWSTATS: function SHOWSTATS(state) {
      return state.showstats;
    },
    TOUAPI: function TOUAPI(state) {
      return state.touapi;
    },
    TOUACCESSTIME: function TOUACCESSTIME(state) {
      return state.touaccesstime;
    },
    DETAIL: function DETAIL(state) {
      return state.detail;
    },
    LASTDETAILACCESS: function LASTDETAILACCESS(state) {
      return state.lastdetailaccess;
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
    FINAL_ROUND_STATS: function FINAL_ROUND_STATS(state) {
      return state.final_round_stats;
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
    ONGOING_TOURNEY: function ONGOING_TOURNEY(state) {
      return state.ongoing;
    },
    LOGO_URL: function LOGO_URL(state) {
      return state.logo_url;
    }
  },
  mutations: {
    SET_SHOWSTATS: function SET_SHOWSTATS(state, payload) {
      state.showstats = payload;
    },
    SET_FINAL_RD_STATS: function SET_FINAL_RD_STATS(state, resultstats) {
      var len = resultstats.length;
      if (len > 1) {
        state.final_round_stats = _.last(resultstats);
      }
    },
    SET_TOUDATA: function SET_TOUDATA(state, payload) {
      state.touapi = payload;
    },
    SET_EVENTDETAIL: function SET_EVENTDETAIL(state, payload) {
      state.detail = payload;
    },
    SET_LAST_ACCESS_TIME: function SET_LAST_ACCESS_TIME(state, payload) {
      state.touaccesstime = payload;
    },
    SET_DETAIL_LAST_ACCESS_TIME: function SET_DETAIL_LAST_ACCESS_TIME(state, payload) {
      state.lastdetailaccess = payload;
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
    SET_ONGOING: function SET_ONGOING(state, payload) {
      state.ongoing = payload;
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
    },
    COMPUTE_PLAYER_STATS: function COMPUTE_PLAYER_STATS(state, payload) {
      var len = state.result_data.length;
      var lastround = state.result_data[len - 1];
      var player = state.player = _.filter(state.players, { id: payload });
      var name = _.map(player, 'post_title') + ''; // convert to string
      var player_tno = parseInt(_.map(player, 'tou_no'));
      state.player_last_rd_data = _.find(lastround, { pno: player_tno });

      var pdata = state.playerdata = _.chain(state.result_data).map(function (m) {
        return _.filter(m, { pno: player_tno });
      }).value();

      var allScores = state.player_stats.allScores = _.chain(pdata).map(function (m) {
        var scores = _.flattenDeep(_.map(m, 'score'));
        return scores;
      }).value();

      var allOppScores = state.player_stats.allOppScores = _.chain(pdata).map(function (m) {
        var oppscores = _.flattenDeep(_.map(m, 'oppo_score'));
        return oppscores;
      }).value();

      state.player_stats.allRanks = _.chain(pdata).map(function (m) {
        var r = _.flattenDeep(_.map(m, 'position'));
        return r;
      }).value();

      var pHiScore = state.player_stats.pHiScore = _.maxBy(allScores) + '';
      var pLoScore = state.player_stats.pLoScore = _.minBy(allScores) + '';

      state.player_stats.pHiOppScore = _.maxBy(allOppScores) + '';
      state.player_stats.pLoOppScore = _.minBy(allOppScores) + '';

      var pHiScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pHiScore);
      }, undefined), 'round');
      var pLoScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pLoScore);
      }, undefined), 'round');

      state.player_stats.pHiScoreRounds = pHiScoreRounds.join();
      state.player_stats.pLoScoreRounds = pLoScoreRounds.join();

      var pRbyR = _.map(pdata, function (t) {
        return _.map(t, function (l) {
          var result = '';
          if (l.result === 'win') {
            result = 'won';
          } else if (l.result === 'awaiting') {
            result = 'AR';
          } else {
            result = 'lost';
          }
          var starting = 'replying';
          if (l.start == 'y') {
            starting = 'starting';
          }
          if (result == 'AR') {
            l.report = 'In round ' + l.round + ' ' + name + '<em v-if="l.start">, (' + starting + ')</em> is playing <strong>' + l.oppo + '</strong>. Results are being awaited';
          } else {
            l.report = 'In round ' + l.round + ' ' + name + '<em v-if="l.start">, (' + starting + ')</em> played <strong>' + l.oppo + '</strong> and ' + result + ' <em>' + l.score + ' - ' + l.oppo_score + '</em> a difference of ' + l.diff + '. <span class="summary"><em>' + name + '</em> is ranked <strong>' + l.position + '</strong> with <strong>' + l.points + '</strong> points and a cumulative spread of ' + l.margin + ' </span>';
          }
          return l;
        });
      });
      state.player_stats.pRbyR = _.flattenDeep(pRbyR);

      var allWins = _.map(_.filter(_.flattenDeep(pdata), function (p) {
        return 'win' == p.result;
      }));

      state.player_stats.startWins = _.filter(allWins, ['start', 'y']).length;
      state.player_stats.replyWins = _.filter(allWins, ['start', 'n']).length;
      var starts = _.map(_.filter(_.flattenDeep(pdata), function (p) {
        if (p.start == 'y') {
          return p;
        }
      }));

      state.player_stats.starts = starts.length;
      state.player_stats.replies = state.total_rounds - starts.length;

      console.log('-----------Starts Count-------------------');
      console.log(starts.length);
      console.log('-----------Starts Win Count-------------------');
      console.log(state.player_stats.startWins);
      console.log('-----------Replies Count ---------------------');
      console.log(state.total_rounds - starts.length);
      console.log('-----------Reply Win Count ----------------------');
      console.log(state.player_stats.replyWins);
    }
  },
  actions: {
    DO_STATS: function DO_STATS(context, payload) {
      context.commit('SET_SHOWSTATS', payload);
    },

    FETCH_API: function FETCH_API(context, payload) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url, headers, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = baseURL + 'tournament';
                _context.next = 4;
                return axios.get(url, { params: { page: payload } });

              case 4:
                try {
                  headers = response.headers;
                  //let data = response.data;

                  data = response.data.map(function (data) {
                    // Format and assign Tournament start date into a letiable
                    var startDate = data.start_date;
                    data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                    return data;
                  });
                  //console.log(moment(headers.date));

                  context.commit('SET_LAST_ACCESS_TIME', headers.date);
                  context.commit('SET_WP_CONSTANTS', headers);
                  context.commit('SET_TOUDATA', data);
                  context.commit('SET_CURRPAGE', payload);
                  context.commit('SET_LOADING', false);
                } catch (error) {
                  context.commit('SET_LOADING', false);
                  context.commit('SET_ERROR', error.toString());
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    },
    FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var url, _response, headers, data, startDate;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = baseURL + 'tournament';
                _context2.prev = 2;
                _context2.next = 5;
                return axios.get(url, { params: { slug: payload } });

              case 5:
                _response = _context2.sent;
                headers = _response.headers;
                data = _response.data[0];
                startDate = data.start_date;

                data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_DETAIL_LAST_ACCESS_TIME', headers.date);
                context.commit('SET_EVENTDETAIL', data);
                context.commit('SET_LOADING', false);
                _context2.next = 20;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2['catch'](2);

                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', _context2.t0.toString());

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[2, 16]]);
      }))();
    },
    FETCH_DATA: function FETCH_DATA(context, payload) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var url, _response2, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = baseURL + 't_data';

                try {
                  _response2 = axios.get(url, { params: { slug: payload } });
                  data = _response2.data[0];
                  players = data.players;
                  results = JSON.parse(data.results);
                  category = data.event_category[0].name;
                  logo = data.tourney[0].event_logo.guid;
                  tourney_title = data.tourney[0].post_title;
                  // console.log(data.tourney[0]);

                  parent_slug = data.tourney[0].post_name;
                  event_title = tourney_title + ' (' + category + ')';
                  total_rounds = results.length;

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
                } catch (error) {
                  context.commit('SET_ERROR', error.toString());
                  context.commit('SET_LOADING', false);
                };

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }))();
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