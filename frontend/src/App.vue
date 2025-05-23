<template>
  <div id="app">
    <Header />
    <main class="main-container">
      <div class="background-layer"></div>
      <div class="content-layer">
       <router-view />
      </div>
</main>
    <Footer />
  </div>
</template>


<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; 
}

header,
footer {
  flex-shrink: 0;
  z-index: 1;
}

.main-container {
  flex: 1;
  position: relative;
  overflow-y: auto;
  background-color: #E7C6A2;
}


.content-layer {
  position: relative;
  z-index: 1;
  padding: 2rem;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}


</style>
