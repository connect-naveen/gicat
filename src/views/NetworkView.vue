<template>
  <div class="network">
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
    console.log(this.$store);
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
    };
  },
  name: "NetworkView",
  components: {
    Network,
  },
  methods: {
    // store
    ...mapActions(["setNodes", "setEdges", "setGraph"]),

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

      let isFile = this.isFile(hitNode);
      let isFolder = this.isFolder(hitNode);
      console.log(
        `This node is a file: ${isFile}, This node is a folder: ${isFolder}`
      );

      this.collapseChildren(hitNode, hitNodeIndex);
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
    toggleFilter(filterID) {
      let nodes = this.nodes.filter((el) => el.meta.filterID == filterID);
      let isHidden = this.filtersHidden.includes(filterID);

      nodes.forEach((el) => {
        if (!isHidden) {
          this.hideNode(el);
          this.filtersHidden.push(filterID);
        } else {
          this.showNode(el);
          this.filtersHidden = this.filtersHidden.filter((v) => v !== filterID);
        }
      });
    },
  },
  computed: {
    // store
    ...mapGetters(["getNodes", "getEdges", "getGraph"]),

    // functions
    getFilters() {
      return this.filters;
    },
  },
};
</script>

<style>
.network {
  height: 100%;
}
.net {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
