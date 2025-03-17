<template>
  <figure>
    <div id="zoomContainer">
      <img id="zoomImage" :src="props.source" />
    </div>
    <figcaption>
      {{ props.caption }}
    </figcaption>
  </figure>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
const props = defineProps({
  source: String,
  caption: String,
});
let scale = 1;
onMounted(() => {
  const zoomImage = document.getElementById("zoomImage");
  document.getElementById("zoomImage").addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
      scale += e.deltaY * 0.01;
      scale = Math.min(Math.max(0.5, scale), 4);
      console.log(scale);
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
  margin-left: 5px;
}
#zoomContainer img {
  width: 1200px;
  height: 1200px;
  transform: scale(1);
}
</style>
