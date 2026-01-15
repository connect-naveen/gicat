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
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
const { ipcRenderer } = window.require ? window.require("electron") : {};
import { persistentStore } from "../store/persistentStore";

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

    /**
     * Opens a dialog to select the code editor path and updates the store accordingly.
     * TODO: implement this more robustly for different code editors and add error handling.
     * @return {Promise<void>}
     */
    async openEditor() {
      let editorPath = await dialog.showOpenDialog({
        properties: ["openFile"],
      });
      let platform = ipcRenderer
        ? await ipcRenderer.invoke("get-platform")
        : "";
      if (!editorPath.canceled && editorPath.filePaths[0]) {
        this.persStore.setEditorPath(editorPath.filePaths[0]);
        let baseName = ipcRenderer
          ? await ipcRenderer.invoke(
              "get-basename",
              this.persStore.getEditorPath
            )
          : "";
        if (baseName.split(".")[0] === "code") {
          this.persStore.setIsVsCode(true);
        } else if (
          platform === "darwin" &&
          baseName.split(".")[0] === "Visual Studio Code"
        ) {
          this.persStore.setIsVsCode(true);
        } else {
          this.persStore.setIsVsCode(false);
        }
      } else {
        this.setEditorPath("");
        this.persStore.setEditorPath("");
        this.persStore.setIsVsCode(false);
      }
    },
  },
  computed: {
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
