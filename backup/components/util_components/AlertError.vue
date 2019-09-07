<template>
  <div class="error-comp">
    <div class="alert alert-danger mx-auto w-25" role="alert">
      <h4 class="alert-heading text-center">
      <slot name="error"></slot>
      <span class="sr-only">Error...</span>
      </h4>
    <div class="mx-auto text-center">
      <slot name="error_msg"></slot>
    </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'AlertError'
}
</script>

<style scoped>
 .alert i {
  margin-right: .5em;
  margin-left: .5em;
}

</style>

