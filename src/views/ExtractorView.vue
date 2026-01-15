<template>
  <v-main>
    <div class="extractor">
      <div>
        <br />
        <v-btn @click="openDir()" prepend-icon="$folderArrowUp"
          >Open Repository
        </v-btn>
        <br />
        <br />
        <v-alert
          rounded="lg"
          v-model="alertWarning"
          closable
          text="The directory you have selected is relatively large. Please make sure that your machine has enough resources to display a large graph or the performance of the software will be significantly reduced. Otherwise, you can go deeper into the directory tree to first analyze parts of the code and further reduce the number of nodes generated in this way."
          type="warning"
          variant="tonal"
        ></v-alert>
        <br />
        <div>Current path:</div>
        <div>{{ getRepoPath }}</div>
        <br />
        <v-btn
          id="startVisButton"
          prepend-icon="$folderArrowDown"
          @click="startVisualization()"
          :disabled="!isRepoPathEmpty"
          >Start Visualization
        </v-btn>
      </div>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//import { readdir } from "node:fs/promises";
const ce = window.ce;
const { dialog } = require("@electron/remote");
const { ipcRenderer } = window.require ? window.require("electron") : {};

export default {
  data() {
    return {
      alertWarning: false,
    };
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

    /**
     * Opens a directory dialog and sets the selected path as the repository path in the store.
     * Also checks the number of files in the selected directory and sets a warning alert if it exceeds 200 files.
     * If no directory is selected, it resets the repository path in the store to an empty string.
     * @return {Promise<void>}
     */
    async openDir() {
      let repoPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (!repoPath.canceled && repoPath.filePaths[0]) {
        this.setRepoPath(repoPath.filePaths[0]);
        this.isDirEmpty = false;
        let fileList = [];
        try {
          if (ipcRenderer) {
            fileList = await ipcRenderer.invoke(
              "read-directory",
              this.getRepoPath
            );
          }
          if (fileList.length > 200) {
            this.alertWarning = true;
          } else {
            this.alertWarning = false;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        this.setRepoPath("");
      }
    },

    /**
     *  Loads node and edge filters from selected files and adds them to the store.
     *  Uses a file dialog to select multiple filter files.
     *  @return {Promise<void>}
     */
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
    },

    /**
     * Resets all node and edge filters in the store.
     * @return {void}
     */
    resetFiltersButton() {
      this.resetFilters();
    },

    /**
     * Starts the visualization process by generating a graph from the repository path.
     * Applies node and edge filters, and navigates to the network view.
     * @return {Promise<void>}
     */
    async startVisualization() {
      if (this.getRepoPath != "") {
        let graph = await ce.getGraph(this.getRepoPath);
        let nodeFilters = this.getNodeFilters;
        let edgeFilters = this.getEdgeFilters;

        for (const filter of nodeFilters) {
          await ce.filterNode(graph, filter);
        }
        for (const filter of edgeFilters) {
          await ce.filterEdge(graph, filter);
        }
        await this.setGraph(graph);
        this.$router.push({ path: "extractor/networkNew/" });
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

    /**
     * Checks if the repository path is not empty.
     * @return {boolean} True if the repository path is not empty, false otherwise.
     */
    isRepoPathEmpty() {
      return this.getRepoPath != "";
    },
  },
};
</script>
