<template>
  <v-main>
    <div class="options">
      <h1>Option page</h1>
      <p>
        Here you can choose your Code Editor of choice to further inspect the
        program code. You can also decide to save the code editor path in a
        preference file on your system to store the path persistently.
      </p>
      <p>
        We suggest using VS Code since some of our features might not work
        correctly for other code editors.
      </p>
    </div>
    <div>
      <div>Current path of your code editor:</div>
      <div>{{ persStore.getEditorPath }}</div>
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
//const { app } = require("@electron/remote");
//const fs = require("node:fs");
import * as path from "path";
import { persistentStore } from "../store/persistentStore";
//const { systemPreferences } = require("@electron/remote");

export default {
  setup() {
    const persStore = persistentStore();
    return {
      persStore,
    };
  },
  data() {
    return {};
  },
  name: "OptionsView",
  components: {},
  methods: {
    // store
    ...mapActions(["setEditorPath", "setIsVsCode"]),

    // functions
    async savePreferences() {},
    async openEditor() {
      let editorPath = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      let platform = os.platform();
      if (!editorPath.canceled && editorPath.filePaths[0]) {
        //this.setEditorPath(editorPath.filePaths[0]);
        this.persStore.setEditorPath(editorPath.filePaths[0]);
        // Editor Path for VS Code and Platform is not MacOS
        if (
          path.basename(this.persStore.getEditorPath).split(".")[0] === "code"
        ) {
          this.setIsVsCode(true);
          // Platform is Mac OS and VS Code is Editor
        } else if (
          platform === "darwin" &&
          path.basename(this.persStore.getEditorPath).split(".")[0] ===
            "Visual Studio Code"
        ) {
          this.setIsVsCode(true);
        } else {
          this.setIsVsCode(false);
        }
      } else {
        this.setEditorPath("");
        this.persStore.setEditorPath("");
        this.setIsVsCode(false);
      }
      //console.log(editorPath);
    },
  },
  computed: {
    // store
    ...mapGetters(["getEditorPath", "getIsVsCode"]),
  },
  editorPath: {
    get() {
      return this.persStore.getEditorPath();
    },
    set(payload) {
      this.persStore.setEditorPath(payload);
    },
  },
};
</script>
