<template>
  <div class="extractor">
    <h1>This is the extractor page</h1>
    <svg-icon type="mdi" :path="path"></svg-icon>
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount } from "@mdi/js";

export default {
  name: "ExtractorView",
  components: {
    SvgIcon,
  },

  data() {
    return {
      path: mdiAccount,
    };
  },
};
</script>
