<template>
    <!--<div class = "landing-page">
        <div id="navbar">
            <Navbar />
        </div>
        <div id ="version">
            <p>v 0.0.1</p>
        </div>
        <div id="footer">
            <img src="src/renderer/assets/tool-footer.png">
        </div>-->
        <div id="explorer" v-if="json != null">
            <h2>{{json.packageName}}</h2>
            <h4>Description:</h4>
            <p>{{ json.desc }}</p>
            <h4>Node filters:</h4>
            <li v-for="filter in json['nodeFilterList']" :key="filter.name">
                {{ filter.name + ':'}}<br>
                    <ul>{{ filter.regex }}</ul>
            </li>
            <h4>Edge filters:</h4>
            <li v-for="edge in json['edgeFilterList']" :key="edge.name">
                {{ edge.label + ':'}}<br>
                    <ul><strong>from</strong> {{ edge.from['nodeFilterID'] }}<strong> to </strong> {{ edge.to['nodeFilterID']}}</ul>
            </li>
        </div>
        <div id="section">
            <h2>Package information</h2>
            <br>
            <!--<p>Specify the type of your filter:</p>
            <input
                type="button"
                id="toggleSpec"
                value="Node filter"
                @click="toggle"
            />-->
                <label for="packageName">name:</label> 
                <input 
                    type="text"
                    id="packageName"
                    :value="packageName"
                    @input="setPackageName"
                />
                <label for="packageAuthor">author:</label> 
                <input 
                    type="text"
                    id="packageAuthor"
                    :value="packageAuthor"
                    @input="setPackageAuthor"
                />
                <label for = "description">description:</label>
                <input
                    type="text"
                    id="description"
                    :value="description"
                    @input="setPackageDescription"
                />  
                <br>
                <button @click="generatePackage">generate package</button>
                <button @click="exportFilter">export</button>
                <br>
                <br>
                <h2>Node filter</h2>
            <p>Code Snippet:</p>
            <input 
                type="text"
                id="codeInput"
                :value="codeInput"
                size="50"
                @input="setCodeInput"
            />
            <br>
            <select v-model="selected">
                <option disabled value="">please select</option>
                <option>mandatory characters</option>
                <option>arbitrary characters</option>
                <option>period</option>
                <option>force whitespace</option>
                <option>exclude</option>
            </select>
            <label for="captureGroup">assign capture group:</label>
            <input
                type="checkbox"
                id="captureGroup"
                />
            <label for="count">quantifier:</label>    
            <input 
                type="text"
                id="count"
                size="1"
                @input="setCount"
            />
            
            <br>
            <button @click="generateRegex">submit</button>
            <br>
            <p>(generated) Regex:</p>
            <input 
                type="text"
                id="regexOutput"
                size="50"
                :value="regexOutput"
                @input="updateRegexOutput"
            />
            <button @click="resetRegex">reset</button>
            <label for ="fileExtension">File extension:</label>
                <input
                    type="text"
                    id="fileExtension"
                    :value="fileExtension"
                    @input="setFileExtension"
                />
            <label for="exclude">Exclude regex:</label>
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
            <label for="nodeLabel">node label:</label>
            <input
                type="text"
                id="nodeLabel"
                :value="nodeLabel"
                @input="setNodeLabel"
            />
            <label for="setAttributes">set attributes:</label>
            <input
                type="text"
                id="setAttributes"
                size="15"
                :value="NodeAttributes"
                @input="setNodeAttributes"
            />
            <label for="setCaptureGroup">set capture groups:</label>
            <input
                type="text"
                id="setCaptureGroups"
                size="15"
                :value="NodeCaptureGroups"
                @input="setNodeCaptureGroups"
            />
            <button @click="addNodeAttributes">add</button>
            <label for="nodeColorpicker">node color:</label>
            <input 
                type="color" 
                id="nodeColorpicker" 
                value="#0000ff"
                
                @input="setNodeColor"
            />
            <label for="attributeSelection">label attribute:</label>
                <select v-model="attributeSelection">
                    <option disabled value="">please select</option>
                    <option>null</option>
                    <option v-for="(value, propertyName) in this.attributes" :key="propertyName">{{ propertyName}}</option>
                </select>
            <button @click="addNodeFilter">add filter</button>
            <h2>Edge Filter</h2>
            <br><br>
                <label for="edgeName">Edge filter name:</label> 
                <input 
                    type="text"
                    id="edgeName"
                    :value="edgeName"
                    @input="setEdgeName"
                />
            <label for="loopSelection">allow loops:</label>
                <select v-model="loopSelection">
                    <option>true</option>
                    <option>false</option>
                </select>
            <label for="modeSelection">Choose mode:</label>
                <select v-model="modeSelection">
                    <option disabled value="">please select</option>
                    <option>contains</option>
                    <option>equals</option>
                </select>
            <label for="fromSelection">from:</label>
                <select v-model="fromSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.name" :key="node.name">{{ node.name }}</option>
                </select>
            <label for="fromAttributeSelection">attribute:</label>
                <select v-model="fromAttributeSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.attributes" :key="node.name">{{ node.attributes.propertyName }}</option>
                </select>
            
            <label for="toSelection">to:</label>
                <select v-model="toSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.name" :key="node.name">{{ node.name }}</option>
                </select>
            <label for="toAttributeSelection">attribute:</label>
                <select v-model="toAttributeSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.attributes" :key="node.name">{{ node.attributes.propertyName }}</option>
                </select>         
            <label for="edgeLabel">edge label:</label>
            <input
                type="text"
                id="edgeLabel"
                :value="edgeLabel"
                @input="setEdgeLabel"
            />
            <label for="edgeColorpicker">edge color:</label>
            <input 
                type="color" 
                id="edgeColorpicker" 
                value="#0000ff"
                @input="setEdgeColor"
            />  
            <button @click="addEdgeFilter">add filter</button>
        </div>
