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
            <h3>{{json.packageName}}</h3>
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
        <div class="section">
            <h2>Package information</h2>
            <br>
            <!--<p>Specify the type of your filter:</p>
            <input
                type="button"
                id="toggleSpec"
                value="Node filter"
                @click="toggle"
            />-->
                <label for="packageName">Name:</label> 
                <input 
                    type="text"
                    id="packageName"
                    :value="packageName"
                    @input="setPackageName"
                />
                <br><br>
                <label for="packageAuthor">Author:</label> 
                <input 
                    type="text"
                    id="packageAuthor"
                    :value="packageAuthor"
                    @input="setPackageAuthor"
                />
                <br><br>
                <label for = "description">Additional package description:</label>
                <input
                    type="text"
                    id="description"
                    :value="description"
                    @input="setPackageDescription"
                />  
                <br><br>
                <button @click="generateFilter">generate package</button>
                <button @click="exportFilter">export</button>
                <br>
                <br>
                <h2>Node filter</h2>
            <p>Insert your code example you want to generate a regular expression from:</p>
            <input 
                type="text"
                id="codeInput"
                :value="codeInput"
                size="75"
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
            <label for="captureGroup">add capture group:</label>
            <input
                type="checkbox"
                id="captureGroup"
                />
            <label for="count">count:</label>    
            <input 
                type="text"
                id="count"
                size="1"
                @input="setCount"
            />
            <button @click="generateRegex">submit</button>
            <br>
            <button @click="resetRegex">reset</button>
            <p>(generated) regex:</p>
            <input 
                type="text"
                id="regexOutput"
                size="75"
                :value="regexOutput"
                @input="updateRegexOutput"
            />
            <br><br>
            <label for ="fileExtension">File extension:</label>
                <input
                    type="text"
                    id="fileExtension"
                    :value="fileExtension"
                    @input="setFileExtension"
                />
                <br><br>
            <label for="exclude">Exclude regex:</label>
            <input
                type="text"
                id="excludes"
                :value="excludes"
                @input="setExcludeRegex"
            />
            <br><br>
                <label for="regexName">Filter name:</label> 
                <input 
                    type="text"
                    id="regexName"
                    :value="regexName"
                    @input="setRegexName"
                />
                <br><br>
            <label for="nodeLabel">node label:</label>
            <input
                type="text"
                id="nodeLabel"
                :value="nodeLabel"
                @input="setNodeLabel"
            />
            <br><br>
            <label for="setAttributes">set attributes:</label>
            <input
                type="text"
                id="setAttributes"
                :value="attributes"
                @input="setAttributes"
            />
            <label for="setCaptureGrout">set capture groups:</label>
            <input
                type="text"
                id="setCaptureGroups"
                :value="captureGroups"
                @input="setCaptureGroups"
            />
            <br><br>
            <label for="colorpicker">node color:</label>
            <input 
                type="color" 
                id="nodeColorpicker" 
                value="#0000ff"
                
                @input="setNodeColor"
            />
            <br><br>
            <label for="attributeSelection">label attribute:</label>
                <select v-model="attributeSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="att in this.json['attributes']" v-bind:value="att.name" :key="att.name">{{ att.name }}</option>
                </select>
            <br><br>
            <button @click="addNodeFilter">add filter</button>
            <h2>Edge Filter</h2>
            <br><br>
            <label for="modeSelection">Choose mode:</label>
                <select v-model="modeSelection">
                    <option disabled value="">please select</option>
                    <option>contains</option>
                </select>
            <br><br>
            <label for="fromSelection">from:</label>
                <select v-model="fromSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.name" :key="node.name">{{ node.name }}</option>
                </select>
            <br><br>
            <label for="toSelection">to:</label>
                <select v-model="toSelection" v-if="this.json !== null">
                    <option disabled value="">please select</option>
                    <option v-for="node in this.json['nodeFilterList']" v-bind:value="node.name" :key="node.name">{{ node.name }}</option>
                </select>
            <br><br>
            <label for="edgeLabel">edge label:</label>
            <input
                type="text"
                id="edgeLabel"
                :value="edgeLabel"
                @input="setEdgeLabel"
            />
            <br><br>
            <label for="colorpicker">edge color:</label>
            <input 
                type="color" 
                id="colorpicker" 
                value="#0000ff"

                @input="setColor"
            />
            <br><br>
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
            mutation: '',
            json: null,
            packageName: '',
            packageAuthor: '',
            regexName: '',
            cnt: '',
            selected: '',
            fromSelection: '',
            toSelection: '',
            colorpicker: '',
            nodeLabel: '',
            captureGroups: '',
            attributes: '',
            edgeLabel: '',
            excludes: '',
            mode: '',
            description: '',
            fileExtension: '',
            regex: '',
            regexNameInput: '',
            packageAuthorInput: '',
            packageNameInput: '',
            userRegexInput: '',
            filterName: '',
            userRegex: '',
            regexOutput: '',
            codeInput: ''
            }
        },
        props: {
            /*codeInput:{
                type: String,
                default: ""
            },
            /*regexOutput:{
                type: String,
                default: ""
            },
            /*userRegex:{
                type: String,
                default: ""
            },
            /*filterName:{
                type: String,
                default:""
            },
            /*userRegexInput:{
                type: String,
                default: ""
            },
            /*packageNameInput:{
                type: String,
                default: ""
            },
            /*packageAuthorInput:{
                type: String,
                default: ''
            },
            /*regexNameInput:{
                type: String,
                default: ''
            },
            /*regex:{
                type: String,
                default: ''
            },
            /*spec:{
                type: String,
                default: 'node'
            },*/
            /*fileExtension:{
                type: String,
                default: ''
            },
            /*description:{
                type: String,
                default: ''
            },
            /*mode:{
                type: String,
                default: "contains"
            },
            /*excludes:{
                type: String,
                default: ""
            },
            /*nodeLabel:{
                type: String,
                default: ""
            },*/
            /*edgeLabel:{
                type: String,
                default: ""
            },
            /*attributes:{
                type: String,
                default: ""
            },*/
            /*captureGroups:{
                type: String,
                default: ""
            }*/
        },
        methods:{
            /*toggle(){
                var t = document.getElementById("toggleSpec");
                if(t.value=="Node filter"){
                    t.value="Edge filter",
                    this.spec = "edge"
                }
                else
                    t.value="Node filter",
                    this.spec = "node"
            },*/
            setCount(event){
                this.cnt = event.target.value;
                this.$emit('captureCountChanged', this.cnt)
            },
            setColor(event){
                this.colorpicker = event.target.value;
                this.$emit('colorChanged', this.colorpicker)
            },
            setNodeColor(event){
                this.nodeColorpicker = event.target.value;
                this.$emit('nodeColorChanged', this.nodeColorpicker)
            },
            setNodeLabel(event){
                this.nodeLabel = event.target.value;
                this.$emit('nodeLabelChanged', this.nodeLabel)
            },
            setAttributes(event){
                this.attributes = event.target.value;
                this.$emit('attributesChanged', this.attributes)
            },
            setCaptureGroups(event){
                this.captureGroups = event.target.value;
                this.$emit('captureGroupsChanged', this.captureGroups)
            },
            setEdgeLabel(event){
                this.edgeLabel = event.target.value;
                this.$emit('edgeLabelChanged', this.edgeLabel)
            },
            setPackageDescription(event){
                this.description = event.target.value;
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
                this.packageName = this.packageNameInput;
                this.$emit('packageNameChanged', this.packageNameInput)
            },
            setPackageAuthor(event){
                this.packageAuthorInput = event.target.value;
                this.packageAuthor = this.packageAuthorInput;
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
            setFilterName(event){
                this.filterName = event.target.value;
                this.$emit('filterNameChanged', this.filterName)
            },
            setRegex(event){
                this.regex = event.target.value;
                this.$emit('regexOutputChanged', this.regex)
            },
            addNodeFilter(){
                this.json['nodeFilterList'].push({"name": this.regexName, "regex": this.regex, "id": (this.packageName + this.filterName).replace(/\s/g, ""), "spec": "node", "attributes": [this.attributes], "exclude": [this.excludes], "failures": [""], "label": this.nodeLabel, "labelAttribute": this.attributeSelection, "extension": this.fileExtension, "style": {"color": this.nodeColorpicker}});
                alert('Your filter ' + this.regexName + ' got attached to your node filter list!')
            },
            addEdgeFilter(){
                this.json['edgeFilterList'].push({"allow-loop": true, "from":{"nodeFilterID": this.fromSelection, "attribute": ""}, "to": {"nodeFilterID": this.toSelection, "attribute": ""}, "label": this.edgeLabel, "style": {"color": this.colorpicker}, "spec": "edge"});
                alert('Your edges ' + this.edgeLabel + ' got attached to your edge filter list!')
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
            generateFilter(){
                if(this.json == null){
                    const date = new Date()
                    this.json = {
                        //general package information
                        "packageName": this.packageName,
                        "authors": this.packageAuthor,  
                        "date": date, 
                        "desc": this.description,

                        "nodeFilterList": [],
                        "edgeFilterList": []
                    };
                    //this.json['nodeFilterList'].push({"name": this.regexName, "regex": this.regex});
                    alert('Your package ' + this.json.packageName + ' was created!');
                    this.regexName = '';
                    this.regex = ''                  
                }
                else {
                    alert('Your are already working on a filter package!')
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
    margin: auto;
    float: right;
}

input, button, select {
    color: #000000;
    border:1px solid #000000;
    box-shadow:0 0 2px #000000;
}

input:focus,textarea:focus,select:focus{
    border:1px solid #fafafa;
    -webkit-box-shadow:0 0 6px #42b983;
    -moz-box-shadow:0 0 5px #42b983;
    box-shadow:0 0 5px #42b983;
}

</style>