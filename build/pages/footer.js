'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Footer = Vue.component('app-footer', {
  template: '\n  <div id="footer">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col">\n        <p class="w-75 p-5 mx-auto my-5">Scrabble &copy; is a registered trademark. All intellectual property rights in and to the game are owned in the U.S.A\n          and Canada by Hasbro Inc., and throughout the rest of the world by J.W. Spear & Sons Limited of Maidenhead, Berkshire,\n          England, a subsidiary of Mattel Inc.\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n  ',
  data: function data() {
    return {
      nsflogo: scriptsLocation.nsflogo,
      myphoto: scriptsLocation.webmaster
    };
  }
});
var Footer = exports.Footer = undefined;