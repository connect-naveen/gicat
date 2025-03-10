import { defineStore } from "pinia";

export const persistentStore = defineStore("persist", {
  state: () => ({
    editorPath: "",
  }),
  getters: {
    getEditorPath: (state) => state.editorPath,
  },
  actions: {
    setEditorPath(payload) {
      this.editorPath = payload;
    },
  },
  persist: true,
});
