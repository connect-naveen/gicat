<template>
  <v-main>
    <!--<div id="explorer" v-if="json != null">
      <h2>{{ json.packageName }}</h2>
      <b v-if="json.authors">Authors:</b>
      <p>{{ json.authors }}</p>
      <b v-if="json.desc">Description:</b>
      <p>{{ json.desc }}</p>
      <b>Node filters:</b>
      <br />
      <ul
        v-for="filter in json['nodeFilterList']"
        :key="filter.name"
        id="filterElement"
        v-on:click="nodeListDropdown(filter)"
      >
        {{
          filter.name + ":"
        }}<br />
        <li>
          {{ "Regex: " + filter.regex }}
        </li>
        <li v-if="filter.extension">
          {{ "File extension: " + filter.extension }}
        </li>
        <li v-if="filter.exclude != ''">
          {{ "Excluded Regex: " + filter.exclude }}
        </li>
        <li v-if="filter.label">
          {{ "Node label: " + filter.label }}
        </li>
      </ul>
      <b>Edge filters:</b>
      <li v-for="edge in json['edgeFilterList']" :key="edge.name">
        {{ edge.label + ":" }}<br />
        <ul>
          <strong>From</strong>
          {{
            edge.from["nodeFilterID"]
          }}
          <strong> To </strong>
          {{
            edge.to["nodeFilterID"]
          }}
        </ul>
      </li>
    </div>-->
    <div id="section">
      <v-card
        width="400"
        position="fixed"
        color="#c7ddf2"
        density="comfortable"
        elevation="2"
        location="right"
        class="text-center"
      >
        <v-list opened="true">
          <v-list-item value="explorer" title="Package Explorer"></v-list-item>
          <v-list-group v-if="json != null" :value="packageName">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-package"
                :title="json.packageName"
              ></v-list-item>
            </template>
            <v-list-item title="Author:"></v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
      <h2>Package information</h2>
      <br />
      <label for="packageName">Name:</label>
      <input
        type="text"
        id="packageName"
        :value="packageName"
        @input="setPackageName"
      />
      <label for="packageAuthor">Author:</label>
      <input
        type="text"
        id="packageAuthor"
        :value="packageAuthor"
        @input="setPackageAuthor"
      />
      <label for="description">Description:</label>
      <input
        type="text"
        id="description"
        :value="description"
        @input="setPackageDescription"
      />
      <br />
      <v-btn @click="generatePackage">Generate package </v-btn>
      <v-btn @click="exportFilter">Export </v-btn>
      <br /><br />
      <h2>Node filter</h2>
      <br />
      <p>Code snippet:</p>
      <input
        type="text"
        id="codeInput"
        :value="codeInput"
        size="50"
        @input="setCodeInput"
      />
      <br />
      <select v-model="selected">
        <option disabled value="">Select...</option>
        <option>Mandatory characters</option>
        <option>Arbitrary characters</option>
        <option>Period</option>
        <option>Force whitespace</option>
        <option>Exclude</option>
      </select>
      <label for="captureGroup">Assign capture group:</label>
      <input type="checkbox" id="captureGroup" />
      <label for="count">Quantifier:</label>
      <input type="text" id="count" size="1" @input="setCount" />
      <v-btn @click="generateRegex">Submit</v-btn>
      <br />
      <label for="regexOutput">(Generated) Regex:</label>
      <input
        type="text"
        id="regexOutput"
        size="50"
        :value="regexOutput"
        @input="updateRegexOutput"
      />
      <v-btn @click="resetRegex">Reset</v-btn>
      <br /><br />
      <label for="fileExtension">File extension:</label>
      <input
        type="text"
        id="fileExtension"
        :value="fileExtension"
        @input="setFileExtension"
      />
      <label for="exclude">Exclude Regex:</label>
      <input
        type="text"
        id="excludes"
        :value="excludes"
        @input="setExcludeRegex"
      />
      <label for="regexName">Filter name:</label>
      <input
        type="text"
        id="regexName"
        :value="regexName"
        @input="setRegexName"
      />
      <label for="nodeLabel">Node label:</label>
      <input
        type="text"
        id="nodeLabel"
        :value="nodeLabel"
        @input="setNodeLabel"
      />
      <br /><br />
      <label for="setAttributes">Set capture group name:</label>
      <input
        type="text"
        id="setAttributes"
        size="15"
        :value="NodeAttributes"
        @input="setNodeAttributes"
      />
      <label for="setCaptureGroup">Set capture groups:</label>
      <input
        type="text"
        id="setCaptureGroups"
        size="15"
        :value="NodeCaptureGroups"
        @input="setNodeCaptureGroups"
      />
      <v-btn @click="addNodeAttributes">Add </v-btn>
      <br /><br />
      <label for="nodeColorpicker">Node color:</label>
      <input
        type="color"
        id="nodeColorpicker"
        value="#42b983"
        @input="setNodeColor"
      />
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
      <v-btn @click="addNodeFilter">Add filter</v-btn>
      <br /><br />
      <h2>Edge Filter</h2>
      <br />
      <label for="edgeName">Edge filter name:</label>
      <input type="text" id="edgeName" :value="edgeName" @input="setEdgeName" />
      <label for="loopSelection">Allow loops:</label>
      <select v-model="loopSelection">
        <option>True</option>
        <option>False</option>
      </select>
      <!--<label for="modeSelection">choose mode:</label>
      <select v-model="modeSelection">
        <option disabled value="">please select</option>
        <option>contains</option>
        <option>equals</option>
      </select>-->
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
      <label for="edgeLabel">Edge label:</label>
      <input
        type="text"
        id="edgeLabel"
        :value="edgeLabel"
        @input="setEdgeLabel"
      />
      <label for="edgeColorpicker">Edge color:</label>
      <input
        type="color"
        id="edgeColorpicker"
        value="#42b983"
        @input="setEdgeColor"
      />
      <v-btn @click="addEdgeFilter">Add filter</v-btn>
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
          "1px solid #ff0000";
        return;
      } else if (this.json == null) {
        const date = new Date();
        this.filterPackage.date = date;
        this.json = this.filterPackage;
        document.getElementById("packageName").style.border =
          "1px solid #000000";
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
/* explorer */
#explorer {
  float: right;
  width: 25%;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  align-self: flex-start;
  border-radius: 8px;
  border: 2px solid #42b983;
}

#explorer h2,
#explorer h4,
#explorer ul,
#explorer p {
  text-align: center;
}

#explorer ul {
  display: block;
}

/*button {
  color: #000000;
  border: 1px solid #000000;
  box-shadow: 0 0 2px #000000;
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 8px;
  padding-left: 5px;
  padding-right: 5px;
}*/

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

/*button:hover,*/
select:hover,
input:hover {
  border: 1px solid #42b983;
}

input:focus,
textarea:focus,
select:focus {
  border: 1px solid #fafafa;
  -webkit-box-shadow: 0 0 6px #42b983;
  -moz-box-shadow: 0 0 5px #42b983;
  box-shadow: 0 0 5px #42b983;
}

/*button:active {
  box-shadow: 0.33px #9b9999;
  transform: translateX(0.4px);
}*/

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
