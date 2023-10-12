<template>
  <!--<a
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
  <RouterView />-->
  <v-app>
    <v-toolbar>
      <v-toolbar-title>
        <a
          href="https://www.theoryofscience.rwth-aachen.de/cms/~qpmz/TheoryofScience/?lidx=1"
          target="_blank"
          style="cursor: pointer"
        >
          <img
            alt="TST logo"
            src="../src/assets/rwth_tst_bild_rgb.png"
            id="tst"
          />
        </a>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          class="mt-0"
          v-for="item in navBarItems"
          :key="item.title"
          :to="item.path"
        >
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "GICAT",
  data() {
    return {
      appTitle: "GICAT",
      navBarItems: [
        { title: "", path: "/", icon: "mdi-home" },
        { title: "About", path: "/about" },
        { title: "Extractor", path: "/extractor" },
        { title: "Filter", path: "/filters" },
        { title: "License", path: "/license" },
        { title: "Guide", path: "/guide" },
        { title: "Generator", path: "/generator" },
      ],
    };
  },
};
</script>

<style lang="scss">
#tst {
  float: left;
  display: block;
}

#app {
  text-align: center;
  font-family: Arial, sans-serif;
}
</style>
