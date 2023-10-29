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
          <v-list-group v-if="json != null" :value="packageName">
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
              <!--<v-list-item :title="'Loops?' + edge.allow-loop"></v-list-item>-->
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
                :rules="nameRules"
                :counter="10"
                label="Package Name"
                required
                hide-details
                @input="setPackageName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="packageAuthor"
                :rules="nameRules"
                :counter="10"
                label="Author"
                hide-details
                @input="setPackageAuthor"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="description"
                :rules="nameRules"
                :counter="10"
                label="Description"
                hide-details
                @input="setPackageDescription"
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
              :rules="nameRules"
              :counter="10"
              label="Code Snippet"
              hide-details
              @input="setCodeInput"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <select v-model="selected">
              <option disabled value="">Select...</option>
              <option>Mandatory characters</option>
              <option>Arbitrary characters</option>
              <option>Period</option>
              <option>Force whitespace</option>
              <option>Exclude</option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-checkbox
              label="Assign capture Group"
              id="captureGroup"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="count"
              :rules="nameRules"
              :counter="10"
              label="Quantifier"
              hide-details
              @input="setCount"
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
              v-model="regexOutput"
              :rules="nameRules"
              :counter="10"
              label="(Generated) Regex"
              hide-details
              @input="updateRegexOutput"
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
              :rules="nameRules"
              :counter="10"
              label="File extension"
              hide-details
              @input="setFileExtension"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="regexName"
              :rules="nameRules"
              :counter="10"
              label="Filter name"
              hide-details
              @input="setFileExtension"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="excludes"
              :rules="nameRules"
              :counter="10"
              label="Exclude Regex"
              hide-details
              @input="setFileExtension"
            ></v-text-field>
          </v-col>
        </v-row>
        <br /><br /><br /><br />
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="nodeLabel"
              :rules="nameRules"
              :counter="10"
              label="Node label"
              hide-details
              @input="setFileExtension"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="setAttributes"
              :rules="nameRules"
              :counter="10"
              label="Capture group name"
              hide-details
              @input="setNodeAttributes"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="setNodeCaptureGroups"
              :rules="nameRules"
              :counter="10"
              label="Set capture groups"
              hide-details
              @input="setNodeCaptureGroups"
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
            <label for="nodeColorpicker">Node color:</label>
            <input
              type="color"
              id="nodeColorpicker"
              value="#42b983"
              @input="setNodeColor"
            />
          </v-col>
          <v-col cols="12" md="4">
            <label for="attributeSelection">Label attribute:</label>
            <select v-model="attributeSelection">
              <option disabled value="">Select...</option>
              <option>Null</option>
              <option
                v-for="(value, propertyName) in this.attributes"
                :key="propertyName"
              >
                {{ propertyName }}
              </option>
            </select>
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
              :rules="nameRules"
              :counter="10"
              label="Edge filter name"
              hide-details
              @input="setEdgeName"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <label for="loopSelection">Allow loops:</label>
            <select v-model="loopSelection">
              <option>True</option>
              <option>False</option>
            </select>
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
            <label for="edgeColorpicker">Edge color:</label>
            <input
              type="color"
              id="edgeColorpicker"
              value="#42b983"
              @input="setEdgeColor"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
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
      filterPackage: {
        packageName: "",
        authors: "",
        desc: "",
        date: "",
        nodeFilterList: [],
        edgeFilterList: [],
      },
      selected: "",
      json: null,
      mutation: "",
      codeInput: "",
      cnt: "",
      regex: "",
      regexOutput: "",
      fileExtension: "",
      excludes: "",
      regexNameInput: "",
      regexName: "",
      nodeLabel: "",
      edgeName: "",
      fromSelection: "",
      toSelection: "",
      edgeLabel: "",
      nodeAttributes: "",
      nodeCaptureGroups: "",
      attributes: {},
    };
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
    setNodeCaptureGroups(event) {
      this.nodeCaptureGroups = event.target.value;
      this.$emit("nodeCaptureGroupsChanged", this.nodeCaptureGroups);
    },
    setNodeAttributes(event) {
      this.nodeAttributes = event.target.value;
      this.$emit("nodeAtributeChanged", this.nodeAttributes);
    },
    setEdgeName(event) {
      this.edgeName = event.target.value;
      this.$emit("edgeNameChanged", this.edgeName);
    },
    setCount(event) {
      this.cnt = event.target.value;
      this.$emit("captureCountChanged", this.cnt);
    },
    setEdgeColor(event) {
      this.edgeColorpicker = event.target.value;
      this.$emit("edgeColorChanged", this.edgeColorpicker);
    },
    setNodeColor(event) {
      this.nodeColorpicker = event.target.value;
      this.$emit("nodeColorChanged", this.nodeColorpicker);
    },
    setNodeLabel(event) {
      this.nodeLabel = event.target.value;
      this.$emit("nodeLabelChanged", this.nodeLabel);
    },
    setEdgeLabel(event) {
      this.edgeLabel = event.target.value;
      this.$emit("edgeLabelChanged", this.edgeLabel);
    },
    setPackageDescription(event) {
      this.filterPackage.desc = event.target.value;
      this.$emit("packageDescriptionChanged", this.description);
    },
    updateRegexOutput(event) {
      this.regexOutput = event.target.value;
      this.regex = this.regexOutput;
      this.$emit("uptadedRegexOutput", this.regex);
    },
    setRegexName(event) {
      this.regexNameInput = event.target.value;
      this.regexName = this.regexNameInput;
      this.$emit("regexNameChanged", this.regexNameInput);
    },
    setFileExtension(event) {
      this.fileExtension = event.target.value;
      this.$emit("fileExtensionChanged", this.fileExtension);
    },
    setExcludeRegex(event) {
      this.excludes = event.target.value;
      this.$emit("excludeRegexChanged", this.excludes);
    },
    setUserRegex(event) {
      this.userRegexInput = event.target.value;
      this.userRegex = this.userRegexInput;
      this.$emit("userRegexChanged", this.userRegexInput);
    },
    setPackageName(event) {
      this.packageNameInput = event.target.value;
      this.filterPackage.packageName = this.packageNameInput;
      this.$emit("packageNameChanged", this.packageNameInput);
    },
    setPackageAuthor(event) {
      this.packageAuthorInput = event.target.value;
      this.filterPackage.authors = this.packageAuthorInput;
      this.$emit("packageAuthorChanged", this.packageAuthorInput);
    },
    resetRegex() {
      this.regex = "";
      this.regexOutput = this.regex;
    },
    getCount() {
      if (this.cnt == "*") {
        return "*";
      } else if (this.cnt == "+") {
        return "+";
      } else if (this.cnt == "") {
        return "";
      } else return "{}" + this.cnt + "}";
    },
    setCodeInput(event) {
      this.mutation = event.target.value;
      this.codeInput = this.mutation;
      this.$emit("codeInputChanged", this.mutation);
    },
    setRegex(event) {
      this.regex = event.target.value;
      this.$emit("regexOutputChanged", this.regex);
    },
    addNodeFilter() {
      this.json["nodeFilterList"].push({
        name: this.regexName,
        regex: this.regex,
        id: (this.json.packageName + this.regexName).replace(/\s/g, ""),
        spec: "node",
        exclude: [this.excludes],
        extension: this.fileExtension,
        attributes: this.attributes,
        style: { color: this.nodeColorpicker },
        failures: [""],
        label: this.nodeLabel,
        labelAttribute: this.attributeSelection,
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
      let selection = window.getSelection();
      let re = "";
      let captureGroup = document.getElementById("captureGroup").checked;
      if (this.selected == "mandatory characters" && captureGroup) {
        re = re + "(" + selection + this.getCount() + ")";
      } else if (this.selected == "mandatory characters" && !captureGroup) {
        re = re + selection + this.getCount();
      } else if (this.selected == "arbitrary characters" && captureGroup) {
        re = re + "([A-Za-z]" + this.getCount() + ")";
      } else if (this.selected == "arbitrary characters" && !captureGroup) {
        re = re + "[A-Za-z]" + this.getCount();
      } else if (this.selected == "period") {
        re = re + "\\.";
      } else if (this.selected == "force whitespace") {
        re = re + "\\s" + this.getCount();
      } else if (this.selected == "exclude") {
        re = re + "[^" + selection + "]" + this.getCount();
      }
      this.regex = this.regex + re;
      this.regexOutput = this.regex;
    },
    generatePackage() {
      if (this.filterPackage.packageName == "") {
        document.getElementById("packageName").style.border =
          "1px solid #000000";
        return;
      } else if (this.json == null) {
        const date = new Date();
        this.filterPackage.date = date;
        this.json = this.filterPackage;
      } else return;
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

select,
input {
  color: #000000;
  border: 1px solid #000000;
  box-shadow: 0 0 2px #000000;
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
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
