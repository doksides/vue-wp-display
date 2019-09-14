var Header = Vue.component('site-navbar', {
  template: `
  <nav class="navbar navbar-expand-lg ">
  <!--<a class="navbar-brand" href="/">
    <img alt="NSF logo" class="rounded-circle d-inline-block align-top" src="./assets/images/nsflogo.png" width="30px"
      height="30px">
  </a> -->
  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <div class="collapse navbar-collapse" id="nav_collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" href="/tourneys"><i class="fas fa-home"></i></a>
      </li>
    </ul>
    <!-- Right aligned nav items -->
    <ul class="nav justify-content-end">
      <li class="nav-item">
        <a class="nav-link" href="https://www.nigeriascrabble.com"><i class="fas fa-globe"></i> NSF News</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://www.facebook.com/NigeriaScrabbleFederation/"><i class="fa fa-facebook-square"></i></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://www.twitter.com/NigeriaScrabble"><i class="fa fa-twitter-square"></i></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://www.youtube.com/NigeriaScrabble"><i class="fa fa-youtube-square"></i></a>
      </li>
    </ul>
  </div>
  </nav>
`
});