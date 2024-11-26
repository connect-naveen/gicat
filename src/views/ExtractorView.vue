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
        <div>Current path:</div>
        <div>{{ getRepoPath }}</div>
        <br />
        <v-btn
          id="startVisButton"
          prepend-icon="$folderArrowDown"
          @click="startVisualisation()"
          :disabled="!isRepoPathEmpty"
          >Start Visualisation
        </v-btn>
      </div>
      <v-dialog max-width="500">
        <template v-slot:default="{ isActive }">
          <v-card title="Dialog">
            <v-card-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Close Dialog"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
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
        this.isDirEmpty = false;
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
    async startVisualisation() {
      if (this.getRepoPath != "") {
        //console.log(`The Path of the repository is: ${this.getRepoPath}`);

        let graph = await ce.getGraph(this.getRepoPath);
        let nodeFilters = this.getNodeFilters;
        let edgeFilters = this.getEdgeFilters;
        let fileList;

        try {
          fileList = await readdir(this.getRepoPath, { recursive: true });
        } catch (err) {
          console.error(err);
        }
        console.log(
          "--------------- NUMBER OF FILES IN CHOSEN DIRECTORY: " +
            fileList.length +
            "--------------------------"
        );
        if (fileList.length > 50) {
          this.isActive.value = true;
        }

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
