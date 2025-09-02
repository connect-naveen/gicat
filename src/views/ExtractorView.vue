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
const { dialog } = require("@electron/remote");
import { readdir } from "node:fs/promises";
const ce = window.ce;

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

    // functions
    async openDir() {
      let repoPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (!repoPath.canceled && repoPath.filePaths[0]) {
        this.setRepoPath(repoPath.filePaths[0]);
        this.isDirEmpty = false;
        let fileList;
        try {
          fileList = await readdir(this.getRepoPath, { recursive: true });
          if (fileList.length > 200) {
            this.alertWarning = true;
          } else {
            this.alertWarning = false;
          }
        } catch (err) {
          console.error(err);
        }
        console.log(
          "--------------- NUMBER OF FILES IN CHOSEN DIRECTORY: " +
            fileList.length +
            "--------------------------"
        );
      } else {
        this.setRepoPath("");
      }
      //console.log("repo:");
      //console.log(this.getRepoPath);
    },
    // -----
    async loadFilters() {
      let arr = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
      });
      if (!arr.canceled && arr.filePaths[0]) {
        for (const el of arr.filePaths) {
          // TODO check for existing filter id
          //console.log(el);
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
      //console.log(this.getFilters);
    },
    resetFiltersButton() {
      this.resetFilters();
    },
    // -----
    async startVisualization() {
      if (this.getRepoPath != "") {
        //console.log(`The Path of the repository is: ${this.getRepoPath}`);

        let graph = await ce.getGraph(this.getRepoPath);
        let nodeFilters = this.getNodeFilters;
        let edgeFilters = this.getEdgeFilters;

        for (const filter of nodeFilters) {
          await ce.filterNode(graph, filter);
          //console.log(graph);
        }
        for (const filter of edgeFilters) {
          await ce.filterEdge(graph, filter);
          //console.log(graph);
        }
        await this.setGraph(graph);
        this.$router.push({ path: "extractor/networkNew/" });
      } else {
        dialog.showMessageBox({
          title: "No valid entry",
          message: "You have to have at least a repo.",
        });
      }
      //let nodesTemp = JSON.parse(JSON.stringify(this.getNodes));
      //let edgesTemp = JSON.parse(JSON.stringify(this.getEdges));
      //console.log(nodesTemp[2]);
      //console.log(edgesTemp[2]);
      //let edgeFiltersTemp = JSON.parse(JSON.stringify(this.getNodeFilters));
      //console.log(edgeFiltersTemp[0]);
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
    isRepoPathEmpty() {
      //console.log(this.getRepoPath);
      return this.getRepoPath != "";
    },
  },
};
</script>
