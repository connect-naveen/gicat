<template>
  <v-main>
    <div class="home">
      <h1 id="header">GICAT</h1>
      <h4>General Isomorphic Code Analysis Tool</h4>
      <h6>v 0.9.3</h6>
      <ImageExplorer
        source="./assets/2_1_class_extension.jpg"
        caption="Caption"
      />
    </div>
    <h6>Copyright text</h6>
  </v-main>
</template>

<script>
// @ is an alias to /src
import ImageExplorer from "@/components/ImageExplorer.vue";

export default {
  name: "HomeView",
  components: {
    ImageExplorer,
  },
};
</script>
<style>
.home {
  width: 100%;
  height: 100%;
}
#header {
  margin-top: 20px;
  font-weight: bold;
  font-size: 300%;
  color: #407fb7;
  font-family: Georgia, "Times New Roman", Times, serif;
}

h6 {
  color: grey;
}
</style>
