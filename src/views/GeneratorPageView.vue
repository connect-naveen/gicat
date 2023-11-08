<!--<template>
  <div class="context">
    <generator v-model:codeInput="data.codeInput" @codeInputChanged="data.codeInput = $event"
      v-model:regexOutput="data.regexOutput" @updateRegexOutput="data.regexOutput = $event"
      v-model:filterName="data.filterName" @filterNameChanged="data.filterName = $event"
      v-model:packageAuthor="data.packageAuthor" @packageAuthorChanged="data.packageAuthor = $event"
      v-model:regexName="data.regexName" @regexNameChanged="data.regexName = $event"
      v-model:fileExtension="data.fileExtension" @fileExtensionChanged="data.fileExtension = $event"
      v-model:description="data.description" @packageDescriptionChanged="data.description = $event"
      v-model:excludes="data.excludes" @excludeRegexChanged="data.excludes = $event"
      v-model:edgeLabel="data.edgeLabel" @edgeLabelChanged="data.edgeLabel = $event"
      v-model:nodeColorpicker="data.nodeColorpicker" @nodeColorChanged="data.nodeColorpicker = $event"
      v-model:edgeColorpicker="data.edgeColorpicker" @edgeColorChanged="data.edgeColorpicker = $event"
      v-model:nodeCaptureGroups="data.nodeCaptureGroups" @nodeCaptureGroupsChanged="data.nodeCaptureGroups = $event"
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
        filterPackage: {
                    "authors": '',
                    "desc": '',
                    "date": '',
                    "nodeFilterList": [
                        {
                            "name": '',
                            "regex": '',
                            "id": '',
                            "spec": '',
                            "exclude": [''],
                            "extension": '',
                            "attributes": {

                            },
                            "style": {
                                "color": ''
                            },
                            "failures": [''],
                            "label": '',
                            "labelAttribute": ''                    
                        }
                    ],
                    "edgeFilterList": [
                        {
                            "allow-loop": '',
                            "mode": '', 
                            "label": '',
                            "spec": '',
                            "id": '',
                            "name": '',
                            "from":{
                                "nodeFilterID": '',
                                "attribute": ''
                            },
                            "to":{
                                "nodeFilterID": '',
                                "attribute": ''   
                            },
                            "style": {
                                "color": ''
                            }
                        }
                    ]
                },
          fileExtension: "",
          regexOutput: "",
          excludes: "",
          regexName: "",
          nodeColorpicker: "",
          edgeName: "",
          edgeLabel: "",
          nodeAttributes: "",
          nodeCaptureGroups: ""


      });
      return{
        data
      }
    }
  }
</script>

<style scoped>

/* App-Page */


/* version */

/* footer */

</style>
-->