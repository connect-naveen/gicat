<template>
  <div class="network">
    <Network
      ref="network"
      class="net"
      :nodes="getNodes"
      :edges="getEdges"
      :options="options"
      :events="['doubleClick']"
      @double-click="toggleChildren"
    >
    </Network>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Network } from "vue3-visjs";

export default {
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

    // functins
    back() {
      this.$router.push("/extractor");
    },
    toggleChildren(params) {
      // rework needed, edges will end here
      if (params.nodes.length === 0) {
        return;
      }

      // debug
      console.log("Toggling Children!");
      console.log("Event Params:");
      console.log(params);
      console.log("Node found:");
      console.log(params.nodes[0]);

      // ?
      let temp = this.getNodes.find((el) => el.id == params.nodes[0]);
      console.log(temp);

      // actual code
      let isFile =
        this.getNodes.find((el) => el.id == params.nodes[0]).meta.file === true;
      let isFolder =
        !isFile &&
        this.getNodes.find((el) => el.id == params.nodes[0]).meta.filterID ==
          null;
      console.log(
        `This node is a file: ${isFile}, This node is a folder: ${isFolder}`
      );

      /*
      Folder:
        check all adjacent nodes
        if adjacent nodes id startes with folder id
          collapse all recursively into the folder node
      File:
        collapse all group members into the file
      */
      if (isFile) {
        console.log(this.$refs.network.getNode(params.nodes[0]));
      }
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
