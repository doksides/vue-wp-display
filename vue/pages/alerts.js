var LoadingAlert = Vue.component('loading',{
  template: `
    <div class="d-flex flex-column justify-content-center align-items-center max-vw-75 mt-5">

        <svg class="lds-blocks mt-5" width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;"><rect x="19" y="19" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0s" calcMode="discrete"></animate>
      </rect><rect x="40" y="19" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0.15s" calcMode="discrete"></animate>
      </rect><rect x="61" y="19" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0.3s" calcMode="discrete"></animate>
      </rect><rect x="19" y="40" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="1.05s" calcMode="discrete"></animate>
      </rect><rect x="61" y="40" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0.44999999999999996s" calcMode="discrete"></animate>
      </rect><rect x="19" y="61" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0.8999999999999999s" calcMode="discrete"></animate>
      </rect><rect x="40" y="61" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.2s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"></animate>
      </rect><rect x="61" y="61" width="20" height="20" fill="#459448">
        <animate attributeName="fill" values="#ffffff;#459448;#459448" keyTimes="0;0.125;1" dur="1.1s" repeatCount="indefinite" begin="0.2s" calcMode="discrete"></animate>
       </rect></svg>
       <h4 class="display-3 bebas text-center text-secondary">Loading..
        <!-- <i class="fas fa-spinner fa-pulse"></i>
        <span class="sr-only">Loading..</span>
        -->
       </h4>
    </div>`
 });

var ErrorAlert =Vue.component('error', {
   template: `
      <div class="alert alert-danger mt-5 mx-auto d-block max-vw-75" role="alert">
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

 var LoginForm =Vue.component('login', {
  template: `
      <b-form @submit="onSubmit" inline class="w-80 mx-auto">
      <label class="sr-only" for="inline-form-input-username">Username</label>
      <b-input
       id="inline-form-input-username"
       class="mb-2 mr-sm-2 mb-sm-0"
       v-model="user" >
      </b-input>
     <label class="sr-only" for="inline-form-input-password">Password</label>
      <b-input id="inline-form-input-password"  v-model="pass"></b-input>
      </b-input-group>
      <b-button type="submit" class="ml-sm-2" sm variant="outline-primary"><i class="fa fa-save"></i></b-button>
      </b-form>
    `,
  data: function() {
    return {
      form: {
        pass:'',
        user: ''
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.user = '';
      this.form.pass = '';
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
});

export { LoadingAlert, ErrorAlert, LoginForm}

