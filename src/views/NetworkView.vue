<template>
  <div class="network">
    <div class="network-nav">
      <li v-for="filter in this.getFilters" v-bind:key="filter.name">
        <button class="button" v-on:click="toggleFilter()">
          {{ filter.name }}
        </button>
      </li>
    </div>
    <Network
      ref="network"
      class="net"
      :nodes="this.nodes"
      :edges="this.edges"
      :options="options"
      :events="['doubleClick']"
      @double-click="doubleClick"
    >
    </Network>
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

<style>
.network {
  height: 100%;
  width: 100%;
}

.network-nav {
  height: 20%;
}

.net {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
