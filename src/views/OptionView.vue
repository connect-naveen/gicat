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
      <br />
      <br />
      <v-btn id="savePreferences" @click="savePreferences()"> SAVE </v-btn>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
const os = require("node:os");
//const ipcRenderer = require("electron");
//const { app } = require("@electron/remote");
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
    async savePreferences() {
      console.log(window);
      console.log(window.contextIsolationOff.doSomething());
      //const filePath = await window.electronAPI.getPath();
      //console.log(filePath);
    },
    async openEditor() {
      let editorPath = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      let platform = os.platform();
      if (!editorPath.canceled && editorPath.filePaths[0]) {
        this.setEditorPath(editorPath.filePaths[0]);
        // Editor Path for VS Code and Platform is not MacOS
        if (path.basename(this.getEditorPath).split(".")[0] === "code") {
          this.setIsVsCode(true);
          // Platform is Mac OS and VS Code is Editor
        } else if (
          platform === "darwin" &&
          path.basename(this.getEditorPath).split(".")[0] ===
            "Visual Studio Code"
        ) {
          this.setIsVsCode(true);
        } else {
          this.setIsVsCode(false);
        }
      } else {
        this.setEditorPath("");
        this.setIsVsCode(false);
      }
      //console.log(editorPath);
    },
  },
  computed: {
    // store
    ...mapGetters(["getEditorPath", "getIsVsCode"]),
  },
};
</script>
