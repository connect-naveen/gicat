<template>
  <div class="context">
    <generator v-model:codeInput="data.codeInput" @codeInputChanged="data.codeInput = $event"
      v-model:regexOutput="data.regexOutput" @updateRegexOutput="data.regexOutput = $event"
      v-model:filterName="data.filterName" @filterNameChanged="data.filterName = $event"
      v-model:packageName="data.packageName" @packageNameChanged="data.packageName = $event"
      v-model:packageAuthor="data.packageAuthor" @packageAuthorChanged="data.packageAuthor = $event"
      v-model:regexName="data.regexName" @regexNameChanged="data.regexName = $event"
      v-model:fileExtension="data.fileExtension" @fileExtensionChanged="data.fileExtension = $event"
      v-model:description="data.description" @packageDescriptionChanged="data.description = $event"
      v-model:excludes="data.excludes" @excludeRegexChanged="data.excludes = $event"
      v-model:nodeLabel="data.nodeLabel" @nodeLabelChanged="data.nodeLabel = $event"
      v-model:edgeLabel="data.edgeLabel" @edgeLabelChanged="data.edgeLabel = $event"
      v-model:colorpicker="data.colorpicker" @colorChanged="data.colorpicker = $event"
      v-model:nodeColorpicker="data.nodeColorpicker" @nodeColorChanged="data.nodeColorpicker = $event"
      v-model:captureGroups="data.captureGroups" @captureGroupsChanged="data.captureGroups = $event"
      v-model:attributes="data.attributes" @attributesChanged="data.attributes = $event"
    />
  </div>
  


</template>

<script>
  import Generator from "./GeneratorView";
  import {reactive} from "vue";

  export default{
    name:"GeneratorPageView",
    components:{
      "Generator": Generator
    },
    setup(){
      const data = reactive({
        codeInput: "",
        regexOutput: "",
        userRegexInput: "",
        packageName: "",
        filterName: "",
        packageAuthor: "",
        regexName: "",
        fileExtension: "",
        description: "",
        excludes: "",
        nodeLabel: "",
        edgeLabel: "",
        colorpicker: "",
        nodeColorpicker: "",
        captureGroups: "",
        attributes: ""

      });
      return{
        data
      }
    }
  }
</script>

<style scoped>

/* App-Page */
.landing-page{
  font-family: 'Roboto', sans-serif;

}

/* version */
#version{
position: absolute;
width: 75px;
height: 30px;
right: 7px;
top: 7px;

font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 21px;

color: #6B6B6B;
}

/* footer */
#footer img{
position:absolute;
width:100%;
bottom: 0px;
left: 0px;
right: 0px;
}

</style>