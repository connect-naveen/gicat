<template>
  <v-main>
    <div id="section">
      <v-card
        width="25%"
        color="#c7ddf2"
        density="comfortable"
        elevation="2"
        location="sticky right"
        class="text-center"
        position="fixed"
      >
        <v-list opened="true">
          <v-list-item
            value="explorer"
            title="Package Explorer"
            color="#00549f"
          ></v-list-item>
          <v-list-group v-if="json != null">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-package"
                :title="json.packageName"
              ></v-list-item>
            </template>
            <v-list-item
              v-if="json.authors"
              :title="'Author:' + json.authors"
              class="subItem"
            ></v-list-item>
            <v-list-item
              v-if="json.desc"
              :title="'Description:' + json.desc"
              class="subItem"
            ></v-list-item>
            <v-list-group
              v-for="filter in json['nodeFilterList']"
              :key="filter.name"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  :title="filter.name"
                  v-bind="props"
                  class="subItem"
                ></v-list-item>
              </template>
              <v-list-item
                :title="'Regex:' + filter.regex"
                class="subItem"
              ></v-list-item>
              <v-list-item
                v-if="filter.exclude != ''"
                :title="'Exclude:' + filter.exclude"
                class="subItem"
              ></v-list-item>
              <v-list-item
                v-if="filter.extension"
                :title="'File extension:' + filter.extension"
                class="subItem"
              ></v-list-item>
              <v-list-item
                v-if="filter.label"
                :title="'Node label:' + filter.label"
                class="subItem"
              ></v-list-item>
            </v-list-group>
            <v-list-group
              v-for="edge in json['edgeFilterList']"
              :key="edge.name"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  :title="edge.name"
                  v-bind="props"
                  class="subItem"
                ></v-list-item>
              </template>
              <v-list-item
                :title="'Edge label:' + edge.label"
                class="subItem"
              ></v-list-item>
              <v-list-item
                :title="'From:' + edge.from.attribute"
                class="subItem"
              ></v-list-item>
              <v-list-item
                :title="'To:' + edge.to.attribute"
                class="subItem"
              ></v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <v-form v-model="valid">
        <v-container>
          <h2>Package information</h2>
          <br />
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="packageName"
                label="Package Name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="packageAuthor"
                label="Author"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="description"
                label="Description"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-btn
                @click="generatePackage"
                :disabled="false"
                prepend-icon="mdi-package-variant-closed-plus"
              >
                Generate package
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                @click="exportFilter"
                prepend-icon="mdi-file-export-outline"
              >
                Export
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <br />
      <v-container>
        <h2>Node filter</h2>
        <br />
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="codeInput"
              label="Code snippet"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="generatorSelection"
              label="Select..."
              :items="[
                'Mandatory characters',
                'Arbitrary characters',
                'Period',
                'Force whitespace',
                'Exclude',
              ]"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-checkbox
              label="Assign capture Group"
              v-model="captureGroup"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="quantifier"
              label="Quantifier"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="generateRegex">Submit</v-btn>
          </v-col>
        </v-row>
        <br /><br />
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="generatedRegex"
              label="(Generated) Regex"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn @click="resetRegex" prepend-icon="mdi-arrow-u-left-top">
              Reset
            </v-btn>
          </v-col>
        </v-row>
        <br />
        <br />
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="fileExtension"
              label="File extension"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="regexName"
              label="Filter name"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="excludes"
              label="Exclude Regex"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <br /><br />
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nodeLabel"
              label="Node label"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nodeAttributes"
              label="Capture group name"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nodeCaptureGroups"
              label="Set capture groups"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="addNodeAttributes" prepend-icon="mdi-plus">
              Add
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-color-picker
              width="100%"
              show-swatches
              :swatches="swatches"
              swatches-max-height="400px"
              v-model="nodeColor"
            ></v-color-picker>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="labelAttributeSelection"
              label="Label attribute"
              :items="labelSelection"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn prepend-icon="mdi-plus" @click="addNodeFilter">
              Add filter
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <br /><br />
      <v-container>
        <h2>Edge filter</h2>
        <br />
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="edgeName"
              label="Edge filter name"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="loopSelection"
              label="Allow loops"
              :items="['True', 'False']"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <label for="fromSelection" v-if="this.json !== null">From:</label>
            <select v-model="fromSelection" v-if="this.json !== null">
              <option disabled value="">Select...</option>
              <option
                v-for="node in this.json['nodeFilterList']"
                v-bind:value="node.name"
                :key="node.name"
              >
                {{ node.name }}
              </option>
            </select>
          </v-col>
          <v-col cols="12" md="4">
            <label for="fromAttributeSelection" v-if="this.json !== null">
              Attribute:
            </label>
            <select v-model="fromAttributeSelection" v-if="this.json !== null">
              <option disabled value="">Select...</option>
              <option
                v-for="node in this.json['nodeFilterList']"
                v-bind:value="node.attributes"
                :key="node.name"
              >
                {{ node.attributes }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <label for="toSelection" v-if="this.json !== null">To:</label>
            <select v-model="toSelection" v-if="this.json !== null">
              <option disabled value="">Select...</option>
              <option
                v-for="node in this.json['nodeFilterList']"
                v-bind:value="node.name"
                :key="node.name"
              >
                {{ node.name }}
              </option>
            </select>
          </v-col>
          <v-col cols="12" md="4">
            <label for="toAttributeSelection" v-if="this.json !== null">
              Attribute:
            </label>
            <select v-model="toAttributeSelection" v-if="this.json !== null">
              <option disabled value="">Select...</option>
              <option
                v-for="node in this.json['nodeFilterList']"
                v-bind:value="node.attributes"
                :key="node.name"
              >
                {{ node.attributes }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="edgeLabel"
              :rules="nameRules"
              :counter="10"
              label="Edge label"
              hide-details
              @input="setEdgeLabel"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-color-picker
              width="100%"
              show-swatches
              :swatches="swatches"
              swatches-max-height="400px"
              v-model="edgeColorpicker"
            ></v-color-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <br />
            <v-btn prepend-icon="mdi-plus" @click="addEdgeFilter">
              Add filter
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <br />
  </v-main>
</template>
<script>
export default {
  name: "GeneratorView",
  components: {},
  data() {
    return {
      swatches: [
        ["#FF0000", "#AA0000", "#550000"],
        ["#FFFF00", "#AAAA00", "#555500"],
        ["#00FF00", "#00AA00", "#005500"],
        ["#0000FF", "#0000AA", "#000055"],
      ],
      filterPackage: {
        packageName: "",
        authors: "",
        desc: "",
        date: "",
        nodeFilterList: [],
        edgeFilterList: [],
      },
      json: null,
      mutation: "",
      edgeName: "",
      fromSelection: "",
      toSelection: "",
      edgeLabel: "",
      attributes: {},
      // return all V-Models
      packageName: "",
      packageAuthor: "",
      description: "",
      codeInput: "",
      quantifier: "",
      selected: "",
      generatedRegex: "",
      snippetSelection: "",
      generatorSelection: "",
      captureGroup: "",
      fileExtension: "",
      regexName: "",
      excludes: "",
      nodeLabel: "",
      nodeAttributes: "",
      nodeCaptureGroups: "",
      nodeColor: "",
      labelAttribute: "",
      labelAttributeSelection: "",
    };
  },
  computed: {
    labelSelection() {
      const opt = ["null"];
      if (this.json != null && Object.keys(this.attributes).length > 0) {
        for (let e in this.attributes) {
          opt.push(e);
        }
        console.log("Options after push: " + opt);
        return opt;
      }
      console.log("Options: " + opt);
      console.log("Atributes: " + Object.keys(this.attributes));
      return opt;
    },
  },
  props: {},
  methods: {
    isPackageNameSet() {
      return this.packageName != "";
    },
    nodeListDropdown() {
      if (document.getElementById("filterElement").style.display == "none") {
        document.getElementById("filterElement").style.display = "block";
      } else {
        document.getElementById("filterElement").style.display = "none";
      }
    },
    addNodeAttributes() {
      if (this.attributes == {}) {
        this.attributes = {
          [this.nodeAttributes]: this.nodeCaptureGroups
            .split(",")
            .map((e) => e.trim())
            .map((e) => Number(e)),
        };
      } else {
        this.attributes[this.nodeAttributes] = this.nodeCaptureGroups
          .split(",")
          .map((e) => e.trim())
          .map((e) => Number(e));
      }
    },
    resetRegex() {
      this.generatedRegex = "";
    },
    addNodeFilter() {
      this.json["nodeFilterList"].push({
        name: this.regexName,
        regex: this.generatedRegex,
        id: (this.json.packageName + this.regexName).replace(/\s/g, ""),
        spec: "node",
        exclude: [this.excludes],
        extension: this.fileExtension,
        attributes: this.attributes,
        style: { color: this.nodeColor },
        failures: [""],
        label: this.nodeLabel,
        labelAttribute: this.labelAttributeSelection,
      }),
        (this.attributes = {});
    },
    addEdgeFilter() {
      this.json["edgeFilterList"].push({
        "allow-loop": this.loopSelection,
        mode: this.modeSelection,
        label: this.edgeLabel,
        spec: "edge",
        id: (this.json.packageName + this.edgeName).replace(/\s/g, ""),
        name: this.edgeName,
        from: {
          nodeFilterID: (this.json.packageName + this.fromSelection).replace(
            /\s/g,
            ""
          ),
          attribute: this.fromAttributeSelection,
        },
        to: {
          nodeFilterID: (this.json.packageName + this.toSelection).replace(
            /\s/g,
            ""
          ),
          attribute: this.toAttributeSelection,
        },
        style: {
          color: this.edgeColorpicker,
        },
      });
    },
    generateRegex() {
      let snippetSelection = window.getSelection();
      if (
        this.generatorSelection == "Mandatory characters" &&
        this.captureGroup
      ) {
        this.generatedRegex =
          this.generatedRegex + "(" + snippetSelection + ")" + this.quantifier;
      } else if (
        this.generatorSelection == "Mandatory characters" &&
        !this.captureGroup
      ) {
        this.generatedRegex =
          this.generatedRegex + snippetSelection + this.quantifier;
      } else if (
        this.generatorSelection == "Arbitrary characters" &&
        this.captureGroup
      ) {
        this.generatedRegex =
          this.generatedRegex + "([A-Za-z]" + this.quantifier + ")";
      } else if (
        this.generatorSelection == "Arbitrary characters" &&
        !this.captureGroup
      ) {
        this.generatedRegex =
          this.generatedRegex + "[A-Za-z]" + this.quantifier;
      } else if (this.generatorSelection == "Period") {
        this.generatedRegex = this.generatedRegex + "\\.";
      } else if (this.generatorSelection == "Force whitespace") {
        this.generatedRegex = this.generatedRegex + "\\s" + this.quantifier;
      } else if (this.generatorSelection == "Exclude") {
        this.generatedRegex =
          this.generatedRegex + "[^" + snippetSelection + "]" + this.quantifier;
      }
    },
    generatePackage() {
      const date = new Date();
      this.filterPackage.date = date;
      this.filterPackage.packageName = this.packageName;
      this.filterPackage.authors = this.packageAuthor;
      this.filterPackage.desc = this.description;
      this.json = this.filterPackage;
    },
    exportFilter() {
      let fileString = JSON.stringify(this.json, null, "\t");
      let fileUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(fileString);
      let exportFileDefaultName = "filter.json";
      let linkElement = document.createElement("a");
      linkElement.setAttribute("href", fileUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    },
  },
};
</script>
<style scoped lang="scss">
@use "../styles/settings.scss";
.subItem {
  text-align: left;
}

#section {
  height: 100%;
  width: 75%;
  text-align: left;
  margin-left: 5px;
}

li {
  font-size: 12px;
  display: block;
  text-align: left;
  list-style-position: inside;
  margin-left: 2px;
}
</style>
