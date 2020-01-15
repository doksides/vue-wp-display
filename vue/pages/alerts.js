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
 let mapGetters = Vuex.mapGetters;
 var LoginForm =Vue.component('login', {
   template: `
   <div class="row no-gutters">
      <div class="col-12 col-lg-10 offset-lg-1 justify-content-center align-items-center">
        <div v-if="login_success" class="d-flex justify-content-center">
          <div class="mx-2 py-1"><i class="fas fa-user-alt"></i> <small>Welcome {{user_display}}</small></div>
          <div class="mx-2 py-1" @click="logOut"><i style="color:tomato" class="fas fa-sign-out-alt "></i></div>
        </div>
        <div v-else>
          <b-form @submit="onSubmit" inline class="w-80 mx-auto">
          <b-form-invalid-feedback :state="validation">
            Your username or password must be more than 1 character in length.
            </b-form-invalid-feedback>
          <label class="sr-only" for="inline-form-input-username">Username</label>
          <b-input
          id="inline-form-input-username" placeholder="Username" :state="validation"
          class="mb-2 mr-sm-2 mb-sm-0 form-control-sm"
          v-model="form.user" >
          </b-input>
        <label class="sr-only" for="inline-form-input-password">Password</label>
          <b-input type="password" id="inline-form-input-password" :state="validation" class="form-control-sm" placeholder="Password" v-model="form.pass"></b-input>
          </b-input-group>
            <b-button variant="outline-dark" size="sm" type="submit" class="ml-sm-2">
            <i  :class="{'fa-save' : login_loading == false, 'fa-spinner fa-pulse': login_loading == true}" class="fas"></i>
            </b-button>
          </b-form>
        </div>
      </div>
    </div>
    `,
  data: function() {
    return {
      form: {
        pass:'',
        user: ''
      },
    };
   },
   mounted() {
    if(this.access.length > 0)
    {
      this.$store.dispatch('AUTH_TOKEN', this.access);
     }
     console.log(this.user_display)
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      console.log(JSON.stringify(this.form));
      this.$store.dispatch('DO_LOGIN', this.form);
    },
    logOut() {
      //  logout function
      console.log('Clicked logOut');
    }
   },
   computed: {
     ...mapGetters({
       login_loading: 'LOGIN_LOADING',
       login_success: 'LOGIN_SUCCESS',
       user_display: 'USER',
       access: 'ACCESS_TOKEN'
     }),

     validation() {
      return this.form.user.length > 1 && this.form.pass.length > 1
    },
   }
});

export { LoadingAlert, ErrorAlert, LoginForm };

