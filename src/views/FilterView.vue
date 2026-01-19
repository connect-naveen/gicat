<template>
  <v-main>
    <div class="filters">
      <h1>This is the filter page</h1>
      <div>
        <br />
        <v-btn @click="selectFilterPackage()" prepend-icon="$fileSearch">
          Select Filter Package
        </v-btn>
        <br /><br />
        <v-btn @click="resetFiltersButton()" prepend-icon="$arrowDownLeft">
          Reset Filters
        </v-btn>
      </div>
      <br />
      <div>
        <div>Current filters:</div>
        <ul>
          <li v-for="filter in getFilters" v-bind:key="filter.id">
            {{ filter.name }}
          </li>
        </ul>
      </div>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
let dialog;
if (typeof window !== "undefined" && window.require) {
  dialog = window.require("@electron/remote").dialog;
}
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

    /**
     * Opens a dialog to select a filter package file and loads it.
     * @returns {Promise<void>}
     */
    async selectFilterPackage() {
      let dialogReturn = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      let path = dialogReturn.filePaths[0];
      if (path && path != "") {
        this.loadFilterPackage(path);
      }
    },

    /**
     * Resets all applied filters by calling the resetFilters action.
     * @return {void}
     */
    resetFiltersButton() {
      this.resetFilters();
    },

    /**
     *  Loads a filter package from the specified path and adds its node and edge filters to the store.
     * @param filterPackagePath {string} - The file path of the filter package to load.
     * @returns {Promise<void>}
     */
    async loadFilterPackage(filterPackagePath) {
      if (!filterPackagePath) {
        console.warn("No path assigned");
        return;
      }
      const filterPackage = await ce.loadJSON(filterPackagePath);
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
