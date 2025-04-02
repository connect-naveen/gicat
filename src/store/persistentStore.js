import { defineStore } from "pinia";

export const persistentStore = defineStore("persist", {
  state: () => ({
    editorPath: "",
    isVsCode: false,
  }),
  getters: {
    getEditorPath: (state) => state.editorPath,
    getIsVsCode: (state) => state.isVsCode,
  },
  actions: {
    setEditorPath(payload) {
      this.editorPath = payload;
    },
    setIsVsCode(payload) {
      this.isVsCode = payload;
    },
  },
  persist: true,
});
