var Header = Vue.component('app-navbar', {
  template: `
  <header class="navbar navbar-expand flex-column flex-md-row">
  <a class="navbar-brand" href="/tournaments" aria-label="Tournaments-Nigeria Scrabble Federation">
   <i class="fa fa-trophy"></i> Tournaments
  </a>
  <!--<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav_collapse">
  <span class="navbar-toggler-icon"></span>
  </button>
  -->
  <div class="navbar-nav-scroll">
    <!-- <ul class="navbar-nav flex-row">
      <li class="nav-item">
        <a class="nav-link" href="/tourneys"><i class="fas fa-home"></i></a>
      </li>
    </ul> -->
    <!-- Right aligned nav items -->
    <ul class="nav navbar-nav flex-row ml-auto">
      <li class="nav-item">
        <a class="nav-link" href="https://www.nigeriascrabble.com"><i class="fas fa-globe"></i> NSF News</a>
      </li>
    </ul>
    <ul class="nav navbar-nav flex-row mr-auto">
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
  </header>

`,
data() {
  return {
    nsflogo: scriptsLocation.nsflogo,
  }
},
});

export var Header;