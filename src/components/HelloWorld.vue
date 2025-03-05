<template>
  <div class="hello">
    <h1>GICAT</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {},
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
