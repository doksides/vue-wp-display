'use strict';

var LoadingAlert = Vue.component('loading', {
  template: '\n    <div class="mx-auto mt-5 d-block max-vw-75">\n        <h4 class="display-4 bebas text-center text-secondary">Loading..\n        <i class="fas fa-spinner fa-pulse"></i>\n        <span class="sr-only">Loading..</span></h4>\n    </div>'
});

var ErrorAlert = Vue.component('error', {
  template: '\n      <div class="alert alert-danger mt-5 mx-auto d-block max-vw-75" role="alert">\n          <h4 class="alert-heading text-center">\n          <slot name="error"></slot>\n          <span class="sr-only">Error...</span>\n          </h4>\n          <div class="mx-auto text-center">\n          <slot name="error_msg"></slot>\n          </div>\n      </div>',
  data: function data() {
    return {};
  }
});