(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _this = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

      var player = state.player = _.filter(state.players, {
        id: payload
      });

      var name = _.map(player, 'post_title') + ''; // convert to string

      var player_tno = parseInt(_.map(player, 'tou_no'));
      state.player_last_rd_data = _.find(lastround, {
        pno: player_tno
      });

      var pdata = state.playerdata = _.chain(state.result_data).map(function (m) {
        return _.filter(m, {
          pno: player_tno
        });
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
      }, _this), 'round');

      var pLoScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pLoScore);
      }, _this), 'round');

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
      return _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var url, response, headers, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(baseURL, "tournament");
                _context.next = 4;
                return axios.get(url, {
                  params: {
                    page: payload
                  }
                });

              case 4:
                response = _context.sent;

                try {
                  headers = response.headers;
                  console.log('Getting lists of tournaments');
                  data = response.data.map(function (data) {
                    // Format and assign Tournament start date into a letiable
                    var startDate = data.start_date;
                    data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                    return data;
                  }); //console.log(moment(headers.date));

                  console.log("%c" + moment(headers.date), "font-size:30px;color:green;");
                  context.commit('SET_LAST_ACCESS_TIME', headers.date);
                  context.commit('SET_WP_CONSTANTS', headers);
                  context.commit('SET_TOUDATA', data);
                  context.commit('SET_CURRPAGE', payload);
                  context.commit('SET_LOADING', false);
                } catch (error) {
                  context.commit('SET_LOADING', false);
                  context.commit('SET_ERROR', error.toString());
                }

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
      return _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var url, response, headers, data, startDate;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(baseURL, "tournament");
                _context2.prev = 2;
                _context2.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context2.sent;
                headers = response.headers;
                data = response.data[0];
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
                _context2.t0 = _context2["catch"](2);
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', _context2.t0.toString());

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 16]]);
      }))();
    },
    FETCH_DATA: function FETCH_DATA(context, payload) {
      return _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var url, response, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(baseURL, "t_data");

                try {
                  response = axios.get(url, {
                    params: {
                      slug: payload
                    }
                  });
                  data = response.data[0];
                  players = data.players;
                  results = JSON.parse(data.results);
                  category = data.event_category[0].name;
                  logo = data.tourney[0].event_logo.guid;
                  tourney_title = data.tourney[0].post_title; // console.log(data.tourney[0]);

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
                }

                ;

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    SET_PLAYERS_RESULTS: function SET_PLAYERS_RESULTS(context, payload) {
      var players = payload.players;
      var results = payload.results;
      setTimeout(function () {
        context.commit('SET_PLAYERS', players);
        context.commit('SET_RESULT', results);
      }, 1000);
    } //  plugins: [vuexLocal.plugin],

  }
}); // export default store;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBLElBQU0sT0FBTyxHQUFHLGlCQUFoQjtBQUNBLElBQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQVQsQ0FBZTtBQUMzQixFQUFBLE1BQU0sRUFBRSxJQURtQjtBQUUzQixFQUFBLEtBQUssRUFBRTtBQUNMLElBQUEsTUFBTSxFQUFFLEVBREg7QUFFTCxJQUFBLGFBQWEsRUFBRSxFQUZWO0FBR0wsSUFBQSxNQUFNLEVBQUUsRUFISDtBQUlMLElBQUEsZ0JBQWdCLEVBQUUsRUFKYjtBQUtMLElBQUEsV0FBVyxFQUFFLEVBTFI7QUFNTCxJQUFBLE9BQU8sRUFBRSxFQU5KO0FBT0wsSUFBQSxXQUFXLEVBQUUsRUFQUjtBQVFMLElBQUEsYUFBYSxFQUFFLElBUlY7QUFTTCxJQUFBLEtBQUssRUFBRSxFQVRGO0FBVUwsSUFBQSxPQUFPLEVBQUUsSUFWSjtBQVdMLElBQUEsT0FBTyxFQUFFLEtBWEo7QUFZTCxJQUFBLFdBQVcsRUFBRSxJQVpSO0FBYUwsSUFBQSxPQUFPLEVBQUUsSUFiSjtBQWNMLElBQUEsT0FBTyxFQUFFLElBZEo7QUFlTCxJQUFBLFFBQVEsRUFBRSxFQWZMO0FBZ0JMLElBQUEsVUFBVSxFQUFFLEVBaEJQO0FBaUJMLElBQUEsV0FBVyxFQUFFLEVBakJSO0FBa0JMLElBQUEsYUFBYSxFQUFFLEVBbEJWO0FBbUJMLElBQUEsUUFBUSxFQUFFLEVBbkJMO0FBb0JMLElBQUEsWUFBWSxFQUFFLElBcEJUO0FBcUJMLElBQUEsaUJBQWlCLEVBQUUsRUFyQmQ7QUFzQkwsSUFBQSxTQUFTLEVBQUUsS0F0Qk47QUF1QkwsSUFBQSxtQkFBbUIsRUFBRSxFQXZCaEI7QUF3QkwsSUFBQSxVQUFVLEVBQUUsRUF4QlA7QUF5QkwsSUFBQSxNQUFNLEVBQUUsSUF6Qkg7QUEwQkwsSUFBQSxZQUFZLEVBQUU7QUExQlQsR0FGb0I7QUE4QjNCLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxZQUFZLEVBQUUsc0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFlBQVY7QUFBQSxLQURaO0FBRVAsSUFBQSxVQUFVLEVBQUUsb0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLG1CQUFWO0FBQUEsS0FGVjtBQUdQLElBQUEsVUFBVSxFQUFFLG9CQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxVQUFWO0FBQUEsS0FIVjtBQUlQLElBQUEsTUFBTSxFQUFFLGdCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxNQUFWO0FBQUEsS0FKTjtBQUtQLElBQUEsU0FBUyxFQUFFLG1CQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxTQUFWO0FBQUEsS0FMVDtBQU1QLElBQUEsTUFBTSxFQUFFLGdCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxNQUFWO0FBQUEsS0FOTjtBQU9QLElBQUEsYUFBYSxFQUFFLHVCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxhQUFWO0FBQUEsS0FQYjtBQVFQLElBQUEsTUFBTSxFQUFFLGdCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxNQUFWO0FBQUEsS0FSTjtBQVNQLElBQUEsZ0JBQWdCLEVBQUUsMEJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLGdCQUFWO0FBQUEsS0FUaEI7QUFVUCxJQUFBLFVBQVUsRUFBRSxvQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsV0FBVjtBQUFBLEtBVlY7QUFXUCxJQUFBLE9BQU8sRUFBRSxpQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsT0FBVjtBQUFBLEtBWFA7QUFZUCxJQUFBLFlBQVksRUFBRSxzQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsYUFBVjtBQUFBLEtBWlo7QUFhUCxJQUFBLFVBQVUsRUFBRSxvQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsV0FBVjtBQUFBLEtBYlY7QUFjUCxJQUFBLEtBQUssRUFBRSxlQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxLQUFWO0FBQUEsS0FkTDtBQWVQLElBQUEsT0FBTyxFQUFFLGlCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxPQUFWO0FBQUEsS0FmUDtBQWdCUCxJQUFBLFFBQVEsRUFBRSxrQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsV0FBVjtBQUFBLEtBaEJSO0FBaUJQLElBQUEsT0FBTyxFQUFFLGlCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxPQUFWO0FBQUEsS0FqQlA7QUFrQlAsSUFBQSxPQUFPLEVBQUUsaUJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLE9BQVY7QUFBQSxLQWxCUDtBQW1CUCxJQUFBLFFBQVEsRUFBRSxrQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsUUFBVjtBQUFBLEtBbkJSO0FBb0JQLElBQUEsWUFBWSxFQUFFLHNCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxZQUFWO0FBQUEsS0FwQlo7QUFxQlAsSUFBQSxpQkFBaUIsRUFBRSwyQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsaUJBQVY7QUFBQSxLQXJCakI7QUFzQlAsSUFBQSxVQUFVLEVBQUUsb0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFVBQVY7QUFBQSxLQXRCVjtBQXVCUCxJQUFBLFdBQVcsRUFBRSxxQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsV0FBVjtBQUFBLEtBdkJYO0FBd0JQLElBQUEsYUFBYSxFQUFFLHVCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxhQUFWO0FBQUEsS0F4QmI7QUF5QlAsSUFBQSxlQUFlLEVBQUUseUJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLE9BQVY7QUFBQSxLQXpCZjtBQTBCUCxJQUFBLFFBQVEsRUFBRSxrQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsUUFBVjtBQUFBO0FBMUJSLEdBOUJrQjtBQTBEM0IsRUFBQSxTQUFTLEVBQUU7QUFDVCxJQUFBLGFBQWEsRUFBRSx1QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNqQyxNQUFBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE9BQWxCO0FBQ0QsS0FIUTtBQUlULElBQUEsa0JBQWtCLEVBQUUsNEJBQUMsS0FBRCxFQUFRLFdBQVIsRUFBd0I7QUFDMUMsVUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQXRCOztBQUNBLFVBQUksR0FBRyxHQUFHLENBQVYsRUFBYTtBQUNYLFFBQUEsS0FBSyxDQUFDLGlCQUFOLEdBQTBCLENBQUMsQ0FBQyxJQUFGLENBQU8sV0FBUCxDQUExQjtBQUNEO0FBQ0YsS0FUUTtBQVVULElBQUEsV0FBVyxFQUFFLHFCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQy9CLE1BQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxPQUFmO0FBQ0QsS0FaUTtBQWFULElBQUEsZUFBZSxFQUFFLHlCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ25DLE1BQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxPQUFmO0FBQ0QsS0FmUTtBQWdCVCxJQUFBLG9CQUFvQixFQUFFLDhCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3hDLE1BQUEsS0FBSyxDQUFDLGFBQU4sR0FBc0IsT0FBdEI7QUFDRCxLQWxCUTtBQW1CVCxJQUFBLDJCQUEyQixFQUFFLHFDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQy9DLE1BQUEsS0FBSyxDQUFDLGdCQUFOLEdBQXlCLE9BQXpCO0FBQ0QsS0FyQlE7QUFzQlQsSUFBQSxnQkFBZ0IsRUFBRSwwQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNwQyxNQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLE9BQU8sQ0FBQyxpQkFBRCxDQUF2QjtBQUNBLE1BQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsT0FBTyxDQUFDLFlBQUQsQ0FBdkI7QUFDRCxLQXpCUTtBQTBCVCxJQUFBLFdBQVcsRUFBRSxxQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUMvQixVQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBUixDQUFZLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUIsR0FBckIsRUFBMEI7QUFDNUM7QUFDQSxRQUFBLEdBQUcsQ0FBQyxLQUFELENBQUgsQ0FBVyxRQUFYLElBQXVCLEtBQUssR0FBRyxDQUEvQjtBQUNBLGVBQU8sR0FBUDtBQUNELE9BSk8sQ0FBUjtBQUtBLE1BQUEsS0FBSyxDQUFDLGFBQU4sR0FBc0IsT0FBTyxDQUFDLE1BQTlCO0FBQ0EsTUFBQSxLQUFLLENBQUMsT0FBTixHQUFnQixDQUFoQjtBQUNELEtBbENRO0FBbUNULElBQUEsVUFBVSxFQUFFLG9CQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQzlCLE1BQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsT0FBcEI7QUFDRCxLQXJDUTtBQXNDVCxJQUFBLFdBQVcsRUFBRSxxQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUMvQixNQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLE9BQWhCO0FBQ0QsS0F4Q1E7QUF5Q1QsSUFBQSxjQUFjLEVBQUUsd0JBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbEMsTUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixPQUFwQjtBQUNELEtBM0NRO0FBNENULElBQUEsWUFBWSxFQUFFLHNCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2hDLE1BQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsT0FBcEI7QUFDRCxLQTlDUTtBQStDVCxJQUFBLFNBQVMsRUFBRSxtQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUM3QixNQUFBLEtBQUssQ0FBQyxLQUFOLEdBQWMsT0FBZDtBQUNELEtBakRRO0FBa0RULElBQUEsV0FBVyxFQUFFLHFCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQy9CLE1BQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsT0FBaEI7QUFDRCxLQXBEUTtBQXFEVCxJQUFBLGdCQUFnQixFQUFFLDBCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3BDLE1BQUEsS0FBSyxDQUFDLFlBQU4sR0FBcUIsT0FBckI7QUFDRCxLQXZEUTtBQXdEVCxJQUFBLFlBQVksRUFBRSxzQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNoQyxNQUFBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLE9BQWpCO0FBQ0QsS0ExRFE7QUEyRFQsSUFBQSxpQkFBaUIsRUFBRSwyQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNyQyxNQUFBLEtBQUssQ0FBQyxhQUFOLEdBQXNCLE9BQXRCO0FBQ0QsS0E3RFE7QUE4RFQsSUFBQSxjQUFjLEVBQUUsd0JBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbEMsTUFBQSxLQUFLLENBQUMsVUFBTixHQUFtQixPQUFuQjtBQUNELEtBaEVRO0FBaUVULElBQUEsZUFBZSxFQUFFLHlCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ25DLE1BQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsT0FBcEI7QUFDRCxLQW5FUTtBQW9FVCxJQUFBLFlBQVksRUFBRSxzQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNoQyxNQUFBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLE9BQWpCO0FBQ0QsS0F0RVE7QUF1RVQsSUFBQSxvQkFBb0IsRUFBRSw4QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUN4QyxVQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsV0FBTixDQUFrQixNQUE1QjtBQUNBLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFOLENBQWtCLEdBQUcsR0FBRyxDQUF4QixDQUFoQjs7QUFDQSxVQUFJLE1BQU0sR0FBSSxLQUFLLENBQUMsTUFBTixHQUFlLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxDQUFDLE9BQWYsRUFBd0I7QUFBRSxRQUFBLEVBQUUsRUFBRTtBQUFOLE9BQXhCLENBQTdCOztBQUNBLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sTUFBTixFQUFjLFlBQWQsSUFBOEIsRUFBekMsQ0FKd0MsQ0FJSzs7QUFDN0MsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFGLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FBRCxDQUF6QjtBQUNBLE1BQUEsS0FBSyxDQUFDLG1CQUFOLEdBQTRCLENBQUMsQ0FBQyxJQUFGLENBQU8sU0FBUCxFQUFrQjtBQUFFLFFBQUEsR0FBRyxFQUFFO0FBQVAsT0FBbEIsQ0FBNUI7O0FBRUEsVUFBSSxLQUFLLEdBQUksS0FBSyxDQUFDLFVBQU4sR0FBbUIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFLLENBQUMsV0FBZCxFQUM3QixHQUQ2QixDQUN6QixVQUFTLENBQVQsRUFBWTtBQUNmLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVk7QUFBRSxVQUFBLEdBQUcsRUFBRTtBQUFQLFNBQVosQ0FBUDtBQUNELE9BSDZCLEVBSTdCLEtBSjZCLEVBQWhDOztBQU1BLFVBQUksU0FBUyxHQUFJLEtBQUssQ0FBQyxZQUFOLENBQW1CLFNBQW5CLEdBQStCLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixFQUM3QyxHQUQ2QyxDQUN6QyxVQUFTLENBQVQsRUFBWTtBQUNmLFlBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxXQUFGLENBQWMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFOLEVBQVMsT0FBVCxDQUFkLENBQWI7O0FBQ0EsZUFBTyxNQUFQO0FBQ0QsT0FKNkMsRUFLN0MsS0FMNkMsRUFBaEQ7O0FBT0EsVUFBSSxZQUFZLEdBQUksS0FBSyxDQUFDLFlBQU4sQ0FBbUIsWUFBbkIsR0FBa0MsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQ25ELEdBRG1ELENBQy9DLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLENBQU4sRUFBUyxZQUFULENBQWQsQ0FBaEI7O0FBQ0EsZUFBTyxTQUFQO0FBQ0QsT0FKbUQsRUFLbkQsS0FMbUQsRUFBdEQ7O0FBT0EsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixRQUFuQixHQUE4QixDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFDM0IsR0FEMkIsQ0FDdkIsVUFBUyxDQUFULEVBQVk7QUFDZixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBRixDQUFjLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTixFQUFTLFVBQVQsQ0FBZCxDQUFSOztBQUNBLGVBQU8sQ0FBUDtBQUNELE9BSjJCLEVBSzNCLEtBTDJCLEVBQTlCO0FBT0EsVUFBSSxRQUFRLEdBQUksS0FBSyxDQUFDLFlBQU4sQ0FBbUIsUUFBbkIsR0FBOEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFSLElBQXFCLEVBQW5FO0FBQ0EsVUFBSSxRQUFRLEdBQUksS0FBSyxDQUFDLFlBQU4sQ0FBbUIsUUFBbkIsR0FBOEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFSLElBQXFCLEVBQW5FO0FBRUEsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixXQUFuQixHQUFpQyxDQUFDLENBQUMsS0FBRixDQUFRLFlBQVIsSUFBd0IsRUFBekQ7QUFDQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLFdBQW5CLEdBQWlDLENBQUMsQ0FBQyxLQUFGLENBQVEsWUFBUixJQUF3QixFQUF6RDs7QUFFQSxVQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRixDQUNuQixDQUFDLENBQUMsTUFBRixDQUNFLENBQUMsQ0FBQyxXQUFGLENBQWMsS0FBZCxDQURGLEVBRUUsVUFBUyxDQUFULEVBQVk7QUFDVixlQUFPLENBQUMsQ0FBQyxLQUFGLElBQVcsUUFBUSxDQUFDLFFBQUQsQ0FBMUI7QUFDRCxPQUpILEVBS0UsS0FMRixDQURtQixFQVFuQixPQVJtQixDQUFyQjs7QUFVQSxVQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRixDQUNuQixDQUFDLENBQUMsTUFBRixDQUNFLENBQUMsQ0FBQyxXQUFGLENBQWMsS0FBZCxDQURGLEVBRUUsVUFBUyxDQUFULEVBQVk7QUFDVixlQUFPLENBQUMsQ0FBQyxLQUFGLElBQVcsUUFBUSxDQUFDLFFBQUQsQ0FBMUI7QUFDRCxPQUpILEVBS0UsS0FMRixDQURtQixFQVFuQixPQVJtQixDQUFyQjs7QUFXQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLGNBQW5CLEdBQW9DLGNBQWMsQ0FBQyxJQUFmLEVBQXBDO0FBQ0EsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixjQUFuQixHQUFvQyxjQUFjLENBQUMsSUFBZixFQUFwQzs7QUFFQSxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRixDQUFNLEtBQU4sRUFBYSxVQUFTLENBQVQsRUFBWTtBQUNuQyxlQUFPLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTixFQUFTLFVBQVMsQ0FBVCxFQUFZO0FBQzFCLGNBQUksTUFBTSxHQUFHLEVBQWI7O0FBQ0EsY0FBSSxDQUFDLENBQUMsTUFBRixLQUFhLEtBQWpCLEVBQXdCO0FBQ3RCLFlBQUEsTUFBTSxHQUFHLEtBQVQ7QUFDRCxXQUZELE1BRU8sSUFBSSxDQUFDLENBQUMsTUFBRixLQUFhLFVBQWpCLEVBQTZCO0FBQ2xDLFlBQUEsTUFBTSxHQUFHLElBQVQ7QUFDRCxXQUZNLE1BRUE7QUFDTCxZQUFBLE1BQU0sR0FBRyxNQUFUO0FBQ0Q7O0FBQ0QsY0FBSSxRQUFRLEdBQUcsVUFBZjs7QUFDQSxjQUFJLENBQUMsQ0FBQyxLQUFGLElBQVcsR0FBZixFQUFvQjtBQUNsQixZQUFBLFFBQVEsR0FBRyxVQUFYO0FBQ0Q7O0FBQ0QsY0FBSSxNQUFNLElBQUksSUFBZCxFQUFvQjtBQUNsQixZQUFBLENBQUMsQ0FBQyxNQUFGLEdBQ0UsY0FDQSxDQUFDLENBQUMsS0FERixHQUVBLEdBRkEsR0FHQSxJQUhBLEdBSUEsd0JBSkEsR0FLQSxRQUxBLEdBTUEsNEJBTkEsR0FPQSxDQUFDLENBQUMsSUFQRixHQVFBLHNDQVRGO0FBVUQsV0FYRCxNQVdPO0FBQ0wsWUFBQSxDQUFDLENBQUMsTUFBRixHQUNFLGNBQ0EsQ0FBQyxDQUFDLEtBREYsR0FFQSxHQUZBLEdBR0EsSUFIQSxHQUlBLHdCQUpBLEdBS0EsUUFMQSxHQU1BLHdCQU5BLEdBT0EsQ0FBQyxDQUFDLElBUEYsR0FRQSxnQkFSQSxHQVNBLE1BVEEsR0FVQSxPQVZBLEdBV0EsQ0FBQyxDQUFDLEtBWEYsR0FZQSxLQVpBLEdBYUEsQ0FBQyxDQUFDLFVBYkYsR0FjQSx3QkFkQSxHQWVBLENBQUMsQ0FBQyxJQWZGLEdBZ0JBLDhCQWhCQSxHQWlCQSxJQWpCQSxHQWtCQSwwQkFsQkEsR0FtQkEsQ0FBQyxDQUFDLFFBbkJGLEdBb0JBLHlCQXBCQSxHQXFCQSxDQUFDLENBQUMsTUFyQkYsR0FzQkEsOENBdEJBLEdBdUJBLENBQUMsQ0FBQyxNQXZCRixHQXdCQSxVQXpCRjtBQTBCRDs7QUFDRCxpQkFBTyxDQUFQO0FBQ0QsU0FyRE0sQ0FBUDtBQXNERCxPQXZEVyxDQUFaOztBQXdEQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLEtBQW5CLEdBQTJCLENBQUMsQ0FBQyxXQUFGLENBQWMsS0FBZCxDQUEzQjs7QUFFQSxVQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRixDQUNaLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxLQUFkLENBQVQsRUFBK0IsVUFBUyxDQUFULEVBQVk7QUFDekMsZUFBTyxTQUFTLENBQUMsQ0FBQyxNQUFsQjtBQUNELE9BRkQsQ0FEWSxDQUFkOztBQU1BLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBbkIsR0FBK0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxPQUFULEVBQWtCLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FBbEIsRUFBa0MsTUFBakU7QUFDQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLFNBQW5CLEdBQStCLENBQUMsQ0FBQyxNQUFGLENBQVMsT0FBVCxFQUFrQixDQUFDLE9BQUQsRUFBVSxHQUFWLENBQWxCLEVBQWtDLE1BQWpFOztBQUNBLFVBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQ1gsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFDLENBQUMsV0FBRixDQUFjLEtBQWQsQ0FBVCxFQUErQixVQUFTLENBQVQsRUFBWTtBQUN6QyxZQUFJLENBQUMsQ0FBQyxLQUFGLElBQVcsR0FBZixFQUFvQjtBQUNsQixpQkFBTyxDQUFQO0FBQ0Q7QUFDRixPQUpELENBRFcsQ0FBYjs7QUFRQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLE1BQW5CLEdBQTRCLE1BQU0sQ0FBQyxNQUFuQztBQUNBLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsR0FBNkIsS0FBSyxDQUFDLFlBQU4sR0FBcUIsTUFBTSxDQUFDLE1BQXpEO0FBRUEsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDRDQUFaO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQU0sQ0FBQyxNQUFuQjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnREFBWjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLENBQUMsWUFBTixDQUFtQixTQUEvQjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnREFBWjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLENBQUMsWUFBTixHQUFxQixNQUFNLENBQUMsTUFBeEM7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksbURBQVo7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBL0I7QUFDRDtBQTdOUSxHQTFEZ0I7QUF5UjNCLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxRQUFRLEVBQUUsa0JBQUMsT0FBRCxFQUFVLE9BQVYsRUFBc0I7QUFDOUIsTUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGVBQWYsRUFBZ0MsT0FBaEM7QUFDRCxLQUhNO0FBS0QsSUFBQSxTQUxDLHFCQUtVLE9BTFYsRUFLbUIsT0FMbkIsRUFLNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2xDLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixJQUE5QjtBQUNJLGdCQUFBLEdBRjhCLGFBRXJCLE9BRnFCO0FBQUE7QUFBQSx1QkFHYixLQUFLLENBQ3ZCLEdBRGtCLENBQ2QsR0FEYyxFQUNUO0FBQUUsa0JBQUEsTUFBTSxFQUFFO0FBQUUsb0JBQUEsSUFBSSxFQUFFO0FBQVI7QUFBVixpQkFEUyxDQUhhOztBQUFBO0FBRzlCLGdCQUFBLFFBSDhCOztBQUsvQixvQkFBSTtBQUNFLGtCQUFBLE9BREYsR0FDWSxRQUFRLENBQUMsT0FEckI7QUFFRixrQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhCQUFaO0FBQ0csa0JBQUEsSUFIRCxHQUdRLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZCxDQUFrQixVQUFBLElBQUksRUFBSTtBQUNuQztBQUNBLHdCQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBckI7QUFDQSxvQkFBQSxJQUFJLENBQUMsVUFBTCxHQUFrQixNQUFNLENBQUMsSUFBSSxJQUFKLENBQVMsU0FBVCxDQUFELENBQU4sQ0FBNEIsTUFBNUIsQ0FDaEIsb0JBRGdCLENBQWxCO0FBR0EsMkJBQU8sSUFBUDtBQUNELG1CQVBVLENBSFIsRUFXSDs7QUFDQSxrQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFULENBQXpCLEVBQXlDLDZCQUF6QztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsc0JBQWYsRUFBdUMsT0FBTyxDQUFDLElBQS9DO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxPQUFuQztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixJQUE5QjtBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsY0FBZixFQUErQixPQUEvQjtBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNELGlCQWxCQSxDQW1CRCxPQUFNLEtBQU4sRUFBYTtBQUNYLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsV0FBZixFQUE0QixLQUFLLENBQUMsUUFBTixFQUE1QjtBQUNEOztBQTNCK0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE0Qm5DLEtBakNNO0FBa0NELElBQUEsWUFsQ0Msd0JBa0NhLE9BbENiLEVBa0NzQixPQWxDdEIsRUFrQytCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNwQyxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsSUFBOUI7QUFDSSxnQkFBQSxHQUZnQyxhQUV2QixPQUZ1QjtBQUFBO0FBQUE7QUFBQSx1QkFJYixLQUFLLENBQ3ZCLEdBRGtCLENBQ2QsR0FEYyxFQUNUO0FBQUUsa0JBQUEsTUFBTSxFQUFFO0FBQUUsb0JBQUEsSUFBSSxFQUFFO0FBQVI7QUFBVixpQkFEUyxDQUphOztBQUFBO0FBSTlCLGdCQUFBLFFBSjhCO0FBTTdCLGdCQUFBLE9BTjZCLEdBTW5CLFFBQVEsQ0FBQyxPQU5VO0FBTzdCLGdCQUFBLElBUDZCLEdBT3RCLFFBQVEsQ0FBQyxJQUFULENBQWMsQ0FBZCxDQVBzQjtBQVE3QixnQkFBQSxTQVI2QixHQVFqQixJQUFJLENBQUMsVUFSWTtBQVNqQyxnQkFBQSxJQUFJLENBQUMsVUFBTCxHQUFrQixNQUFNLENBQUMsSUFBSSxJQUFKLENBQVMsU0FBVCxDQUFELENBQU4sQ0FBNEIsTUFBNUIsQ0FDaEIsb0JBRGdCLENBQWxCO0FBRUEsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxPQUFuQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsNkJBQWYsRUFBOEMsT0FBTyxDQUFDLElBQXREO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxJQUFsQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQWRpQztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQWdCakMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLGFBQU0sUUFBTixFQUE1Qjs7QUFqQmlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0JyQyxLQXRETTtBQXdERCxJQUFBLFVBeERDLHNCQXdEVyxPQXhEWCxFQXdEb0IsT0F4RHBCLEVBd0Q2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDbEMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQTlCO0FBQ0ksZ0JBQUEsR0FGOEIsYUFFckIsT0FGcUI7O0FBR2xDLG9CQUFJO0FBQ0Usa0JBQUEsUUFERixHQUNhLEtBQUssQ0FBQyxHQUFOLENBQVUsR0FBVixFQUFlO0FBQUUsb0JBQUEsTUFBTSxFQUFFO0FBQUUsc0JBQUEsSUFBSSxFQUFFO0FBQVI7QUFBVixtQkFBZixDQURiO0FBRUUsa0JBQUEsSUFGRixHQUVTLFFBQVEsQ0FBQyxJQUFULENBQWMsQ0FBZCxDQUZUO0FBR0Usa0JBQUEsT0FIRixHQUdZLElBQUksQ0FBQyxPQUhqQjtBQUlFLGtCQUFBLE9BSkYsR0FJWSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxPQUFoQixDQUpaO0FBS0Usa0JBQUEsUUFMRixHQUthLElBQUksQ0FBQyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLElBTHBDO0FBTUUsa0JBQUEsSUFORixHQU1TLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBYixFQUFnQixVQUFoQixDQUEyQixJQU5wQztBQU9FLGtCQUFBLGFBUEYsR0FPa0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBUGxDLEVBUUY7O0FBQ0ksa0JBQUEsV0FURixHQVNnQixJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsU0FUaEM7QUFVRSxrQkFBQSxXQVZGLEdBVWdCLGFBQWEsR0FBRyxJQUFoQixHQUF1QixRQUF2QixHQUFrQyxHQVZsRDtBQVdFLGtCQUFBLFlBWEYsR0FXaUIsT0FBTyxDQUFDLE1BWHpCO0FBWUYsa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxnQkFBZixFQUFpQyxJQUFJLENBQUMsT0FBdEM7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsSUFBSSxDQUFDLE9BQW5DO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLE9BQTlCO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLE9BQTdCO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvQkFBZixFQUFxQyxPQUFyQztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsY0FBZixFQUErQixRQUEvQjtBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsY0FBZixFQUErQixJQUEvQjtBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsYUFBcEM7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGlCQUFmLEVBQWtDLFdBQWxDO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxZQUFuQztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsV0FBakM7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsS0FBOUI7QUFDRCxpQkF4QkQsQ0F5QkEsT0FBTyxLQUFQLEVBQ0E7QUFDRSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsS0FBSyxDQUFDLFFBQU4sRUFBNUI7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsS0FBOUI7QUFDRDs7QUFBQTs7QUFoQ2lDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaUNuQyxLQXpGTTtBQTBGUCxJQUFBLG1CQUFtQixFQUFFLDZCQUFDLE9BQUQsRUFBVSxPQUFWLEVBQXNCO0FBQ3pDLFVBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUF0QjtBQUNBLFVBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUF0QjtBQUNBLE1BQUEsVUFBVSxDQUFDLFlBQU07QUFDZixRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixPQUE5QjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLE9BQTdCO0FBQ0QsT0FIUyxFQUdQLElBSE8sQ0FBVjtBQUlELEtBakdNLENBa0dQOztBQWxHTztBQXpSa0IsQ0FBZixDQUFkLEMsQ0ErWEEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBiYXNlVVJMID0gJy93cC1qc29uL3dwL3YyLyc7XHJcbmNvbnN0IHN0b3JlID0gbmV3IFZ1ZXguU3RvcmUoe1xyXG4gIHN0cmljdDogdHJ1ZSxcclxuICBzdGF0ZToge1xyXG4gICAgdG91YXBpOiBbXSxcclxuICAgIHRvdWFjY2Vzc3RpbWU6ICcnLFxyXG4gICAgZGV0YWlsOiBbXSxcclxuICAgIGxhc3RkZXRhaWxhY2Nlc3M6ICcnLFxyXG4gICAgZXZlbnRfc3RhdHM6IFtdLFxyXG4gICAgcGxheWVyczogW10sXHJcbiAgICByZXN1bHRfZGF0YTogW10sXHJcbiAgICB0b3RhbF9wbGF5ZXJzOiBudWxsLFxyXG4gICAgZXJyb3I6ICcnLFxyXG4gICAgbG9hZGluZzogdHJ1ZSxcclxuICAgIG9uZ29pbmc6IGZhbHNlLFxyXG4gICAgY3VycmVudFBhZ2U6IG51bGwsXHJcbiAgICBXUHRvdGFsOiBudWxsLFxyXG4gICAgV1BwYWdlczogbnVsbCxcclxuICAgIGNhdGVnb3J5OiAnJyxcclxuICAgIHBhcmVudHNsdWc6ICcnLFxyXG4gICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgdG91cm5leV90aXRsZTogJycsXHJcbiAgICBsb2dvX3VybDogJycsXHJcbiAgICB0b3RhbF9yb3VuZHM6IG51bGwsXHJcbiAgICBmaW5hbF9yb3VuZF9zdGF0czogW10sXHJcbiAgICBzaG93c3RhdHM6IGZhbHNlLFxyXG4gICAgcGxheWVyX2xhc3RfcmRfZGF0YTogW10sXHJcbiAgICBwbGF5ZXJkYXRhOiBbXSxcclxuICAgIHBsYXllcjogbnVsbCxcclxuICAgIHBsYXllcl9zdGF0czoge30sXHJcbiAgfSxcclxuICBnZXR0ZXJzOiB7XHJcbiAgICBQTEFZRVJfU1RBVFM6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9zdGF0cyxcclxuICAgIExBU1RSRERBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9sYXN0X3JkX2RhdGEsXHJcbiAgICBQTEFZRVJEQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJkYXRhLFxyXG4gICAgUExBWUVSOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXIsXHJcbiAgICBTSE9XU1RBVFM6IHN0YXRlID0+IHN0YXRlLnNob3dzdGF0cyxcclxuICAgIFRPVUFQSTogc3RhdGUgPT4gc3RhdGUudG91YXBpLFxyXG4gICAgVE9VQUNDRVNTVElNRTogc3RhdGUgPT4gc3RhdGUudG91YWNjZXNzdGltZSxcclxuICAgIERFVEFJTDogc3RhdGUgPT4gc3RhdGUuZGV0YWlsLFxyXG4gICAgTEFTVERFVEFJTEFDQ0VTUzogc3RhdGUgPT4gc3RhdGUubGFzdGRldGFpbGFjY2VzcyxcclxuICAgIEVWRU5UU1RBVFM6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3N0YXRzLFxyXG4gICAgUExBWUVSUzogc3RhdGUgPT4gc3RhdGUucGxheWVycyxcclxuICAgIFRPVEFMUExBWUVSUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcGxheWVycyxcclxuICAgIFJFU1VMVERBVEE6IHN0YXRlID0+IHN0YXRlLnJlc3VsdF9kYXRhLFxyXG4gICAgRVJST1I6IHN0YXRlID0+IHN0YXRlLmVycm9yLFxyXG4gICAgTE9BRElORzogc3RhdGUgPT4gc3RhdGUubG9hZGluZyxcclxuICAgIENVUlJQQUdFOiBzdGF0ZSA9PiBzdGF0ZS5jdXJyZW50UGFnZSxcclxuICAgIFdQVE9UQUw6IHN0YXRlID0+IHN0YXRlLldQdG90YWwsXHJcbiAgICBXUFBBR0VTOiBzdGF0ZSA9PiBzdGF0ZS5XUHBhZ2VzLFxyXG4gICAgQ0FURUdPUlk6IHN0YXRlID0+IHN0YXRlLmNhdGVnb3J5LFxyXG4gICAgVE9UQUxfUk9VTkRTOiBzdGF0ZSA9PiBzdGF0ZS50b3RhbF9yb3VuZHMsXHJcbiAgICBGSU5BTF9ST1VORF9TVEFUUzogc3RhdGUgPT4gc3RhdGUuZmluYWxfcm91bmRfc3RhdHMsXHJcbiAgICBQQVJFTlRTTFVHOiBzdGF0ZSA9PiBzdGF0ZS5wYXJlbnRzbHVnLFxyXG4gICAgRVZFTlRfVElUTEU6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3RpdGxlLFxyXG4gICAgVE9VUk5FWV9USVRMRTogc3RhdGUgPT4gc3RhdGUudG91cm5leV90aXRsZSxcclxuICAgIE9OR09JTkdfVE9VUk5FWTogc3RhdGUgPT4gc3RhdGUub25nb2luZyxcclxuICAgIExPR09fVVJMOiBzdGF0ZSA9PiBzdGF0ZS5sb2dvX3VybCxcclxuICB9LFxyXG4gIG11dGF0aW9uczoge1xyXG4gICAgU0VUX1NIT1dTVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnNob3dzdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0ZJTkFMX1JEX1NUQVRTOiAoc3RhdGUsIHJlc3VsdHN0YXRzKSA9PiB7XHJcbiAgICAgIGxldCBsZW4gPSByZXN1bHRzdGF0cy5sZW5ndGg7XHJcbiAgICAgIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgc3RhdGUuZmluYWxfcm91bmRfc3RhdHMgPSBfLmxhc3QocmVzdWx0c3RhdHMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVURBVEE6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhcGkgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVERFVEFJTDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmRldGFpbCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhY2Nlc3N0aW1lID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sYXN0ZGV0YWlsYWNjZXNzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfV1BfQ09OU1RBTlRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuV1BwYWdlcyA9IHBheWxvYWRbJ3gtd3AtdG90YWxwYWdlcyddO1xyXG4gICAgICBzdGF0ZS5XUHRvdGFsID0gcGF5bG9hZFsneC13cC10b3RhbCddO1xyXG4gICAgfSxcclxuICAgIFNFVF9QTEFZRVJTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGEgPSBwYXlsb2FkLm1hcChmdW5jdGlvbih2YWwsIGluZGV4LCBrZXkpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXlbaW5kZXhdWydwb3N0X3RpdGxlJ10pO1xyXG4gICAgICAgIGtleVtpbmRleF1bJ3RvdV9ubyddID0gaW5kZXggKyAxO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS50b3RhbF9wbGF5ZXJzID0gcGF5bG9hZC5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcnMgPSBhO1xyXG4gICAgfSxcclxuICAgIFNFVF9SRVNVTFQ6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5yZXN1bHRfZGF0YSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX09OR09JTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5vbmdvaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRTVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ1VSUlBBR0U6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jdXJyZW50UGFnZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VSUk9SOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXJyb3IgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0FESU5HOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9hZGluZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVEFMX1JPVU5EUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3JvdW5kcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0NBVEVHT1JZOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuY2F0ZWdvcnkgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9UT1VSTkVZX1RJVExFOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91cm5leV90aXRsZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1BBUkVOVFNMVUc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5wYXJlbnRzbHVnID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5ldmVudF90aXRsZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPR09fVVJMOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9nb191cmwgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIENPTVBVVEVfUExBWUVSX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHN0YXRlLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgICAgbGV0IGxhc3Ryb3VuZCA9IHN0YXRlLnJlc3VsdF9kYXRhW2xlbiAtIDFdO1xyXG4gICAgICBsZXQgcGxheWVyID0gKHN0YXRlLnBsYXllciA9IF8uZmlsdGVyKHN0YXRlLnBsYXllcnMsIHsgaWQ6IHBheWxvYWQgfSkpO1xyXG4gICAgICBsZXQgbmFtZSA9IF8ubWFwKHBsYXllciwgJ3Bvc3RfdGl0bGUnKSArICcnOyAvLyBjb252ZXJ0IHRvIHN0cmluZ1xyXG4gICAgICBsZXQgcGxheWVyX3RubyA9IHBhcnNlSW50KF8ubWFwKHBsYXllciwgJ3RvdV9ubycpKTtcclxuICAgICAgc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSA9IF8uZmluZChsYXN0cm91bmQsIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG5cclxuICAgICAgbGV0IHBkYXRhID0gKHN0YXRlLnBsYXllcmRhdGEgPSBfLmNoYWluKHN0YXRlLnJlc3VsdF9kYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCBzY29yZXMgPSBfLmZsYXR0ZW5EZWVwKF8ubWFwKG0sICdzY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBsZXQgYWxsT3BwU2NvcmVzID0gKHN0YXRlLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXMgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgbGV0IG9wcHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ29wcG9fc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gb3Bwc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLmFsbFJhbmtzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBIaVNjb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBwTG9TY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBMb1Njb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHMgPSBwSGlTY29yZVJvdW5kcy5qb2luKCk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcyA9IHBMb1Njb3JlUm91bmRzLmpvaW4oKTtcclxuXHJcbiAgICAgIGxldCBwUmJ5UiA9IF8ubWFwKHBkYXRhLCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uKGwpIHtcclxuICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgICAgICAgIGlmIChsLnJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ3dvbic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnbG9zdCc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgc3RhcnRpbmcgPSAncmVwbHlpbmcnO1xyXG4gICAgICAgICAgaWYgKGwuc3RhcnQgPT0gJ3knKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0aW5nID0gJ3N0YXJ0aW5nJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChyZXN1bHQgPT0gJ0FSJykge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgK1xyXG4gICAgICAgICAgICAgIGwucm91bmQgK1xyXG4gICAgICAgICAgICAgICcgJyArXHJcbiAgICAgICAgICAgICAgbmFtZSArXHJcbiAgICAgICAgICAgICAgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgK1xyXG4gICAgICAgICAgICAgIHN0YXJ0aW5nICtcclxuICAgICAgICAgICAgICAnKTwvZW0+IGlzIHBsYXlpbmcgPHN0cm9uZz4nICtcclxuICAgICAgICAgICAgICBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4uIFJlc3VsdHMgYXJlIGJlaW5nIGF3YWl0ZWQnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbC5yZXBvcnQgPVxyXG4gICAgICAgICAgICAgICdJbiByb3VuZCAnICtcclxuICAgICAgICAgICAgICBsLnJvdW5kICtcclxuICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgIG5hbWUgK1xyXG4gICAgICAgICAgICAgICc8ZW0gdi1pZj1cImwuc3RhcnRcIj4sICgnICtcclxuICAgICAgICAgICAgICBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBwbGF5ZWQgPHN0cm9uZz4nICtcclxuICAgICAgICAgICAgICBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gYW5kICcgK1xyXG4gICAgICAgICAgICAgIHJlc3VsdCArXHJcbiAgICAgICAgICAgICAgJyA8ZW0+JyArXHJcbiAgICAgICAgICAgICAgbC5zY29yZSArXHJcbiAgICAgICAgICAgICAgJyAtICcgK1xyXG4gICAgICAgICAgICAgIGwub3Bwb19zY29yZSArXHJcbiAgICAgICAgICAgICAgJzwvZW0+IGEgZGlmZmVyZW5jZSBvZiAnICtcclxuICAgICAgICAgICAgICBsLmRpZmYgK1xyXG4gICAgICAgICAgICAgICcuIDxzcGFuIGNsYXNzPVwic3VtbWFyeVwiPjxlbT4nICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPC9lbT4gaXMgcmFua2VkIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiB3aXRoIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5wb2ludHMgK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gcG9pbnRzIGFuZCBhIGN1bXVsYXRpdmUgc3ByZWFkIG9mICcgK1xyXG4gICAgICAgICAgICAgIGwubWFyZ2luICtcclxuICAgICAgICAgICAgICAnIDwvc3Bhbj4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucFJieVIgPSBfLmZsYXR0ZW5EZWVwKHBSYnlSKTtcclxuXHJcbiAgICAgIGxldCBhbGxXaW5zID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgIHJldHVybiAnd2luJyA9PSBwLnJlc3VsdDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0V2lucyA9IF8uZmlsdGVyKGFsbFdpbnMsIFsnc3RhcnQnLCAneSddKS5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ24nXSkubGVuZ3RoO1xyXG4gICAgICBsZXQgc3RhcnRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgIGlmIChwLnN0YXJ0ID09ICd5Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0cyA9IHN0YXJ0cy5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBsaWVzID0gc3RhdGUudG90YWxfcm91bmRzIC0gc3RhcnRzLmxlbmd0aDtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVN0YXJ0cyBDb3VudC0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgY29uc29sZS5sb2coc3RhcnRzLmxlbmd0aCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVN0YXJ0cyBXaW4gQ291bnQtLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydFdpbnMpO1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1SZXBsaWVzIENvdW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzdGF0ZS50b3RhbF9yb3VuZHMgLSBzdGFydHMubGVuZ3RoKTtcclxuICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tUmVwbHkgV2luIENvdW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgY29uc29sZS5sb2coc3RhdGUucGxheWVyX3N0YXRzLnJlcGx5V2lucyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWN0aW9uczoge1xyXG4gICAgRE9fU1RBVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfU0hPV1NUQVRTJywgcGF5bG9hZCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIEZFVENIX0FQSSAoY29udGV4dCwgcGF5bG9hZCkgIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvc1xyXG4gICAgICAgIC5nZXQodXJsLCB7IHBhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coJ0dldHRpbmcgbGlzdHMgb2YgdG91cm5hbWVudHMnKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YS5tYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEZvcm1hdCBhbmQgYXNzaWduIFRvdXJuYW1lbnQgc3RhcnQgZGF0ZSBpbnRvIGEgbGV0aWFibGVcclxuICAgICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhtb21lbnQoaGVhZGVycy5kYXRlKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIiVjXCIgKyBtb21lbnQoaGVhZGVycy5kYXRlKSwgXCJmb250LXNpemU6MzBweDtjb2xvcjpncmVlbjtcIik7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9XUF9DT05TVEFOVFMnLCBoZWFkZXJzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VREFUQScsIGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DVVJSUEFHRScsIHBheWxvYWQpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9ERVRBSUwgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgICAuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pO1xyXG4gICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgZGF0YSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgYXN5bmMgRkVUQ0hfREFUQSAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9kYXRhYDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBkYXRhLnBsYXllcnM7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lO1xyXG4gICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICBsZXQgdG91cm5leV90aXRsZSA9IGRhdGEudG91cm5leVswXS5wb3N0X3RpdGxlO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEudG91cm5leVswXSk7XHJcbiAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCAoZXJyb3IpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIFNFVF9QTEFZRVJTX1JFU1VMVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gcGF5bG9hZC5wbGF5ZXJzO1xyXG4gICAgICBsZXQgcmVzdWx0cyA9IHBheWxvYWQucmVzdWx0cztcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9LFxyXG4gICAgLy8gIHBsdWdpbnM6IFt2dWV4TG9jYWwucGx1Z2luXSxcclxuICB9LFxyXG59KTtcclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IHN0b3JlO1xyXG4iXX0=
