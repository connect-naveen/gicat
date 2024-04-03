<template>
  <div class="hello">
    <h1>GICAT</h1>
    <div id="app">
      <Timeline ref="timeline" :items="items" :options="options" />
    </div>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
  </div>
</template>

<script>
import { Timeline } from "vue3-visjs";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
    Timeline,
  },
  data() {
    return {
      items: [
        {
          start: "2024-04-04",
          content: "GICAT alpha 0.2.0",
        },
        {
          start: "2024-05-01",
          content: "GICAT beta launch",
        },
      ],
      options: {
        editable: false,
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
