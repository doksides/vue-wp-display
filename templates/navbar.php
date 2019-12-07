<?php

$url = bloginfo('url');
$logo = plugin_dir_url(__FILE__) . '../assets/images/logo.png';

$header = <<<EOD
<nav class="navbar navbar-expand-lg fixed-bottom" id="mainNav">

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
    </button>
    <a class="navbar-brand" href="'$url'" aria-label="Tournaments-Nigeria Scrabble Federation">
    <img src="'$logo'" width="30" height="30" class="d-inline-block align-top" alt="Nigeria Scrabble Federation News Blog">
    </a>

  <div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav pt-3 pt-lg-0">
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
EOD;


