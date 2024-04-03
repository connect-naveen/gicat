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
          <button class="button" id="downloadButton" v-on:click="downloadSVG()">
            DOWNLOAD
          </button>
          <br />
          <button
            class="button"
            id="simulationButton"
            v-on:click="toggleSimulation()"
          >
            <span>PAUSE</span>
            <!-- <v-icon icon="mdi-pause-circle"></v-icon> -->
            <v-icon
              v-if="this.physicsEnabled"
              icon="mdi-pause-circle"
              size="50"
            ></v-icon>
            <v-icon
              v-if="!this.physicsEnabled"
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
        <v-network-graph
          ref="graph"
          class="graph"
          :zoom-level="0.5"
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :event-handlers="eventHandlers"
        >
          <template #override-node="{ nodeId, ...slotProps }">
            <rect
              width="300"
              height="50"
              :fill="nodes[nodeId].color"
              v-bind="slotProps"
              x="-150"
              y="-25"
              rx="25"
            />
          </template>
          <template
            #override-node-label="{
              text,
              //nodeId,
              //scale,
              //x,
              //y,
              //config,
              //textAnchor,
              //dominantBaseline
            }"
          >
            <text
              x="0"
              y="0"
              font-size="20"
              text-anchor="middle"
              dominant-baseline="central"
              fill="#ffffff"
            >
              {{ text }}
            </text>
          </template>
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label
              :text="edge.label"
              align="center"
              vertical-align="above"
              v-bind="slotProps"
            />
          </template>
        </v-network-graph>
      </div>
    </div>
  </v-main>
</template>

<script>
/* eslint-disable */
import { reactive, ref, watch, toRaw } from "vue"
import { mapActions, mapGetters } from "vuex";
import * as vNG from "v-network-graph";
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout";
import { mdiPause } from "@mdi/js";

