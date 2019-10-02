var Footer = Vue.component('app-footer', {
  template: `
  <div id="footer">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <p class="w-75 p-5 mx-auto my-5">Scrabble &copy; is a registered trademark. All intellectual property rights in and to the game are owned in the U.S.A
          and Canada by Hasbro Inc., and throughout the rest of the world by J.W. Spear & Sons Limited of Maidenhead, Berkshire,
          England, a subsidiary of Mattel Inc.
        </p>
      </div>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      nsflogo: scriptsLocation.nsflogo,
      myphoto: scriptsLocation.webmaster,
    }
  },
});
export var Footer;