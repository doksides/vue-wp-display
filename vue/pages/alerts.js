var LoadingAlert = Vue.component('loading',{
  template: `
    <div class="mx-auto w-50">
        <h4 class="display-4 bebas text-center text-secondary">Loading..
        <i class="fas fa-spinner fa-pulse"></i>
        <span class="sr-only">Loading..</span></h4>
    </div>`
 });

  var ErrorAlert =Vue.component('error', {
   template: `
      <div class="alert alert-danger mx-auto w-50" role="alert">
          <h4 class="alert-heading text-center">
          <slot name="error"></slot>
          <span class="sr-only">Error...</span>
          </h4>
          <div class="mx-auto text-center">
          <slot name="error_msg"></slot>
          </div>
      </div>`,
   data: function() {
     return {};
   },
 });



