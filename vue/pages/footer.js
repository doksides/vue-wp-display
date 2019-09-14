var Footer = Vue.component('site-footer', {
  template: `
  <div class="container-fluid" id="footer">
      <div class="row">
        <div class="col-12">
          <p class="w-75 p-2 mx-auto">Scrabble &copy; is a registered trademark. All intellectual property rights in and
            to the game are owned in the U.S.A
            and Canada by Hasbro Inc., and throughout the rest of the world by J.W. Spear & Sons Limited of Maidenhead,
            Berkshire,
            England, a subsidiary of Mattel Inc.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h6 class="mb-5 mt-5">Powered By Our Sponsors and ..</h6>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
            <div class="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <img class="rounded-circle mr-0" width="40px " height="40px " src="../assets/images/nsflogo.png">
                <h6 class="mt-0 mx-2 text-center">Nigeria Scrabble Federation</h6>
            </div><!-- end media -->
        </div>
        <div class="col-12 col-lg-6">
            <div class="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              <img class="rounded-circle mr-0" width="40px " height="40px " src="../assets/images/me.jpg">
                <h6 class="mt-0 mx-2 text-center">Webmaster</h6>
            </div><!-- end media -->
        </div>
      </div>
    </div>
  `
});