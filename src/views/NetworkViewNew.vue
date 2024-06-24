<template>
  <v-main>
    <div class="network">
      <div class="network-nav">
        <!--<div class="network-nav-left">
          put filter specific options here, depending on the selection
          <v-select
            class="filter-selector"
            label="Select"
            :items="this.getFilterNames"
            density="compact"
          ></v-select>
        </div>
      -->
        <!-- put visualization controls here -->
        <v-btn
          v-on:click="downloadSVG()"
          prepend-icon="$fileExport"
          class="button"
        >
          Download
        </v-btn>
        <br />
        <br />
        <v-btn
          v-on:click="toggleSimulation()"
          prepend-icon="$playpause"
          class="button"
        >
          {{ playPause }}
        </v-btn>
        <v-select
          class="filter-selector"
          label="Select..."
          :items="this.filters"
          density="compact"
          multiple
          chips
          name="id"
          item-title="name"
          v-model="this.filtersSelected"
        ></v-select>
        <!-- <li v-for="filter in this.getFilters" v-bind:key="filter.name">
        <button class="button" v-on:click="toggleFilter()">
          {{ filter.name }}
        </button>
      </li> -->
        <v-slider
          v-model="dist"
          :step="50"
          :min="-1000"
          :max="1000"
          :end="computePhysics()"
          class="slider"
          label="Edge distance:"
        ></v-slider>
        <v-slider
          v-model="strength"
          :step="0.05"
          :min="0"
          :max="2"
          :end="computePhysics()"
          class="slider"
          label="Edge strength:"
        ></v-slider>
        <v-slider
          v-model="charge"
          :step="500"
          :min="-20000"
          :max="0"
          :end="computePhysics()"
          class="slider"
          label="Graph strength:"
        ></v-slider>
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
          <template #override-node="{ config, nodeId, ...slotProps }">
            <rect
              :width="
                this.isFolder(nodes[nodeId])
                  ? Math.max(nodes[nodeId].name.length * 20, 200)
                  : nodes[nodeId].name.length * 12
              "
              :height="config.height"
              :fill="nodes[nodeId].color"
              :stroke="config.strokeColor"
              :stroke-width="config.strokeWidth"
              v-bind="slotProps"
              :x="
                this.isFolder(nodes[nodeId])
                  ? -(nodes[nodeId].name.length * 20) / 2
                  : -(nodes[nodeId].name.length * 12) / 2
              "
              y="-25"
              rx="25"
              v-if="
                !nodes[nodeId].hidden && this.isFilterSelected(nodes[nodeId])
              "
            />
            <div
              width="0"
              height="0"
              :fill="nodes[nodeId].color"
              v-bind="slotProps"
              x="-100"
              y="-25"
              rx="15"
              v-else
            ></div>
          </template>
          <template #override-node-label="{ text, nodeId }">
            <text
              :x="
                nodes[nodeId].name.length * 20 >= 200
                  ? 0
                  : (200 - nodes[nodeId].name.length * 20) / 2
              "
              y="0"
              :font-size="this.isFolder(nodes[nodeId]) ? 30 : 20"
              :font-weight="this.isFolder(nodes[nodeId]) ? 'bold' : 'normal'"
              text-anchor="middle"
              dominant-baseline="central"
              fill="#ffffff"
              v-if="
                !nodes[nodeId].hidden && this.isFilterSelected(nodes[nodeId])
              "
            >
              {{ text }}
            </text>
            <text v-else></text>
          </template>
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label
              :text="edge.label"
              :fill-opacity="edgeLabelHidden(edge) ? 0 : 1"
              vertical-align="above"
              v-bind="slotProps"
            />
          </template>
          <template
            #edge-overlay="{
              scale,
              center,
              position,
              hovered,
              selected,
              edge,
              ...slotProps
            }"
          >
            <!-- Place the triangle at the center of the edge -->
            <path
              class="marker"
              :class="{ hovered, selected }"
              d="M-5 -5 L5 0 L-5 5 Z"
              :transform="makeTransform(center, position, scale)"
              :fill="this.edgeHidden(edge) ? 'white' : 'black'"
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
import { ref } from "vue"
import { mapActions, mapGetters } from "vuex";
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { getTransitionRawChildren } from "vue";
import { reactive } from "vue";

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

      // .forceSimulation(nodes)
      // .force("edge", forceLink.distance(100))
      // .force("charge", d3.forceManyBody())
      // .force("collide", d3.forceCollide(50).strength(0.2))
      // .force("center", d3.forceCenter().strength(0.05))
      
      .forceSimulation(nodes)
      .force("edge", forceLink.distance(50).strength(5000))
      .force("charge", d3.forceManyBody().strength(-7000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      //.stop() // tick manually,
      //.tick(1)
      .alphaMin(0.0001)
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
            if (type == "node:contextmenu") {
              this.rightClick(event.node);
            }
            if (type == "node:click") {
              this.leftClick(event.node)
            }
          }
        },
      },
      playPause: "Pause",
      nod: {
        node1: { name: "Node 1"},
        node2: { name: "Node 2"},
        node3: { name: "Node 3"},
        node4: { name: "Node 4"},
      },
      edg: {
        edge1: { source: "node1", target: "node2" },
        edge2: { source: "node2", target: "node3" },
        edge3: { source: "node3", target: "node4" },
      },
      test: ["a", "b", "c"],
      nodes: [],
      edges: [],
      filters: [],
      filtersSelected: [],
      dist: 0,
      strength: 1,
      charge: -12000,
      configs: vNG.defineConfigs({
        view: {
          scalingObjects: true,
          layoutHandler: getForcedLayout,
         },
         node: {
          selectable: 12,
          focusring: {
            visible: false,
            width: 4,
            padding: 13,
            color: "#eebb00",
          },
          normal: {
            strokeWidth: 1,
            strokeColor: "#000000",
            width:"300",
            height:"50"
          },
          hover: {
            strokeWidth: 6,
            strokeColor: "#000000",
            width:"300",
            height:"50"
          },
          selected: {
            strokeWidth: 8,
            strokeColor: "#000000",
            width:"300",
            height:"50",
          },
        },
        edge: {
          normal: {
            width: (edge) => this.edgeHidden(edge) ? 0 : 2,
          },
          selectable: 12,
          selected: {
            width: (edge) => this.edgeHidden(edge) ? 0 : 6,
            color: "#4466cc",
            dasharray: false,
          },
          hover: {
            width: (edge) => this.edgeHidden(edge) ? 0 : 6,
          },
          label: {
            fontSize: 30,
            margin: 20,
          }
        }
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
    makeTransform(center, edgePos, scale) {
      const radian = Math.atan2(
        edgePos.target.y - edgePos.source.y,
        edgePos.target.x - edgePos.source.x
      )
      const degree = (radian * 180.0) / Math.PI
      
      return [
        `translate(${center.x} ${center.y})`,
        `scale(${scale * 2.5}, ${scale * 2.5})`,
        `rotate(${degree})`,
      ].join(" ")
    },

    initGraph() {
      // making deep copy of nodes and edges
      let inputNodes = JSON.parse(JSON.stringify(this.getNodes));
      let inputEdges = JSON.parse(JSON.stringify(this.getEdges));

      // formatting nodes to fit v-network-graph standard
      // also sets default values for nodes
        inputNodes.forEach((node, index) =>{
        /* default values */
        node.childrenCollapsed = false;
        node.hidden = false;
        node.index = index;
        // this is needed for hiding within nested folder
        node.hiddenCounter = 0;
        /* reformat for v-network-graph */
        this.changeObjectKey(node, "label", "name");
        node.color = this.stringToColour(node.group);
      });
      
      // formatting edges to fit v-network-graph standard
      inputEdges.forEach((edge) =>{
        edge.hidden = false;
        edge.hiddenCounter = 0;
        // this.changeObjectKey(edge, "from", "source");
        edge.source = inputNodes.findIndex((node) => edge.from === node.id).toString();
        // this.changeObjectKey(edge, "to", "target");
        edge.target = inputNodes.findIndex((node) => edge.to === node.id).toString();
      });
      // this.nodes = Object.assign({}, inputNodes);
      this.nodes = inputNodes;
      this.edges = inputEdges;

      let appliedFilters = this.getFilterItems();
      this.filters = appliedFilters;
      //this.filtersSelected = appliedFilters;
    },
    getFilterItems() {
      return this.getFilters.map((filter, index) => {
        return {
          name: filter.name,
          value: filter.id,
        }
      });
    },
    isFilterSelected(node) {
      if (node.meta?.filterID) {
        return this.filtersSelected.includes(node.meta.filterID);
      }
      return true;
    },
    isEdgeFilterSelected(edge){
      if(edge.meta?.filter) {
        return this.filtersSelected.includes(edge.meta.filter);
      }
      return true;
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
      if(hitNode.hidden) return;
      let isFolder = this.isFolder(hitNode);
      if (isFolder) {
        this.collapseChildren(hitNode);
      } else {
        this.openFile(hitNodeIndex);
      }
    },
    rightClick(node) {
      console.log("collapse children of node: ")
      this.getNodes.forEach((node) => {
        console.log(node.label)
      }
    )
  },
  leftClick(node) {
    let selectedNode = this.nodes[node];
    selectedNode.meta.active = !selectedNode.meta.active
    console.log(node.label + " is active: " + selectedNode.meta.active)
  },
    collapseChildren(hitNode) {
      console.warn("colapse children");
      if (hitNode.childrenCollapsed) {
          hitNode.childrenCollapsed = false;
      } else {
        hitNode.childrenCollapsed = true;
      } 
      let isChildren = (e) => e.id.startsWith(hitNode.id) && e.id != hitNode.id;
      let children = this.nodes.filter((e) => isChildren(e));
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
      node.hiddenCounter += 1;
    },
    showNode(node) {
      if (node.hiddenCounter > 0) {
        node.hiddenCounter -= 1;
      }
      if (node.hiddenCounter === 0) {
        node.hidden = false;
      }
    },
    edgeHidden(edge) {
    return this.nodes[edge.source].hidden | this.nodes[edge.target].hidden | !this.isFilterSelected(this.nodes[edge.source])
      | !this.isFilterSelected(this.nodes[edge.target]);
    },
    edgeLabelHidden(edge) {
    return this.nodes[edge.source].hidden | this.nodes[edge.target].hidden | !this.isFilterSelected(this.nodes[edge.source])
    | !this.isFilterSelected(this.nodes[edge.target]) | !this.isEdgeFilterSelected(edge);
    },
    isFolder(node) {
      return !this.isFile(node) && node.meta.filterID == null;
    },
    isFile(node) {
      return node.meta.file === true;
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
        this.playPause = "Play";
      } else {
        this.configs.view.layoutHandler = this.savedLayout;
        this.physicsEnabled = true;
        this.playPause = "Pause";
      }
    },
    computePhysics(){
      console.log("Distance parameter is equal to " + this.dist);
      let newForcedLayout = new ForceLayout({
        positionFixedByDrag: true,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          // d3-force parameters
          const forceLink = d3.forceLink(edges).id(d => d.id)
          return d3
            .forceSimulation(nodes)
            .force("edge", forceLink.distance(this.dist).strength(this.strength))
            .force("charge", d3.forceManyBody().strength(this.charge))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            //.stop() // tick manually,
            .tick(1)
            .alpha(1)
            .velocityDecay(0.8)
        }
       });
          this.configs.view.layoutHandler = newForcedLayout;
          this.physicsEnabled = true;
          this.playPause = "Pause";
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
  margin-top: 15px;
}

.network-nav-divider {
  /* width: 1px; */
  /* background-color: lightgrey; */
  border: 0.5px solid rgb(230, 230, 230);
  border-radius: 50px;
}

.filter-selector {
  margin-left: 5px;
  margin-right: 5px;
  max-width: 25%;
  width: auto;
  height: auto;
}

.button {
  margin-left: 5px;
  margin-right: 5px;
}

.net {
  height: 100%;
  width: 100%;
  position: fixed;
  border-top: 1px solid #00549f;
}

.graph {
  width: 100%;
  height: 600px;
  border: 1px solid #000;
}

.slider {
  margin-left: 100px;
}
</style>
