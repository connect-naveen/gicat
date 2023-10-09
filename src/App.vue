<template>
  <a
    href="https://www.theoryofscience.rwth-aachen.de/cms/~qpmz/TheoryofScience/?lidx=1"
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

button {
  color: #000000;
  border: 1px solid #000000;
  box-shadow: 0 0 2px #000000;
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 8px;
  padding-left: 5px;
  padding-right: 5px;
}

select,
input {
  color: #000000;
  border: 1px solid #000000;
  box-shadow: 0 0 2px #000000;
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

button:hover,
select:hover,
input:hover {
  border: 1px solid #42b983;
}

input:focus,
textarea:focus,
select:focus {
  border: 1px solid #fafafa;
  -webkit-box-shadow: 0 0 6px #42b983;
  -moz-box-shadow: 0 0 5px #42b983;
  box-shadow: 0 0 5px #42b983;
}

button:active {
  box-shadow: 0.33px #9b9999;
  transform: translateX(0.4px);
}
</style>
