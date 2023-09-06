<template>
  <div class="extractor">
    <div>
      <!-- TODO add vuetify buttons -->
      <button color="primary" @click="openDir()">Open Repository</button>
      <br />
      <div>Current path:</div>
      <div>{{ getRepoPath }}</div>
      <br />
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
    return {};
  },
  name: "ExtractorView",
  components: {},
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

    // functions
    async openDir() {
      let repoPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (!repoPath.canceled && repoPath.filePaths[0]) {
        this.setRepoPath(repoPath.filePaths[0]);
      } else {
        this.setRepoPath("");
      }
      console.log("repo:");
      console.log(this.getRepoPath);
    },
    // -----
    // TODO always load all available filters
    async loadFilters() {
      let arr = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
      });
      if (!arr.canceled && arr.filePaths[0]) {
        for (const el of arr.filePaths) {
          // TODO check for existing filter id
          console.log(el);
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
    // -----
    async startVisualisation() {
      if (this.getRepoPath != "") {
        console.log(`The Path of the repository is: ${this.getRepoPath}`);

        let graph = await ce.getGraph(this.getRepoPath);
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
      "getRepoPath",
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
