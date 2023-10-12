<template>
  <div class="network">
    <div class="network-nav">
      <div class="network-nav-left">
        <!-- put filter specific options here, depending on the selection -->
        <v-select
          class="filter-selector"
          label="Select"
          :items="this.getFilterNames"
          density="compact"
        ></v-select>
      </div>
      <div class="network-nav-divider"></div>
      <div class="network-nav-right">
        <!-- put visualization controls here -->
        <button
          class="button"
          id="simulationButton"
          v-on:click="toggleSimulation()"
        >
          <!-- <v-icon icon="mdi-pause-circle"></v-icon> -->
          <v-icon
            v-if="this.options.physics.enabled"
            icon="mdi-pause-circle"
            size="50"
          ></v-icon>
          <v-icon
            v-if="!this.options.physics.enabled"
            icon="mdi-play-circle"
            size="50"
          ></v-icon>
          <v-tooltip activator="parent" location="start">
            Pause Simulation
          </v-tooltip>
        </button>
      </div>
      <!-- <li v-for="filter in this.getFilters" v-bind:key="filter.name">
        <button class="button" v-on:click="toggleFilter()">
          {{ filter.name }}
        </button>
      </li> -->
    </div>
    <div>
      <Network
        ref="network"
        class="net"
        :nodes="this.nodes"
        :edges="this.edges"
        :options="getOptions"
        :events="['doubleClick']"
        @double-click="doubleClick"
      ></Network>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Network } from "vue3-visjs";

export default {
  mounted() {
    this.initGraph();
  },
  data() {
    return {
      test: ["a", "b", "c"],
      nodes: [],
      edges: [],
      options: {
        nodes: {
          borderWidth: 3,
        },
        edges: {
          color: "lightgray",
          selectionWidth: function (width) {
            return width * 6;
          },
        },
        layout: {
          // hierarchical: {
          //   direction: "DU",
          //   sortMethod: "directed"
          // }
        },
        physics: {
          enabled: true,
        },
      },
      filtersHidden: [],
    };
  },
  name: "NetworkView",
  components: {
    Network,
  },
  methods: {
    // store
    ...mapActions([
      "setNodes",
      "setEdges",
      "setGraph",
      "addNodeFilter",
      "addEdgeFilter",
      "addFilter",
    ]),

    // functions
    initGraph() {
      this.nodes = JSON.parse(JSON.stringify(this.getNodes));
      this.edges = JSON.parse(JSON.stringify(this.getEdges));
    },
    back() {
      this.$router.push("/extractor");
    },
    doubleClick(params) {
      console.log("clicked");

      let isNode = params.nodes.length > 0;
      if (!isNode) {
        return;
      }

      let hitNodeIndex = this.getNodes.findIndex(
        (el) => el.id == params.nodes[0]
      );
      let hitNode = this.getNodes.find((el) => el.id == params.nodes[0]);

      this.hit = hitNode;
      console.log("AAA", this.hit);

      // let isFile = this.isFile(hitNode);
      let isFolder = this.isFolder(hitNode);
      // console.log(
      //   `This node is a file: ${isFile}, This node is a folder: ${isFolder}`
      // );
      if (isFolder) {
        this.collapseChildren(hitNode, hitNodeIndex);
      } else {
        this.openFile({
          fileName: hitNode.group,
          line: hitNode.meta.line,
        });
      }
    },
    // collapseChildren(hitNode, hitNodeIndex) {
    collapseChildren(hitNode) {
      if (hitNode.childrenCollapsed) {
        hitNode.childrenCollapsed = false;
      } else {
        hitNode.childrenCollapsed = true;
      }
      let nodes = this.nodes;
      let condition = (e) => e.id.startsWith(hitNode.id) && e.id != hitNode.id;
      // let children = this.getNodes.filter(e => e.id.startsWith(hitNode.id) && e.id != hitNode.id)
      let children = nodes.filter((e) => condition(e));
      children.forEach((element) => {
        if (hitNode.childrenCollapsed) {
          this.hideNode(element);
        } else {
          this.showNode(element);
        }
      });
    },
    hideNode(node) {
      node.hidden = true;
      node.label += "-hidden";
    },
    showNode(node) {
      if (node.label.slice(-7) === "-hidden") {
        node.label = node.label.slice(0, -7);
      }
      if (node.label.slice(-7) != "-hidden") {
        node.hidden = false;
      }
    },
    isFolder(node) {
      return !this.isFile(node) && node.meta.filterID == null;
    },
    isFile(node) {
      return node.meta.file === true;
    },
    toggleFilter() {
      // param: filterID

      // let nodes = this.nodes.filter((el) => el.meta.filterID == filterID);
      // console.log(this.filtersHidden);

      // let isHidden = this.filtersHidden.includes(filterID);
      // console.log(isHidden);

      // TODO: Add possibility to hide filters
      console.warn("TODO: Add possibility to hide filters");

      // console.log(nodes);
      // console.log(this.nodes);
    },
    openFile(data) {
      const { spawn } = require("child_process");
      const fs = require("fs");
      const editorPath = "/snap/bin/code";

      // TODO dialog for finding vscode or other code editor

      let path = data.fileName;

      const exists = fs.existsSync(path);
      if (!exists) {
        console.error("editor not found");
      }
      path += ":" + (data.line ?? 0) + ":0";

      const opts = {
        detached: true,
      };

      spawn(editorPath, ["--goto", path], opts);
    },
    toggleSimulation() {
      let old = this.options.physics.enabled;
      console.log("old", old);
      this.options.physics.enabled = !old;
      console.log("new", this.options.physics.enabled);
      this.$refs.network.setOptions(this.options);
      this.$refs.network.$forceUpdate();
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
    getFilterNames() {
      return this.getFilters.map((filter) => filter.name);
    },
    getOptions() {
      return this.options;
    },
  },
};
</script>

<style>
.network {
  height: 100%;
  width: 100%;
}

.network-nav {
  /* height: 50px; */
  display: flex;
}

.network-nav-left {
  flex: auto;
  margin-left: 3px;
}

.network-nav-right {
  width: 200px;
}

.network-nav-divider {
  /* width: 1px; */
  /* background-color: lightgrey; */
  border: 0.5px solid rgb(230, 230, 230);
  border-radius: 50px;
}

.filter-selector {
  width: 250px;
  height: 50px;
}

.net {
  height: 100%;
  width: 100%;
  position: fixed;
  border-top: 1px solid #00549f;
}

#simulationButton {
  height: 100%;
  float: right;
  border-radius: 100%;
  line-height: 0px;
}
</style>
