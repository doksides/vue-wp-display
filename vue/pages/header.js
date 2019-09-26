var Header = Vue.component('site-navbar', {
  template: `
  <nav class="navbar navbar-expand-md flex-column flex-md-row">
  <a class="navbar-brand" href="/">
    <img alt="NSF logo" class="rounded-circle d-inline-block align-top " :src="nsflogo" width="40" height="40" style="border: 1px solid #00f">
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_collapse">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="nav_collapse">
    <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex" style="border: 1px solid #ff0">
      <li class="nav-item">
        <a class="nav-link" href="/tourneys"><i class="fas fa-home"></i></a>
      </li>
    </ul>
    <!-- Right aligned nav items -->
    <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
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

`,
data() {
  return {
    nsflogo: scriptsLocation.nsflogo,
  }
},
});