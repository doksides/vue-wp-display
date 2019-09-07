<template>
  <div class="load-comp">
    <div class="mx-auto my-3 dot-typing"></div>
    <div class="alert alert-info mx-auto w-25" role="alert">
      <h4 class="alert-heading text-center">Loading data..
        <!-- <i class="fa fa-spinner fa-pulse fa-fw"></i> -->
        <span class="sr-only">Loading...</span></h4>
    </div>
  </div>
</template>
<script>
export default {
   name: 'AlertLoading'
}
</script>

<style scoped>
.alert i {
  display: inline-block;
  margin-right: .5em;
  margin-left: .5em;
 }
</style>
