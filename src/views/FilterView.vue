<template>
  <div class="filters">
    <h1>This is the filter page</h1>
    <div>
      <v-btn @click="selectFilterPackage()">Select Filter Package</v-btn>
      <br />
      <v-btn @click="resetFiltersButton()">Reset Filters</v-btn>
    </div>
    <div>
      <div>Current filters:</div>
      <ul>
        <li v-for="filter in getFilters" v-bind:key="filter.id">
          {{ filter.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
const ce = window.ce;

export default {
  data() {
    return {};
  },
  name: "FilterView",
  components: {},
  computed: {
    // store
    ...mapGetters([
      "getRepoPath",
      "getNodes",
      "getEdges",
      "getGraph",
      "getNodeFilters",
      "getEdgeFilters",
      "getFilters",
    ]),
  },
  methods: {
    // store
    ...mapActions([
      "setRepoPath",
      "setNodes",
      "setEdges",
      "setGraph",
      "addNodeFilter",
      "addEdgeFilter",
      "addFilter",
      "resetFilters",
    ]),
    async selectFilterPackage() {
      let dialogReturn = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      let path = dialogReturn.filePaths[0];
      if (path && path != "") {
        this.loadFilterPackage(path);
      }
      console.log(this.getFilters);
    },
    resetFiltersButton() {
      this.resetFilters();
    },
    // loadFilterPackage
    async loadFilterPackage(filterPackagePath) {
      if (!filterPackagePath) {
        console.warn("No path assigned");
        return;
      }
      console.log("loading filter package");
      const filterPackage = await ce.loadJSON(filterPackagePath);
      console.log(filterPackage);
      for (const nodeFilter of filterPackage.nodeFilterList) {
        await this.addNodeFilter(nodeFilter);
      }
      for (const edgeFilter of filterPackage.edgeFilterList) {
        await this.addEdgeFilter(edgeFilter);
      }
    },
  },
};
</script>
