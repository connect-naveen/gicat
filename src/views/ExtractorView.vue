<template>
  <div class="extractor">
    <div>
      <!-- TODO add vuetify buttons -->
      <button color="primary" @click="openDir()">Open Repository</button>
      <br />
      <div>Current path:</div>
      <div>{{ repoPath }}</div>
      <br />
      <button color="primary" @click="loadFilters()">Load Filters</button>
      <button color="primary" @click="resetFiltersButton()">Reset</button>
      <br />
      <div>Current filters:</div>
      <ul>
        <li v-for="filter in filters" v-bind:key="filter.id">
          {{ filter.name }}
        </li>
      </ul>
      <button color="primary" @click="startVisualisation()">
        Start Visualisation
      </button>
      <br />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
const ce = window.ce;

export default {
  data() {
    return {
      repoPath: null,
    };
  },
  name: "ExtractorView",
  components: {},
  methods: {
    // store
    ...mapActions([
      "setNodes",
      "setEdges",
      "setGraph",
      "addNodeFilter",
      "addEdgeFilter",
      "addFilter",
      "resetFilters",
    ]),

    // functions
    async openDir() {
      let repoPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (!repoPath.canceled && repoPath.filePaths[0]) {
        this.repoPath = repoPath.filePaths[0];
      }
      console.log("repo:");
      console.log(this.repoPath);
    },
    // TODO always load all available filters
    async loadFilters() {
      let arr = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
      });
      if (!arr.canceled && arr.filePaths[0]) {
        for (const el of arr.filePaths) {
          // TODO check for existing filter id
          let filter = ce.loadNodeFilter(el);
          if (filter.spec === "node") {
            this.addNodeFilter(filter);
          } else if (filter.spec === "edge") {
            this.addEdgeFilter(filter);
          } else {
            console.warn("Filter not valid:");
            console.warn(filter);
          }
        }
      }
      console.log(this.getFilters);
    },
    resetFiltersButton() {
      this.resetFilters();
    },
    async startVisualisation() {
      if (this.repoPath) {
        console.log(`The Path of the repository is: ${this.repoPath}`);

        let graph = await ce.getGraph(this.repoPath);
        let nodeFilters = this.getNodeFilters;
        let edgeFilters = this.getEdgeFilters;

        for (const filter of nodeFilters) {
          await ce.filterNode(graph, filter);
          console.log(graph);
        }
        for (const filter of edgeFilters) {
          await ce.filterEdge(graph, filter);
          console.log(graph);
        }
        await this.setGraph(graph);
        this.$router.push({ path: "extractor/network/" });
      } else {
        dialog.showMessageBox({
          title: "No valid entry",
          message: "You have to have at least a repo.",
        });
      }
    },
  },
  computed: {
    // store
    ...mapGetters([
      "getNodes",
      "getEdges",
      "getGraph",
      "getNodeFilters",
      "getEdgeFilters",
      "getFilters",
    ]),
  },
};
</script>
