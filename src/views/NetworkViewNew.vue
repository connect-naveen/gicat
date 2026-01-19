<template>
  <v-main style="border-right: 4px solid">
    <div class="network">
      <div class="network-nav">
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
          class="slider"
          label="Edge distance:"
          rounded="0"
        ></v-slider>
        <v-slider
          v-model="strength"
          :step="0.05"
          :min="0"
          :max="2"
          class="slider"
          label="Edge strength:"
          rounded="0"
        ></v-slider>
        <v-slider
          v-model="charge"
          :step="500"
          :min="-20000"
          :max="0"
          class="slider"
          label="Graph strength:"
          rounded="0"
        ></v-slider>
      </div>

      <div class="renderer" @click="handleRendererClick">
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
          :permanent="false"
          :disable-resize-watcher="true"
          :disable-route-watcher="true"
          :touchless="true"
          :scrim="false"
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
                rounded="0"
                @update:model-value="getFrequentNodes(frequencySlider)"
              ></v-slider>
            </v-list-item>
            <v-list-item
              v-for="(value, key) in getFrequentNodes(frequencySlider)"
              :key="key"
              @click="highlightNodesByLabel(key)"
              :class="{
                'highlighted-entry': highlightedDrawerLabels.includes(key),
              }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ key }}</v-list-item-title>
                <v-list-item-subtitle>
                  Frequency: {{ value }}
                </v-list-item-subtitle>
                <v-menu>
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      class="mr-2"
                      icon="$chevronDown"
                    ></v-icon>
                  </template>
                  <v-color-picker
                    hide-canvas
                    hide-inputs
                    :model-value="getLabelColor(key)"
                    @update:model-value="setLabelColor(key, $event)"
                    width="200"
                    height="150"
                  >
                    <template #actions>
                      <v-tooltip text="reset" location="top">
                        <template #activator="{ props }">
                          <v-icon
                            v-bind="props"
                            @click="setLabelColor(key, '#000000')"
                            icon="$undo"
                            style="cursor: pointer"
                          ></v-icon>
                        </template>
                      </v-tooltip>
                    </template>
                  </v-color-picker>
                </v-menu>
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
              v-for="target in getFrequentTargets(frequencySlider)"
              :key="target.node"
              @click="highlightNodesByLabel(target.label)"
              :class="{
                'highlighted-entry': highlightedDrawerLabels.includes(
                  target.label
                ),
              }"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ target.label }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Target of {{ target.count }} nodes
                </v-list-item-subtitle>
                <v-menu>
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      class="mr-2"
                      icon="$chevronDown"
                    ></v-icon>
                  </template>
                  <v-color-picker
                    hide-canvas
                    hide-inputs
                    :model-value="getLabelColor(target.label)"
                    @update:model-value="setLabelColor(target.label, $event)"
                    width="200"
                    height="150"
                  >
                    <template #actions>
                      <div
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        "
                      >
                        <v-tooltip text="reset" location="top">
                          <template #activator="{ props }">
                            <v-icon
                              v-bind="props"
                              @click="setLabelColor(target.label, '#000000')"
                              icon="$undo"
                              style="cursor: pointer"
                            ></v-icon>
                          </template>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-color-picker>
                </v-menu>
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
          :selected-nodes="selectedNodes"
        >
          <template #override-node="{ config, nodeId, ...slotProps }">
            <rect
              class="testClass"
              :width="
                isFolder(nodes[nodeId])
                  ? Math.max(nodes[nodeId].name.length * 20, 200)
                  : Math.max(nodes[nodeId].name.length * 12, 200)
              "
              :height="config.height"
              :fill="config.color"
              :stroke="config.strokeColor"
              :stroke-width="config.strokeWidth"
              v-bind="slotProps"
              :x="
                isFolder(nodes[nodeId])
                  ? -(nodes[nodeId].name.length * 20) / 2
                  : -(nodes[nodeId].name.length * 12) / 2
              "
              y="-25"
              :rx="isFolder(nodes[nodeId]) ? 2 : 25"
              v-if="!nodes[nodeId].hidden && isFilterSelected(nodes[nodeId])"
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
              {{ nodes[nodeId].name || text }}
              <title>{{ nodes[nodeId].fullLabel || text }}</title>
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
let ipcRenderer;
if (typeof window !== "undefined" && window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
  var os = window.require("os");
} else {
  ipcRenderer = null;
  var os = null;
}
import { persistentStore } from "../store/persistentStore";

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
      .force("collide", d3.forceCollide(5).iterations(2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaMin(0.05) // stop simulation sooner with higher alphaMin
      .alphaDecay(0.05) // faster decay with higher alphaDecay
      .velocityDecay(0.9); // higher friction with higher velocityDecay
  },
});

