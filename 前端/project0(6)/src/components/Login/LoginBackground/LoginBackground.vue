<template>
  <div id="particles-js"></div>
</template>

<script setup>
import {onMounted, onUnmounted, onUpdated, ref} from 'vue'

onMounted(()=>{
  let aScript=document.createElement('script')
  aScript.type="text/javascript";
  aScript.src="./particles.js";
  document.body.appendChild(aScript);
})
</script>

<style scoped>
@import "style.css";
</style>