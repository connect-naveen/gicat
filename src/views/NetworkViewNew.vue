<template>
  <v-main>
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
            <!--
              v-icon
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
            -->
          </button>
        </div>
        <!-- <li v-for="filter in this.getFilters" v-bind:key="filter.name">
          <button class="button" v-on:click="toggleFilter()">
            {{ filter.name }}
          </button>
        </li> -->
      </div>
      <div>
        <v-network-graph
          class="graph"
          :nodes="this.nodes"
          :edges="this.edges"
        />
      </div>
    </div>
  </v-main>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";

export default {
  mounted() {
    this.initGraph();
  },
  data() {
    return {
      nod: {
        node1: { name: "Node 1" },
        node2: { name: "Node 2" },
        node3: { name: "Node 3" },
        node4: { name: "Node 4" },
      },
      edg: {
        edge1: { source: "node1", target: "node2" },
        edge2: { source: "node2", target: "node3" },
        edge3: { source: "node3", target: "node4" },
      },
      test: ["a", "b", "c"],
      nodes: [],
      edges: [],
      options: {
        /* old:
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
        */
      },
      filtersHidden: [],
    };
  },
  name: "NetworkNewView",
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
    ]),

    // functions
    initGraph() {
      let inputNodes = JSON.parse(JSON.stringify(this.getNodes));
      let inputEdges = JSON.parse(JSON.stringify(this.getEdges));
      
      inputNodes.forEach((node) =>{
        this.changeObjectKey(node, "id", "name");
      });
      console.log(inputNodes);

      inputEdges.forEach((edge) =>{
        this.changeObjectKey(edge, "from", "source");
        this.changeObjectKey(edge, "to", "target");
      });
      console.log(Object.assign({}, inputEdges));

      this.nodes = Object.assign({}, inputNodes);
      inputEdges.push( {source: "0", target: "1"})
      this.edges = Object.assign({}, inputEdges);
      console.log("graph", this.nodes, this.edges);

    },
    changeObjectKey(o, old_key, new_key) {
      if (old_key !== new_key) {
        Object.defineProperty(o, new_key,
          Object.getOwnPropertyDescriptor(o, old_key));
        delete o[old_key];
      }
    },
    back() {
      this.$router.push("/extractor");
    },
    doubleClick(params) {
      console.warn("double click");
      /* old:
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
      */
    },
    collapseChildren(hitNode) {
      console.warn("colapse children");
      /* old:
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
      */
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
      console.warn("open file function");
      /*
      old:
        const { spawn } = require("child_process");
        const fs = require("fs");
        const editorPath = this.getEditorPath;

        if (editorPath === "") {
          return;
        }

        let path = data.fileName;

        const exists = fs.existsSync(path);
        if (!exists) {
          console.error("editor not found");
        }

        const opts = {
          detached: true,
        };

        try {
          if (this.getIsVsCode) {
            path += ":" + (data.line ?? 0) + ":0";
            spawn(editorPath, ["--goto", path], opts);
          } else {
            spawn(editorPath, [path], opts);
          }
        } catch (error) {
          console.error("editor not found");
          return;
        }
      */
    },
    toggleSimulation() {
      console.warn("toggle physics simulation");
    },
  },
  computed: {
    // store
    ...mapGetters([
      "getEditorPath",
      "getIsVsCode",
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
  margin-top: 6px;
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

.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>