export default {
  setup() {
    const graph = ref(null);
    return { graph };
  },
  mounted() {
    this.layoutHandler = new ForceLayout({
      positionFixedByDrag: true,
      positionFixedByClickWithAltKey: true,
      createSimulation: (d3, nodes, edges) => {
        const forceLink = d3.forceLink(edges).id((d) => d.id);
        const sim = d3
          .forceSimulation(nodes)
          .force("edge", forceLink.distance(this.dist).strength(this.strength))
          .force("charge", d3.forceManyBody().strength(this.charge))
          .force("collide", d3.forceCollide(5).iterations(4))
          .force("x", d3.forceX())
          .force("y", d3.forceY())
          .alphaMin(0.0001);
        this.simulation = sim;
        return sim;
      },
    });
    this.configs.view.layoutHandler = this.layoutHandler;
    this.initGraph();
    this.drawer = false;
  },
  data() {
    return {
      frequencySlider: 2,
      drawer: null,
      highlightedDrawerLabels: [],
      eventHandlers: {
        // wildcard: capture all events
        "*": (type, event) => {
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
      nodes: [],
      edges: [],
      filters: [],
      filtersSelected: [],
      dist: 0,
      strength: 1,
      charge: -12000,
      layoutHandler: null,
      configs: vNG.defineConfigs({
        view: {
          scalingObjects: true,
          layoutHandler: getForcedLayout,
        },
        node: {
          selectable: true,
          normal: {
            color: (node) => node.color,
            strokeWidth: 3,
            strokeColor: (node) => node.strokeColor, // use node.strokeColor
            width: "300",
            height: "50",
          },
          hover: {
            strokeWidth: 6,
            color: (node) => node.color,
            strokeColor: (node) => node.strokeColor,
            width: "300",
            height: "50",
          },
          selected: {
            strokeWidth: 6,
            strokeColor: (node) => node.strokeColor,
            color: (node) => node.color,
            width: "300",
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
      selectedNodes: [],
      labelColors: {}, // { [label]: color }
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

    /**
     * Handle click events on the renderer.
     * Clears selection if the background is clicked and empties the selectedNodes array.
     * @param event - The click event object.
     */
    handleRendererClick(event) {
      if (event.target.classList.contains("v-ng-canvas")) {
        this.selectedNodes = [];
        this.highlightedDrawerLabels = [];
        // Set isActive to false for all nodes
        Object.values(this.nodes).forEach((node) => {
          if (node.meta) node.meta.active = false;
        });
      } else {
        console.log("Clicked on graph element:", event.target);
      }
    },

    /**
     * Creates a transform string for positioning and rotating an edge label (triangle).
     * @param center - The center point of the edge.
     * @param edgePos - The positions of the source and target nodes of the edge.
     * @param scale - The scale factor for the label.
     * @param hovered - Whether the edge is hovered.
     * @param selected - Whether the edge is selected.
     */
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

    /**
     * Toggles the visibility of the metrics drawer.
     */
    handleMetricsDrawer() {
      this.drawer = !this.drawer;
    },

    /**
     * Gets frequent target nodes based on a threshold.
     * This is used by the metrics drawer to show nodes that are frequently targeted by edges.
     * @param threshold - The minimum number of incoming edges to consider a target frequent.
     */
    getFrequentTargets(threshold) {
      const nodes = Object.values(this.nodes);
      const edges = this.edges;

      const nodeMap = {};
      nodes.forEach((n) => (nodeMap[n.id] = n));

      // Count incoming edges for each target node, and also count how many are from active filter nodes
      const counts = {};
      const filteredCounts = {};

      edges.forEach((edge) => {
        const target = edge.to;
        const sourceNode = nodeMap[edge.from];
        counts[target] = (counts[target] || 0) + 1;
        if (sourceNode && this.isFilterSelected(sourceNode)) {
          filteredCounts[target] = (filteredCounts[target] || 0) + 1;
        }
      });

      // Map counts to objects with node ID, label, and count
      const result = Object.entries(counts).map(([nodeId, count]) => {
        const match = nodeMap[nodeId];
        return {
          node: nodeId,
          label: match ? match.label : nodeId,
          count: count,
          nodeObj: match,
          filteredCount: filteredCounts[nodeId] || 0,
        };
      });

      // For file nodes: show only if filteredCount >= threshold
      // For non-file nodes: show if count >= threshold and node is in active filter
      const filtered = result.filter((entry) => {
        if (!entry.nodeObj) return false;
        if (this.isFile(entry.nodeObj)) {
          return entry.filteredCount >= threshold;
        } else {
          return (
            entry.count >= threshold && this.isFilterSelected(entry.nodeObj)
          );
        }
      });
      filtered.sort((a, b) => b.count - a.count);
      return filtered;
    },

    /**
     * Gets frequent nodes based on a threshold.
     * This is used by the metrics drawer to show nodes that appear frequently in the graph.
     * @param i - The minimum frequency for a node to be considered frequent.
     */
    getFrequentNodes(i) {
      const occ = {};
      for (let node of this.getNodes) {
        occ[node.label] = (occ[node.label] || 0) + 1;
      }

      // Filter and create array of [label, frequency]
      const filteredArr = Object.entries(occ)
        .filter(([label, freq]) => {
          const nodeObj = this.getNodes.find((n) => n.label === label);
          return freq > i && nodeObj && this.isFilterSelected(nodeObj);
        })
        .sort((a, b) => b[1] - a[1]);

      const sortedObj = Object.fromEntries(filteredArr);
      return sortedObj;
    },

    /**
     * Gets the number of nodes that belong to a specific filter.
     * @param i - The filter ID to count nodes for.
     */
    getNodeFilterNumbers(i) {
      var j = 0;
      for (let k = 0; k < this.getNodes.length; k++) {
        if (this.getNodes[k].meta.filterID === i) {
          j++;
        }
      }
      return "Quantity: " + j;
    },

    /**
     * Initializes the graph by processing nodes and edges from the store.
     * Sets up node and edge properties, colors, and filters.
     */
    initGraph() {
      let inputNodes = JSON.parse(JSON.stringify(this.getNodes));
      let inputEdges = JSON.parse(JSON.stringify(this.getEdges));

      inputNodes.forEach((node, index) => {
        node.childrenCollapsed = false;
        node.hidden = false;
        node.index = index;
        node.hiddenCounter = 0;
        node.fullLabel = node.label;
        node.name = node.label ? node.label.substring(0, 20) : "";
        node.color = node.meta.color;
        node.strokeColor = "#000000"; // default border color
        // Initialize labelColors if not set
        if (!this.labelColors[node.label]) {
          this.labelColors[node.label] = node.color || "#2196f3";
        }
        node.meta = node.meta || {};
        node.selected = false;
      });

      inputEdges.forEach((edge) => {
        edge.hidden = false;
        edge.hiddenCounter = 0;
        edge.source = edge.from; // Make sure edge.from is a valid node id
        edge.target = edge.to; // Make sure edge.to is a valid node id
        edge.color = edge.meta.color;
      });

      // Use object for nodes, array for edges
      this.nodes = Object.fromEntries(
        inputNodes.map((node) => [node.id, node])
      );
      this.edges = inputEdges; // <-- Use array for edges

      let appliedFilters = this.getFilterItems();
      this.filters = appliedFilters;
    },

    /**
     * Gets active filter items.
     */
    getFilterItems() {
      return this.getFilters.map((filter) => {
        return {
          name: filter.name,
          value: filter.id,
        };
      });
    },

    /**
     * Checks if a node's filter is selected.
     * @param node - The node to check.
     * @returns True if the node's filter is selected, otherwise false.
     */
    isFilterSelected(node) {
      if (node.meta?.filterID) {
        return this.filtersSelected.includes(node.meta.filterID);
      }
      return true;
    },

    /**
     * Checks if an edge's filter is selected.
     * @param edge - The edge to check.
     * @returns True if the edge's filter is selected, otherwise false.
     */
    isEdgeFilterSelected(edge) {
      if (edge.meta?.filter) {
        return this.filtersSelected.includes(edge.meta.filter);
      }
      return true;
    },

    /**
     * Gets the color associated with a node label.
     * @param label - The label of the node.
     * @returns The color associated with the label, or black if not set.
     */
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

    /**
     * Double click event handler for nodes.
     * @param hitNodeIndex - The index of the node that was double clicked.
     */
    doubleClick(hitNodeIndex) {
      //console.warn("double click");

      let hitNode = this.nodes[hitNodeIndex];
      if (hitNode.hidden) return;
      let isFolder = this.isFolder(hitNode);
      if (isFolder) {
        this.collapseChildren(hitNode);
      } else {
        this.openFile(hitNodeIndex);
      }
    },

    /**
     * Right click event handler for nodes.
     */
    rightClick() {
      console.log("collapse children of node: ");
      this.getNodes.forEach((node) => {
        console.log(node.label);
      });
    },

    /**
     * Left click event handler for nodes.
     * @param nodeId - The ID of the node that was left clicked.
     */
    leftClick(nodeId) {
      let selectedNode = this.nodes[nodeId];
      selectedNode.meta.active = !selectedNode.meta.active;
      console.log(
        selectedNode.label + " is active: " + selectedNode.meta.active
      );

      if (selectedNode.meta.active) {
        // Add to selectedNodes if not already present
        if (!this.selectedNodes.includes(nodeId)) {
          this.selectedNodes.push(nodeId);
        }
      } else {
        // Remove from selectedNodes
        this.selectedNodes = this.selectedNodes.filter((id) => id !== nodeId);
      }
    },

    /**
     * Highlights or unhighlights nodes by their label.
     * This is used by the metrics drawer to highlight nodes when their label is clicked.
     * @param label - The label of the nodes to highlight or unhighlight.
     */
    highlightNodesByLabel(label) {
      const idx = this.highlightedDrawerLabels.indexOf(label);
      if (idx === -1) {
        this.highlightedDrawerLabels.push(label);
      } else {
        this.highlightedDrawerLabels.splice(idx, 1);
      }
      // Find matching nodes
      const nodeIds = Object.keys(this.nodes);
      const matchingNodeIds = nodeIds.filter((nodeId) => {
        const node = this.nodes[nodeId];
        return node && node.label === label;
      });

      // Trigger leftClick for each matching node to simulate actual clicks
      matchingNodeIds.forEach((nodeId) => {
        this.leftClick(nodeId);
      });
    },

    /**
     * Toggles the collapsed state of a node's children.
     * This is used when double-clicking on folder nodes.
     * @param hitNode - The node whose children will be toggled.
     */
    collapseChildren(hitNode) {
      console.warn("collapse children");
      if (hitNode.childrenCollapsed) {
        hitNode.childrenCollapsed = false;
      } else {
        hitNode.childrenCollapsed = true;
      }
      let isChildren = (e) => e.id.startsWith(hitNode.id) && e.id != hitNode.id;
      let children = Object.values(this.nodes).filter((e) => isChildren(e));
      children.forEach((element) => {
        if (hitNode.childrenCollapsed) {
          this.hideNode(element);
        } else {
          this.showNode(element);
        }
      });
    },
    /**
     * Hides a node by setting its hidden property to true and incrementing its hiddenCounter.
     * @param node - The node to hide.
     */
    hideNode(node) {
      node.hidden = true;
      node.hiddenCounter += 1;
    },

    /**
     * Shows a node by decrementing its hiddenCounter and setting its hidden property to false if the counter reaches zero.
     * @param node - The node to show.
     */
    showNode(node) {
      if (node.hiddenCounter > 0) {
        node.hiddenCounter -= 1;
      }
      if (node.hiddenCounter === 0) {
        node.hidden = false;
      }
    },

    /**
     * Checks if an edge should be hidden based on the visibility and filter status of its source and target nodes.
     * @param edge The edge to check.
     * @returns True if the edge should be hidden, otherwise false.
     */
    edgeHidden(edge) {
      return (
        this.nodes[edge.source].hidden |
        this.nodes[edge.target].hidden |
        !this.isFilterSelected(this.nodes[edge.source]) |
        !this.isFilterSelected(this.nodes[edge.target])
      );
    },

    /**
     * Checks if an edge label should be hidden based on the visibility and filter status of its source and target nodes, as well as edge-specific filters.
     * @param edge The edge to check.
     * @returns True if the edge label should be hidden, otherwise false.
     */
    edgeLabelHidden(edge) {
      return (
        this.nodes[edge.source].hidden |
        this.nodes[edge.target].hidden |
        !this.isFilterSelected(this.nodes[edge.source]) |
        !this.isFilterSelected(this.nodes[edge.target]) |
        !this.isEdgeFilterSelected(edge)
      );
    },
    /**
     * Checks if a node is a folder based on its properties.
     * @param node The node to check.
     * @returns True if the node is a folder, otherwise false.
     */
    isFolder(node) {
      return !this.isFile(node) && node.meta.filterID == null;
    },

    /**
     * Checks if a node is a file based on its meta properties.
     * @param node The node to check.
     * @returns True if the node is a file, otherwise false.
     */
    isFile(node) {
      return node.meta.file === true;
    },

    /**
     * Opens a file in the configured editor.
     * Prefers VS Code if configured and available.
     * @param nodeIndex The index of the node representing the file to open.
     */
    async openFile(nodeIndex) {
      const persStore = persistentStore();
      if (!persStore.getEditorPath) return;

      let filePath = this.nodes[nodeIndex].id.split("|")[0];
      let exists = ipcRenderer
        ? await ipcRenderer.invoke("check-file-exists", filePath)
        : false;
      if (!exists) {
        console.error("File not found:", filePath);
        return;
      }

      let isVsCode = persStore.getIsVsCode;
      let platform = ipcRenderer
        ? await ipcRenderer.invoke("get-platform")
        : "";
      let isMacApp =
        !isVsCode &&
        platform === "darwin" &&
        persStore.getEditorPath.endsWith(".app");
      let line = this.nodes[nodeIndex].meta?.line ?? 0;

      if (ipcRenderer) {
        await ipcRenderer.invoke("open-file-in-editor", {
          editorPath: persStore.getEditorPath,
          filePath,
          isVsCode,
          line,
          isMacApp,
        });
      }
    },

    /**
     * Toggles the physics simulation on and off.
     * When paused, switches to a simple layout.
     * When resumed, restores the force layout and re-creates the simulation.
     */
    toggleSimulation() {
      if (this.physicsEnabled) {
        // Pause: switch to SimpleLayout, simulation reference is now invalid
        this.savedLayout = this.configs.view.layoutHandler;
        this.configs.view.layoutHandler = new vNG.SimpleLayout();
        this.simulation = null; // simulation is stopped
        this.physicsEnabled = false;
        this.playPause = "Play";
      } else {
        // Resume: restore ForceLayout and re-create simulation
        this.layoutHandler = new ForceLayout({
          positionFixedByDrag: true,
          positionFixedByClickWithAltKey: true,
          createSimulation: (d3, nodes, edges) => {
            const forceLink = d3.forceLink(edges).id((d) => d.id);
            const sim = d3
              .forceSimulation(nodes)
              .force(
                "edge",
                forceLink.distance(this.dist).strength(this.strength)
              )
              .force("charge", d3.forceManyBody().strength(this.charge))
              .force("collide", d3.forceCollide(5).iterations(2)) // 2-3 iterations max
              .force("x", d3.forceX())
              .force("y", d3.forceY())
              .alphaMin(0.01) // stop simulation sooner
              .alphaDecay(0.05) // faster decay
              .velocityDecay(0.9); // higher friction
            this.simulation = sim; // update reference
            return sim;
          },
        });
        this.configs.view.layoutHandler = this.layoutHandler;
        this.physicsEnabled = true;
        this.playPause = "Pause";
      }
    },

    /**
     * Downloads the current graph as an SVG file with metadata identifying the CSS-lab at RWTH Aachen University.
     */
    async downloadSVG() {
      const graph = { ...this.graph };
      let text = await graph.exportAsSvgText();

      // Add meta data
      const svgOpenTagMatch = text.match(/<svg[^>]*>/);
      if (svgOpenTagMatch) {
        const svgOpenTag = svgOpenTagMatch[0];
        const meta = `
  <metadata>
    <creator>GICAT</creator>
    <exported>${new Date().toISOString()}</exported>
    <description>GRAPH EXPORTED USING GICAT - CSS Lab at RWTH Aachen University</description>
  </metadata>
  `;
        text = text.replace(svgOpenTag, svgOpenTag + meta);
      }

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
      a.download = "gicat_" + filename + "_" + dateString + ".svg";
      a.click();
      window.URL.revokeObjectURL(url);
    },

    /**
     * Updates the physics forces in the simulation based on current parameters.
     */
    updatePhysicsForces() {
      if (!this.simulation) return;
      this.simulation
        .force("edge")
        ?.distance(this.dist)
        .strength(this.strength);
      this.simulation.force("charge")?.strength(this.charge);
      this.simulation.alpha(1).restart();
    },

    /**
     * Gets the color associated with a given label.
     * @param label The label for which to get the color.
     */
    getLabelColor(label) {
      return this.labelColors[label] || "#2196f3";
    },

    /**
     * Sets the color associated with a given label and updates the stroke color of all nodes with that label.
     * @param label The label for which to set the color.
     * @param color The color to set for the label.
     */
    setLabelColor(label, color) {
      this.labelColors[label] = color;
      // Update the strokeColor for all nodes with this label
      Object.values(this.nodes).forEach((node) => {
        if (node.label === label) {
          node.strokeColor = color;
        }
      });
      // Also update the strokeColor for nodes that are frequent targets
      this.getFrequentTargets(this.frequencySlider).forEach((target) => {
        if (target.label === label && this.nodes[target.node]) {
          this.nodes[target.node].strokeColor = color;
        }
      });
    },

    /**
     * Recreates the simulation with updated performance settings.
     */
    recreateSimulationPerformance() {
      this.layoutHandler = new ForceLayout({
        positionFixedByDrag: true,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          const forceLink = d3.forceLink(edges).id((d) => d.id);
          const sim = d3
            .forceSimulation(nodes)
            .force(
              "edge",
              forceLink.distance(this.dist).strength(this.strength)
            )
            .force("charge", d3.forceManyBody().strength(this.charge))
            .force("collide", d3.forceCollide(5).iterations(2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .alphaMin(0.01)
            .alphaDecay(0.05)
            .velocityDecay(0.9);
          this.simulation = sim;
          return sim;
        },
      });
      this.configs.view.layoutHandler = this.layoutHandler;
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

    /**
     * Gets the current options for the graph view.
     * @returns The current options object.
     */
    getOptions() {
      return this.options;
    },

    /**
     * Gets whether the physics simulation is currently enabled.
     * @returns True if physics is enabled, otherwise false.
     */
    getPhysicsEnabled() {
      return this.physicsEnabled;
    },

    /**
     * Computes a new ForceLayout instance with the current physics parameters.
     * @returns A new ForceLayout instance.
     */
    computePhysics() {
      let newForcedLayout = new ForceLayout({
        positionFixedByDrag: true,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          console.log("nodes: ", nodes);
          console.log("edges: ", edges);
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
      return newForcedLayout;
    },
  },
  watch: {
    dist() {
      this.recreateSimulationPerformance();
      this.physicsEnabled = true;
      this.playPause = "Pause";
    },
    strength() {
      this.recreateSimulationPerformance();
      this.physicsEnabled = true;
      this.playPause = "Pause";
    },
    charge() {
      this.recreateSimulationPerformance();
      this.physicsEnabled = true;
      this.playPause = "Pause";
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

.highlighted-entry {
  background-color: #f3f3f3 !important;
}
</style>
