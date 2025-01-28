<template>
  <v-main>
    <div class="options">
      <h1>This is an Option page</h1>
    </div>
    <div>
      <div>Current path of your code editor:</div>
      <div>{{ getEditorPath }}</div>
      <br />
      <v-btn id="codeEditorFinder" @click="openEditor()">
        Find Code Editor
      </v-btn>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
import * as path from "path";
//const { systemPreferences } = require("@electron/remote");

export default {
  data() {
    return {};
  },
  name: "OptionsView",
  components: {},
  methods: {
    // store
    ...mapActions(["setEditorPath", "setIsVsCode"]),

    // functions
    async openEditor() {
      let editorPath = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      console.log(editorPath);
      if (!editorPath.canceled && editorPath.filePaths[0]) {
        this.setEditorPath(editorPath.filePaths[0]);
        if (path.basename(this.getEditorPath).split(".")[0] === "code") {
          this.setIsVsCode(true);
        } else {
          this.setIsVsCode(false);
        }
      } else {
        this.setEditorPath("");
        this.setIsVsCode(false);
      }
      console.log(editorPath);
    },
  },
  computed: {
    // store
    ...mapGetters(["getEditorPath", "getIsVsCode"]),
  },
};
</script>
