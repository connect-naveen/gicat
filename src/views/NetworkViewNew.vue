<template>
  <v-main style="border-right: 4px solid">
    <div class="network">
      <div class="network-nav">
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
        <v-slider
          v-model="dist"
          :step="50"
          :min="-1000"
          :max="2000"
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

      <div class="renderer">
        <v-btn
          icon
          @click.stop="handleMetricsDrawer()"
          class="position-fixed"
          :style="{ right: drawer ? '250px' : '0', zIndex: 10 }"
          variant="text"
        >
          <v-icon>{{ drawer ? "$outRight" : "$outLeft" }}</v-icon>
        </v-btn>
        <v-navigation-drawer
          v-model="drawer"
          v-if="drawer !== null"
          location="right"
          temporary
          scrim
        >
          <v-list>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-list-subheader
                  v-bind="props"
                  class="text-center justify-center"
                >
                  NODE FREQUENCY THRESHOLD
                </v-list-subheader>
              </template>
              <span>
                This shows the node labels that appear most frequently in the
                graph. You can adjust the slider to increase or decrease the
                threshold.
              </span>
            </v-tooltip>

            <v-list-item>
              <v-slider
                v-model="frequencySlider"
                label="Frequency:"
                step="1"
                :max="25"
                :min="2"
                @update:model-value="getFrequentNodes(frequencySlider)"
              ></v-slider>
            </v-list-item>
            <v-list-item
              v-for="(value, key) in getFrequentNodes(frequencySlider)"
              :key="key"
            >
              <v-list-item-content>
                <v-list-item-title>{{ key }}</v-list-item-title>
                <v-list-item-subtitle
                  >Frequency: {{ value }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-list-subheader
                  v-bind="props"
                  class="text-center justify-center"
                >
                  FREQUENT TARGET NODES
                </v-list-subheader>
              </template>
              <span>
                These are nodes that are most frequently targeted by edges (i.e.
                most incoming connections).
              </span>
            </v-tooltip>

            <v-list-item
              v-for="target in getFrequentTargets()"
              :key="target.node"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ target.label }}: {{ target.count }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
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
              class="testClass"
              :width="
                this.isFolder(nodes[nodeId])
                  ? Math.max(nodes[nodeId].name.length * 20, 200)
                  : Math.max(nodes[nodeId].name.length * 12, 200)
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
              :rx="this.isFolder(nodes[nodeId]) ? 2 : 25"
              v-if="
                !nodes[nodeId].hidden && this.isFilterSelected(nodes[nodeId])
              "
            />
            <div
              width="0"
              height="0"
              fill="white"
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
                this.isFolder(nodes[nodeId])
                  ? nodes[nodeId].name.length * 20 >= 200
                    ? 0
                    : (200 - nodes[nodeId].name.length * 20) / 2
                  : nodes[nodeId].name.length * 12 >= 200
                  ? 0
                  : (200 - nodes[nodeId].name.length * 12) / 2
              "
              y="0"
              :font-size="this.isFolder(nodes[nodeId]) ? 30 : 20"
              :font-weight="this.isFolder(nodes[nodeId]) ? 'bold' : 'normal'"
              text-anchor="middle"
              dominant-baseline="middle"
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
              align="center"
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
              :transform="
                makeTransform(center, position, scale, hovered, selected)
              "
              :fill="
                this.edgeHidden(edge) || this.edgeLabelHidden(edge)
                  ? 'white'
                  : 'black'
              "
              :fill-opacity="
                this.edgeHidden(edge) || this.edgeLabelHidden(edge) ? 0 : 1
              "
              v-bind="slotProps"
            />
          </template>
        </v-network-graph>
      </div>
    </div>
  </v-main>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapGetters } from "vuex";
import * as vNG from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { persistentStore } from "../store/persistentStore";
const os = require("node:os");

