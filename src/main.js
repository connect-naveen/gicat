import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Icons
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import {
  mdiPackageVariantClosed,
  mdiHome,
  mdiFolderArrowDownOutline,
  mdiFolderArrowUpOutline,
  mdiFileSearchOutline,
  mdiArrowUDownLeft,
  mdiPackageVariantClosedPlus,
  mdiFileExportOutline,
  mdiPlus,
} from "@mdi/js";

// create Vuetify
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  defaults: {
    VBtn: {
      variant: "outlined",
      density: "comfortable",
      size: "large",
      rounded: "lg",
    },
    VToolbar: {
      color: "grey-lighten-4",
      elevation: 6,
    },
    VToolbarItems: {
      variant: "text",
      color: "#00549f",
    },
    VListGroup: {
      color: "red",
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      package: mdiPackageVariantClosed,
      home: mdiHome,
      folderArrowDown: mdiFolderArrowDownOutline,
      folderArrowUp: mdiFolderArrowUpOutline,
      fileSearch: mdiFileSearchOutline,
      arrowDownLeft: mdiArrowUDownLeft,
      packagePlus: mdiPackageVariantClosedPlus,
      fileExport: mdiFileExportOutline,
      plus: mdiPlus,
    },
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

createApp(App).use(store).use(router).use(vuetify).mount("#app");
