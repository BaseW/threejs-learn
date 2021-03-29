<template>
  <div class="container">
    <div>
        <h1>test</h1>
        <NuxtLink to="/shadow">shadow page</NuxtLink>
        <NuxtLink to="/tree">tree page</NuxtLink>
        <div id="three_container"></div>
    </div>
  </div>
</template>

<script>
import init from '~/assets/main';

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