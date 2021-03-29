<template>
  <div class="container">
    <div>
        <h1>shadow</h1>
        <NuxtLink to="/">Home page</NuxtLink>
        <div id="three_container"></div>
    </div>
  </div>
</template>

<script>
import init from '~/assets/shadow';

export default {
    data() {
        return {}
    },
    mounted() {
        init(document);
    }
}
</script>

<style>

</style>