const getForcedLayout = new ForceLayout({
  positionFixedByDrag: true,
  positionFixedByClickWithAltKey: true,
  createSimulation: (d3, nodes, edges) => {
    // d3-force parameters
    const forceLink = d3.forceLink(edges).id(d => d.id)
    return d3
      // .forceSimulation(nodes)
      // .force("edge", forceLink.distance(40).strength(0.5))
      // .force("charge", d3.forceManyBody().strength(-800))
      // .force("center", d3.forceCenter().strength(0.05))
      // .alphaMin(0.001)

      // .forceSimulation(nodes)
      // .force("edge", forceLink.distance(100))
      // .force("charge", d3.forceManyBody())
      // .force("collide", d3.forceCollide(50).strength(0.2))
      // .force("center", d3.forceCenter().strength(0.05))
      // .alphaMin(0.001)
      
      .forceSimulation(nodes)
      .force("edge", forceLink.distance(75).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-7000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .stop() // tick manually,
      .tick(100)
      //.alphaMin(0.0001)
  }
});

export default {
  setup() {
    const graph = ref(null);
    return {graph};
  },
  mounted() {
    this.initGraph();
    console.log(this.graph);
  },
  data() {
    return {
      eventHandlers: {
        // wildcard: capture all events
        "*": (type, event) => {
          console.log(type, event);
          if(event instanceof Object) {
            if (type == "node:dblclick") {
              this.doubleClick(event.node);
            } 
          }
        },
      },
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
      configs: vNG.defineConfigs({
        view: {
          scalingObjects: true,
          layoutHandler: getForcedLayout,
        },
        edge: {
          margin: 10,
          marker: {
            target: {
              type: "arrow"
            }
          },
          label: {
            fontSize: 25,
          }
        },
        node: {
          // label: {
          //   visible: false,
          // },
          // normal: {
          //   type: "rectangle",
          //   radius: 16,
          //   // for type is "rect" -->
          //   width: 32,
          //   height: 32,
          //   borderRadius: 4,
          //   // <-- for type is "rect"
          //   strokeWidth: 0,
          //   strokeColor: "#000000",
          //   strokeDasharray: "0",
          //   color: "#4466cc",
          // },
        },
      }),
      physicsEnabled: true,
      savedLayout: null,
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

    // |=================================================================|
    // |   ______ _    _ _   _  _____ _______ _____ ____  _   _  _____   |
    // |  |  ____| |  | | \ | |/ ____|__   __|_   _/ __ \| \ | |/ ____|  |
    // |  | |__  | |  | |  \| | |       | |    | || |  | |  \| | (___    |
    // |  |  __| | |  | | . ` | |       | |    | || |  | | . ` |\___ \   |
    // |  | |    | |__| | |\  | |____   | |   _| || |__| | |\  |____) |  |
    // |  |_|     \____/|_| \_|\_____|  |_|  |_____\____/|_| \_|_____/   |
    // |                                                                 |
    // |=================================================================|

    initGraph() {
      // making deep copy of nodes and edges
      let inputNodes = JSON.parse(JSON.stringify(this.getNodes));
      let inputEdges = JSON.parse(JSON.stringify(this.getEdges));

      // formatting nodes to fit v-network-graph standard
      inputNodes.forEach((node) =>{
        this.changeObjectKey(node, "label", "name");
        node.color = this.stringToColour(node.group);
      });
      
      // formatting edges to fit v-network-graph standard
      inputEdges.forEach((edge) =>{
        // this.changeObjectKey(edge, "from", "source");
        edge.source = inputNodes.findIndex((node) => edge.from === node.id).toString();
        // this.changeObjectKey(edge, "to", "target");
        edge.target = inputNodes.findIndex((node) => edge.to === node.id).toString();
      });

      this.nodes = Object.assign({}, inputNodes);
      this.edges = Object.assign({}, inputEdges);
    },
    stringToColour(str) {
      let hash = 0;
      str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
      });
      let colour = '#';
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, '0');
      }
      return colour;
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
    doubleClick(hitNodeIndex) {
      console.warn("double click");

      let hitNode = this.nodes[hitNodeIndex];

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
        this.openFile(hitNodeIndex);
      }
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
    openFile(nodeIndex) {
      console.warn("open file function");

      const { spawn } = require("child_process");
      const fs = require("fs");
      const editorPath = this.getEditorPath;

      if (editorPath === "") {
        return;
      }

      let path = this.nodes[nodeIndex].id.split('|')[0];

      const exists = fs.existsSync(path);
      if (!exists) {
        console.error("editor not found");
      }

      const opts = {
        detached: true,
      };

      try {
        if (this.getIsVsCode) {
          path += ":" + (this.nodes[nodeIndex].meta.line ?? 0) + ":0";
          spawn(editorPath, ["--goto", path], opts);
        } else {
          spawn(editorPath, [path], opts);
        }
      } catch (error) {
        console.error("editor not found");
        return;
      }
    },
    toggleSimulation() {
      if (this.physicsEnabled) {
        this.savedLayout = this.configs.view.layoutHandler;
        this.configs.view.layoutHandler = new vNG.SimpleLayout();
        this.physicsEnabled = false;
      } else {
        this.configs.view.layoutHandler = new ForceLayout();
        this.physicsEnabled = true;
      }
    },
    async downloadSVG() {
      // destructure proxy:
      const graph = {...this.graph};

      const text = await graph.exportAsSvgText();
      const url = URL.createObjectURL(new Blob([text], { type: "octet/stream" }));
      const a = document.createElement("a");
      a.href = url;
      const filename = this.getRepoPath.split("/").slice(-1);
      const date = new Date();
      const dateString =
        date.getFullYear() + "-" +
        (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "-" +
        (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()) +
        "-" + date.getHours() + "-" + date.getMinutes();
      a.download = filename + "_" + dateString + ".svg"; // filename to download
      a.click();
      window.URL.revokeObjectURL(url);
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
      "getRepoPath",
    ]),
    getFilterNames() {
      return this.getFilters.map((filter) => filter.name);
    },
    getOptions() {
      return this.options;
    },
    getPhysicsEnabled() {
      return this.physicsEnabled;
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
