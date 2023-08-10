<template>
  <div class="network">
    <Network
      ref="network"
      class="net"
      :nodes="getNodes"
      :edges="getEdges"
      :options="options"
      :events="['doubleClick']"
    >
    </Network>
  </div>
</template>

<script>
//       @double-click="toggleChildren"
import { mapActions, mapGetters } from "vuex";
import { Network } from "vue3-visjs";

export default {
  data() {
    return {
      nodes: [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ],
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
