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
          Play/Pause
        </v-btn>
        <br />
        <br />
        <v-select
          class="filter-selector"
          label="Select..."
          :items="this.getFilterNames"
          density="compact"
        ></v-select>
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
          <template #override-node="{ config, nodeId, ...slotProps }">
            <rect
              :width="config.width"
              :height="config.height"
              :fill="nodes[nodeId].color"
              :stroke="config.strokeColor"
              :stroke-width="config.strokeWidth"
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
          <template
            #edge-overlay="{ scale, center, position, hovered, selected }"
          >
            <!-- Place the triangle at the center of the edge -->
            <path
              class="marker"
              :class="{ hovered, selected }"
              d="M-5 -5 L5 0 L-5 5 Z"
              :transform="makeTransform(center, position, scale)"
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
      .force("edge", forceLink.distance(50).strength(1))
      .force("charge", d3.forceManyBody().strength(-7000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .stop() // tick manually,
      .tick(1000)
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
         node: {
          selectable: 12,
          normal: {
            strokeWidth: 3,
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
            strokeWidth: 6,
            strokeColor: "#000000",
            width:"300",
            height:"50"
          },
        },
        edge: {
          selectable: 12,
          selected: {
            width: 6,
            color: "#4466cc",
            dasharray: false,
          },
          hover: {
            width: 6
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
        this.configs.view.layoutHandler = getForcedLayout;
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

</style>
