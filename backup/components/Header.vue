<template>
  <b-navbar toggleable="md" type="light">
  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand href="#">
      <img alt="NSF logo" class="rounded-circle" src="../assets/images/nsflogo.png" width="30px" height="30px">
  </b-navbar-brand>
  <b-collapse is-nav id="nav_collapse">
    <b-navbar-nav>
      <b-nav-item href="/"><i class="fa fa-home fa-fw"></i>Home</b-nav-item>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
        <b-nav-item href="https://nigeriascrabble.com">
            <i class="fa fa-play fa-fw"></i> Games
        </b-nav-item>
        <b-nav-item href="https://www.nigeriascrabble.com">
            <i class="fa fa-globe fa-fw"></i> NSF Blog
        </b-nav-item>
        <b-nav-item-dropdown text="Connect NSF" right>
            <b-dropdown-item href="https://www.facebook.com/NigeriaScrabbleFederation/"><i class="fa fa-facebook-official fa-fw"></i> NSF on Facebook</b-dropdown-item>
            <b-dropdown-item href="https://www.twitter.com/NigeriaScrabble"><i class="fa fa-twitter-square fa-fw"></i> NSF on Twitter</b-dropdown-item>
            <b-dropdown-item href="https://www.youtube.com/NigeriaScrabble"><i class="fa fa-youtube-square fa-fw"></i> NSF on YouTube</b-dropdown-item>
        </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
<!-- navbar-1.vue -->
</template>

<script>

export default {
    name: 'Header'
}
</script>

<style>

</style>