const getForcedLayout = new ForceLayout({
  positionFixedByDrag: true,
  positionFixedByClickWithAltKey: true,
  createSimulation: (d3, nodes, edges) => {
    // d3-force parameters
    const forceLink = d3.forceLink(edges).id((d) => d.id);
    return d3
      .forceSimulation(nodes)
      .force("edge", forceLink.distance(500).strength(5000))
      .force("charge", d3.forceManyBody().strength(-7000))
      .force("collide", d3.forceCollide(5).iterations(10))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaMin(0.0001);
  },
});

export default {
  setup() {
    const graph = ref(null);
    return { graph };
  },
  mounted() {
    this.initGraph();
    this.drawer = false;
  },
  data() {
    return {
      frequencySlider: 2,
      drawer: null,
      eventHandlers: {
        // wildcard: capture all events
        "*": (type, event) => {
          //console.log(type, event);
          if (event instanceof Object) {
            if (type == "node:dblclick") {
              this.doubleClick(event.node);
            }
            if (type == "node:contextmenu") {
              this.rightClick(event.node);
            }
            if (type == "node:click") {
              this.leftClick(event.node);
            }
          }
        },
      },
      playPause: "Pause",
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
          selectable: true,
          normal: {
            color: (node) => node.color,
            strokeWidth: 1,
            strokeColor: "#000000",
            width: "300",
            height: "50",
          },
          hover: {
            strokeWidth: 6,
            color: (node) => node.color,
            strokeColor: "#000000",
            width: "300",
            height: "50",
          },
          selected: {
            strokeWidth: 6,
            strokeColor: "#000000",
            width: "0",
            height: "50",
          },
          focusring: {
            visible: false,
          },
        },
        edge: {
          normal: {
            color: (edge) =>
              edge.label &&
              !(this.edgeHidden(edge) | this.edgeLabelHidden(edge))
                ? edge.color
                : this.edgeHidden(edge) | this.edgeLabelHidden(edge)
                ? "#ffffff"
                : "#000000",
            width: 2,
            dasharray: "0",
          },
          selectable: 50,
          selected: {
            width: 6,
            color: (edge) =>
              edge.label &&
              !(this.edgeHidden(edge) | this.edgeLabelHidden(edge))
                ? edge.color
                : this.edgeHidden(edge) | this.edgeLabelHidden(edge)
                ? "#ffffff"
                : "#000000",
            dasharray: "0",
          },
          hover: {
            width: 6,
            color: (edge) =>
              edge.label &&
              !(this.edgeHidden(edge) | this.edgeLabelHidden(edge))
                ? edge.color
                : this.edgeHidden(edge) | this.edgeLabelHidden(edge)
                ? "#ffffff"
                : "#000000",
            dasharray: "0",
          },
          zOrder: {
            enabled: true,
            bringToFrontOnHover: false,
            bringToFrontOnSelected: true,
            zIndex: (edge) =>
              this.edgeHidden(edge) | this.edgeLabelHidden(edge) ? 1 : 2,
          },
          label: {
            fontSize: 30,
            margin: 20,
          },
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

    makeTransform(center, edgePos, scale, hovered, selected) {
      const radian = Math.atan2(
        edgePos.target.y - edgePos.source.y,
        edgePos.target.x - edgePos.source.x
      );
      const degree = (radian * 180.0) / Math.PI;

      if (hovered || selected) {
        return [
          `translate(${center.x} ${center.y})`,
          `scale(${scale * 3.5}, ${scale * 3.5})`,
          `rotate(${degree})`,
        ].join(" ");
      }
      return [
        `translate(${center.x} ${center.y})`,
        `scale(${scale * 2.5}, ${scale * 2.5})`,
        `rotate(${degree})`,
      ].join(" ");
    },

    handleMetricsDrawer() {
      this.drawer = !this.drawer;
    },

    getFrequentTargets() {
      const edges = this.getEdges;
      const nodes = this.getNodes;

      const counts = {};

      // Count each target node
      edges.forEach((edge) => {
        const target = edge.to;
        counts[target] = (counts[target] || 0) + 1;
      });

      // Map counts to objects with node ID, label, and count
      const result = Object.entries(counts).map(([nodeId, count]) => {
        const match = nodes.find((n) => n.id === nodeId);
        return {
          node: nodeId,
          label: match ? match.label : nodeId,
          count: count,
        };
      });

      // Filter by count > 2 returning only nodes that are not trivial
      const filtered = result.filter((entry) => entry.count > 2);

      // Sort descending
      filtered.sort((a, b) => b.count - a.count);

      return filtered;
    },

    getFrequentNodes(i) {
      const occ = {};
      for (let node of this.getNodes) {
        //console.log(node.meta.filterID);
        occ[node.label] = (occ[node.label] || 0) + 1;
      }

      const filteredOcc = {};
      for (let el in occ) {
        if (occ[el] > i) {
          filteredOcc[el] = occ[el];
        }
      }
      return filteredOcc;
    },
    getNodeFilterNumbers(i) {
      var j = 0;
      for (let k = 0; k < this.getNodes.length; k++) {
        if (this.getNodes[k].meta.filterID === i) {
          j++;
        }
      }
      return "Quantity: " + j;
    },
    initGraph() {
      // making deep copy of nodes and edges
      let inputNodes = JSON.parse(JSON.stringify(this.getNodes));
      let inputEdges = JSON.parse(JSON.stringify(this.getEdges));

      // formatting nodes to fit v-network-graph standard
      // also sets default values for nodes
      inputNodes.forEach((node, index) => {
        /* default values */
        node.childrenCollapsed = false;
        node.hidden = false;
        node.index = index;
        // this is needed for hiding within nested folder
        node.hiddenCounter = 0;
        /* reformat for v-network-graph */
        this.changeObjectKey(node, "label", "name");
        node.color = node.meta.color;
      });

      // formatting edges to fit v-network-graph standard
      inputEdges.forEach((edge) => {
        edge.hidden = false;
        edge.hiddenCounter = 0;
        // this.changeObjectKey(edge, "from", "source");
        edge.source = inputNodes
          .findIndex((node) => edge.from === node.id)
          .toString();
        // this.changeObjectKey(edge, "to", "target");
        edge.target = inputNodes
          .findIndex((node) => edge.to === node.id)
          .toString();
        edge.color = edge.meta.color;
      });
      // this.nodes = Object.assign({}, inputNodes);
      this.nodes = inputNodes;
      this.edges = inputEdges;

      let appliedFilters = this.getFilterItems();
      this.filters = appliedFilters;
      //this.filtersSelected = appliedFilters;
    },
    getFilterItems() {
      return this.getFilters.map((filter) => {
        return {
          name: filter.name,
          value: filter.id,
        };
      });
    },
    isFilterSelected(node) {
      if (node.meta?.filterID) {
        return this.filtersSelected.includes(node.meta.filterID);
      }
      return true;
    },
    isEdgeFilterSelected(edge) {
      if (edge.meta?.filter) {
        return this.filtersSelected.includes(edge.meta.filter);
      }
      return true;
    },
    changeObjectKey(o, old_key, new_key) {
      if (old_key !== new_key) {
        Object.defineProperty(
          o,
          new_key,
          Object.getOwnPropertyDescriptor(o, old_key)
        );
        delete o[old_key];
      }
    },
    back() {
      this.$router.push("/extractor");
    },
    doubleClick(hitNodeIndex) {
      console.warn("double click");

      let hitNode = this.nodes[hitNodeIndex];
      if (hitNode.hidden) return;
      let isFolder = this.isFolder(hitNode);
      if (isFolder) {
        this.collapseChildren(hitNode);
      } else {
        this.openFile(hitNodeIndex);
      }
    },
    rightClick() {
      console.log("collapse children of node: ");
      this.getNodes.forEach((node) => {
        console.log(node.label);
      });
    },
    leftClick(node) {
      let selectedNode = this.nodes[node];
      selectedNode.meta.active = !selectedNode.meta.active;
      //console.log(node.label + " is active: " + selectedNode.meta.active);
    },
    collapseChildren(hitNode) {
      console.warn("collapse children");
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
      return (
        this.nodes[edge.source].hidden |
        this.nodes[edge.target].hidden |
        !this.isFilterSelected(this.nodes[edge.source]) |
        !this.isFilterSelected(this.nodes[edge.target])
      );
    },
    edgeLabelHidden(edge) {
      return (
        this.nodes[edge.source].hidden |
        this.nodes[edge.target].hidden |
        !this.isFilterSelected(this.nodes[edge.source]) |
        !this.isFilterSelected(this.nodes[edge.target]) |
        !this.isEdgeFilterSelected(edge)
      );
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
      const persStore = persistentStore();
      console.log(persStore.getIsVsCode);

      if (persStore.getEditorPath === "") {
        return;
      }

      let path = this.nodes[nodeIndex].id.split("|")[0];

      const exists = fs.existsSync(path);
      if (!exists) {
        console.log("editor" + persStore.getEditorPath + " not found");
        console.error("editor not found");
      }

      const opts = {
        detached: true,
      };

      try {
        let platform = os.platform();
        if (persStore.getIsVsCode && platform !== "darwin") {
          path += ":" + (this.nodes[nodeIndex].meta.line ?? 0) + ":0";
          spawn(persStore.getEditorPath, ["--goto", path], opts);
        } else if (persStore.getIsVsCode && platform === "darwin") {
          console.log("VS Code erkannt:");
          let ep = persStore.getEditorPath + "/Contents/MacOS/Electron";
          path += ":" + (this.nodes[nodeIndex].meta.line ?? 0) + ":0";
          console.log("Spawn VS Code path: " + ep);
          spawn(ep, ["--goto", path], opts);
          // trying to guess the name of the code editors exe file on MacOS.
          // Won't work in most cases! Only VS Code has guaranteed support!
        } else if (!this.getVsCode && platform === "darwin") {
          let macOSPath = function (applicationPath) {
            let regexp = /\/([aA-zZ +]*)\.app/g;
            const array = [...applicationPath.matchAll(regexp)];
            const appName = array[0][1];
            return applicationPath + "/Contents/MacOS/" + appName;
          };
          console.log(macOSPath(persStore.getEditorPath));
          //path += ":" + (this.nodes[nodeIndex].meta.line ?? 0);
          console.log(path);
          spawn(macOSPath(persStore.getEditorPath) + " " + path, [], opts);
        } else {
          spawn(persStore.getEditorPath, [path], opts);
        }
      } catch (error) {
        console.log("editor" + persStore.getEditorPath + " not found");
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
    computePhysics() {
      let newForcedLayout = new ForceLayout({
        positionFixedByDrag: true,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          // d3-force parameters
          const forceLink = d3.forceLink(edges).id((d) => d.id);
          return (
            d3
              .forceSimulation(nodes)
              .force(
                "edge",
                forceLink.distance(this.dist).strength(this.strength)
              )
              .force("charge", d3.forceManyBody().strength(this.charge))
              .force("x", d3.forceX())
              .force("y", d3.forceY())
              //.stop() // tick manually,
              .tick(1)
              .alpha(1)
              .velocityDecay(0.8)
          );
        },
      });
      this.configs.view.layoutHandler = newForcedLayout;
      this.physicsEnabled = true;
      this.playPause = "Pause";
    },
    async downloadSVG() {
      // destructure proxy:
      const graph = { ...this.graph };

      const text = await graph.exportAsSvgText();
      const url = URL.createObjectURL(
        new Blob([text], { type: "octet/stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      const filename = this.getRepoPath.split("/").slice(-1);
      const date = new Date();
      const dateString =
        date.getFullYear() +
        "-" +
        (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) +
        "-" +
        (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()) +
        "-" +
        date.getHours() +
        "-" +
        date.getMinutes();
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
.renderer {
  height: 100%;
  width: 100%;
}

.network-nav {
  /* height: 50px; */
  margin-top: 15px;
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
  width: 97%;
  height: 100%;
  border: 1px solid #000;
}

.slider {
  margin-left: 100px;
}
</style>
