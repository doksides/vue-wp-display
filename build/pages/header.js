'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Header = Vue.component('app-navbar', {
  template: '\n  <header class="navbar navbar-expand flex-column flex-md-row">\n  <a class="navbar-brand" href="/tournaments" aria-label="Tournaments-Nigeria Scrabble Federation">\n   <i class="fa fa-trophy"></i> Tournaments\n  </a>\n  <!--<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_collapse">\n  <span class="navbar-toggler-icon"></span>\n  </button>\n  -->\n  <div class="navbar-nav-scroll">\n    <!-- <ul class="navbar-nav flex-row">\n      <li class="nav-item">\n        <a class="nav-link" href="/tourneys"><i class="fas fa-home"></i></a>\n      </li>\n    </ul> -->\n    <!-- Right aligned nav items -->\n    <ul class="nav navbar-nav flex-row ml-auto">\n      <li class="nav-item">\n        <a class="nav-link" href="https://www.nigeriascrabble.com"><i class="fas fa-globe"></i> NSF News</a>\n      </li>\n    </ul>\n    <ul class="nav navbar-nav flex-row mr-auto">\n      <li class="nav-item">\n        <a class="nav-link" href="https://www.facebook.com/NigeriaScrabbleFederation/"><i class="fa fa-facebook-square"></i></a>\n      </li>\n      <li class="nav-item">\n        <a class="nav-link" href="https://www.twitter.com/NigeriaScrabble"><i class="fa fa-twitter-square"></i></a>\n      </li>\n      <li class="nav-item">\n        <a class="nav-link" href="https://www.youtube.com/NigeriaScrabble"><i class="fa fa-youtube-square"></i></a>\n      </li>\n    </ul>\n  </div>\n  </header>\n\n',
  data: function data() {
    return {
      nsflogo: scriptsLocation.nsflogo
    };
  }
});

var Header = exports.Header = undefined;