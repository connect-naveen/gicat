<template>
  <a
    href="https://www.theoryofscience.rwth-aachen.de/go/id/qpmz/"
    target="_blank"
  >
    <img alt="TST logo" src="../src/assets/rwth_tst_bild_rgb.png" id="tst" />
  </a>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/extractor">Extractor</router-link> |
    <router-link to="/filters">Filter</router-link> |
    <router-link to="/license">License</router-link>|
    <router-link to="/guide">Guide</router-link> |
    <router-link to="/generator">Generator</router-link>
  </nav>
  <RouterView />
</template>

<style lang="scss">
#tst {
  float: left;
  display: block;
  margin-top: 15px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-active {
      color: #42b983;
    }
  }
}
</style>
