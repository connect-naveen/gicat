<template>
  <v-main>
    <div class="home">
      <h1 id="header">GICAT</h1>
      <h4>General Isomorphic Code Analysis Tool</h4>
      <h6>v 0.9.3</h6>
      <figure>
        <div id="zoomContainer">
          <img id="zoomImage" src="../assets/gicat_structure.svg" />
        </div>
        <figcaption>
          Project structure of the official GICAT Repository.
        </figcaption>
      </figure>
    </div>
    <br />
    <br />
    <h6>&#169; 2025, CSS Lab RWTH Aachen University</h6>
  </v-main>
</template>

<script setup>
import { onMounted } from "vue";
let scale = 1;
onMounted(() => {
  const zoomImage = document.getElementById("zoomImage");
  document.getElementById("zoomImage").addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
      scale += e.deltaY * 0.01;
      scale = Math.min(Math.max(0.5, scale), 4);
      //console.log(scale);
      zoomImage.style.transform = `scale(${scale})`;
      zoomImage.style.width += scale;
      zoomImage.style.height += scale;
    }
  });
});
</script>
<style scoped>
#zoomContainer {
  width: 400px;
  height: 400px;
  overflow: auto;
  border: solid black;
  margin: 0 auto;
}
#zoomContainer img {
  width: 1200px;
  height: 1200px;
  transform: scale(0.7);
}
#home figcaption {
  color: rebeccapurple;
}
</style>