</template>

<script>
//import Navbar from "./Navbar"
    export default{
        name: "GeneratorView",
        //methods:{},
        components:{
            //Navbar
        },
        data(){
            return{
                filterPackage: {
                    "packageName": '',
                    "authors": '',
                    "desc": '',
                    "date": '',
                    "nodeFilterList": [

                    ],
                    "edgeFilterList": [

                    ]
                },
                selected: '',
                json: null,
                mutation: '',
                codeInput: '',
                cnt: '',
                regex: '',
                regexOutput: '',
                fileExtension: '',
                excludes: '',
                regexNameInput: '',
                regexName: '',
                nodeLabel: '',
                //nodeColorpicker: '',
                edgeName: '',
                fromSelection: '',
                toSelection: '',
                edgeLabel: '',
                nodeAttributes: '',
                nodeCaptureGroups: '',
                attributes: {}
            }
        }, 
        props: {
        },  
        methods:{
            addNodeAttributes(){
                if (this.attributes == {}){
                    this.attributes = {
                        [this.nodeAttributes]: this.nodeCaptureGroups.split(",").map(e=>e.trim()).map(e=>Number(e))
                    };
                }else{
                    this.attributes[this.nodeAttributes]= this.nodeCaptureGroups.split(",").map(e=>e.trim()).map(e=>Number(e))
                }
            },  
            setNodeCaptureGroups(event){
                this.nodeCaptureGroups = event.target.value;
                this.$emit('nodeCaptureGroupsChanged', this.nodeCaptureGroups)
            },
            setNodeAttributes(event){
                this.nodeAttributes = event.target.value;
                this.$emit('nodeAtributeChanged', this.nodeAttributes)
            },
            setEdgeName(event){
                this.edgeName = event.target.value;
                this.$emit('edgeNameChanged', this.edgeName)
            },
            setCount(event){
                this.cnt = event.target.value;
                this.$emit('captureCountChanged', this.cnt)
            },
            setEdgeColor(event){
                this.edgeColorpicker = event.target.value;
                this.$emit('edgeColorChanged', this.edgeColorpicker)
            },
            setNodeColor(event){
                this.nodeColorpicker = event.target.value;
                this.$emit('nodeColorChanged', this.nodeColorpicker)
            },
            setNodeLabel(event){
                this.nodeLabel = event.target.value;
                this.$emit('nodeLabelChanged', this.nodeLabel)
            },
            setEdgeLabel(event){
                this.edgeLabel = event.target.value;
                this.$emit('edgeLabelChanged', this.edgeLabel)
            },
            setPackageDescription(event){
                this.filterPackage.desc = event.target.value;
                this.$emit('packageDescriptionChanged', this.description)
            },  
            updateRegexOutput(event){
                this.regexOutput = event.target.value;
                this.regex = this.regexOutput
                this.$emit('uptadedRegexOutput', this.regex)
            },
            setRegexName(event){
                this.regexNameInput = event.target.value;
                this.regexName = this.regexNameInput;
                this.$emit('regexNameChanged', this.regexNameInput)
            },
            setFileExtension(event){
                this.fileExtension = event.target.value;
                this.$emit('fileExtensionChanged', this.fileExtension)
            },
            setExcludeRegex(event){
                this.excludes = event.target.value;
                this.$emit('excludeRegexChanged', this.excludes)
            },
            setUserRegex(event){
                this.userRegexInput = event.target.value;
                this.userRegex = this.userRegexInput;
                this.$emit('userRegexChanged', this.userRegexInput)
            },
            setPackageName(event){
                this.packageNameInput = event.target.value;
                this.filterPackage.packageName = this.packageNameInput;
                this.$emit('packageNameChanged', this.packageNameInput)
            },
            setPackageAuthor(event){
                this.packageAuthorInput = event.target.value;
                this.filterPackage.authors = this.packageAuthorInput;
                this.$emit('packageAuthorChanged', this.packageAuthorInput)
            },
            resetRegex(){
                this.regex = ''
                this.regexOutput = this.regex
            },
            getCount(){
                if (this.cnt == '*'){
                    return '*'
                }
                else if(this.cnt == '+'){
                    return '+'
                }
                else if(this.cnt == ''){
                    return ''
                }
                else 
                    return '{' + this.cnt + '}'
                
            },
            setCodeInput(event){
                this.mutation = event.target.value;
                this.codeInput = this.mutation;
                this.$emit('codeInputChanged', this.mutation)
            },
            /*setFilterName(event){
                this.filterName = event.target.value;
                this.$emit('filterNameChanged', this.filterName)
            },*/
            setRegex(event){
                this.regex = event.target.value;
                this.$emit('regexOutputChanged', this.regex)
            },
            addNodeFilter(){
                this.json['nodeFilterList'].push(
                    {
                            "name": this.regexName,
                            "regex": this.regex,
                            "id": (this.json.packageName + this.regexName).replace(/\s/g, ""),
                            "spec": 'node',
                            "exclude": [this.excludes],
                            "extension": this.fileExtension,
                            "attributes": this.attributes,
                            "style": {
                                "color": this.nodeColorpicker
                            },
                            "failures": [''],
                            "label": this.nodeLabel,
                            "labelAttribute": this.attributeSelection                    
                        }
                ),
                this.attributes = {}
            },
            addEdgeFilter(){
                this.json['edgeFilterList'].push(
                    {
                            "allow-loop": this.loopSelection,
                            "mode": this.modeSelection, 
                            "label": this.edgeLabel,
                            "spec": 'edge',
                            "id": (this.json.packageName + this.edgeName).replace(/\s/g, ""),
                            "name": this.edgeName,
                            "from":{
                                "nodeFilterID": (this.json.packageName + this.fromSelection).replace(/\s/g, ""),
                                "attribute": this.fromAttributeSelection, 
                            },
                            "to":{
                                "nodeFilterID": (this.json.packageName + this.toSelection).replace(/\s/g, ""),
                                "attribute": this.toAttributeSelection,   
                            },
                            "style": {
                                "color": this.edgeColorpicker
                            }
                        }
                )
            },
            generateRegex(){
                let selection = window.getSelection();
                let re = '';
                let captureGroup = document.getElementById("captureGroup").checked;
                if(this.selected == 'mandatory characters' && captureGroup){
                    re = re + '(' + selection + ')' + this.getCount()
                }
                else if(this.selected == 'mandatory characters' && !captureGroup){
                    re = re + selection + this.getCount()
                }
                else if(this.selected == 'arbitrary characters' && captureGroup){
                    re = re + '([A-Za-z])' + this.getCount()
                }
                else if(this.selected == 'arbitrary characters' && !captureGroup){
                    re = re + '[A-Za-z]' + this.getCount()
                }
                else if(this.selected == 'period'){
                    re = re + '\\.'
                }
                else if(this.selected == 'force whitespace'){
                    re = re + '\\s' + this.getCount()
                }
                else if(this.selected == 'exclude'){
                    re = re + '[^' + selection + ']' + this.getCount()
                }
                this.regex = this.regex + re;
                this.regexOutput = this.regex;
            },
            generatePackage(){
                if(this.filterPackage.packageName==''){
                    document.getElementById("packageName").style.border = "1px solid #ff0000";
                    return;
                }
                else if(this.json == null){
                    const date = new Date()
                    this.filterPackage.date = date;
                    this.json = this.filterPackage;
                    document.getElementById("packageName").style.border = "1px solid #000000";
                    /*this.json = {
                        //general package information
                        "packageName": this.packageName,
                        "authors": this.packageAuthor,  
                        "date": date, 
                        "desc": this.description,

                        "nodeFilterList": [],
                        "edgeFilterList": []
                    };
                    //this.json['nodeFilterList'].push({"name": this.regexName, "regex": this.regex});
                    //alert('Your package ' + this.json.packageName + ' was created!');
                    this.regexName = '';
                    this.regex = ''  */                
                }
                else {
                    //alert('Your are already working on a filter package!')
                }
            },
            exportFilter(){
                let fileString = JSON.stringify(this.json, null, "\t");
                let fileUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(fileString);
                let exportFileDefaultName = 'filter.json';
                let linkElement = document.createElement('a');
                linkElement.setAttribute('href', fileUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            },
        }
    };
</script>

<style scoped>


/* explorer */
#explorer{
    text-align: left;
    margin-right: 15px;
    float: right;
    height: 100%;
    width: 25%
}

input,select{
    color: #000000;
    border:1px solid #000000;
    box-shadow:0 0 2px #000000;
    margin-left: 5px;
    display:block;
    margin-left: 0px
}

button{
    color: #000000;
    border:1px solid #000000;
    box-shadow:0 0 2px #000000;
    margin-right: 10px;
    margin-left: 0px
}

input:focus,textarea:focus,select:focus{
    border:1px solid #fafafa;
    -webkit-box-shadow:0 0 6px #42b983;
    -moz-box-shadow:0 0 5px #42b983;
    box-shadow:0 0 5px #42b983;
}

#section{
    height: 100%;
    width: 75%;
    text-align: left;
    margin-left: 5px
}

h2{
    text-align: center
}

h4{
    text-align: left;
    font-size: 12px
}
</style>