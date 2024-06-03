<template>
  <v-main>
    <div class="guide"></div>
    <h1>Motivation</h1>
    <p>
      As mentioned in [source?], the analysis of a program is quite complex.
      This is due to the large amount of different programming languages but
      also the possibility to run a code analysis from multiple points of view
      such as inheritance, refactoring, method signatures, comments, class
      growth etc. Current code documentation tools mostly focus on helping the
      process of implementation which is why most of the named analysis methods
      are not supported sufficiently. Another problem is the circumstance of
      outdated code which is not compatible with modern documentation tools. To
      address those issues, our tool provides you with the functionality to
      generate your own filter files based on regular expressions (<b>Regex</b>)
      which will be generated from from a given code snippet. Those filter files
      can then be used to analyze a given source code by its rules. Thereby, the
      programming language and the specific type of the analysis process is left
      open to the users decisions.<br />
      In the following, we are going to provide a short use case showing how our
      tool can be utilized in different ways to analyze a programs source code
      followed by a walk-through on how to generate the mentioned filters. All
      examples are applied to the source code of
      <a href="https://gitlab.obspm.fr/dmaschmann/xgaltool" target="_blank">
        xgaltool</a
      >
      using our basic filter package for python which can be found
      <a href="https://www.css-lab.rwth-aachen.de/" target="_blank">here</a>
      [filter upload?].
    </p>
    <h1>Use case</h1>
    <p>
      Xgaltool is a program from computational astrophysics. It analyzes data of
      the Reference Catalog of galaxy Spectral Energy Distributions (RCSED) in
      search of a specific kind of galaxy (merging galaxies). Those galaxies are
      suspected to be the star cradles of the universe (i.e. they are associated
      with a high star formation rate).
      <br />
      <br />
      As our first example, we will take a look at two different versions of the
      previously mentioned xgaltool, introducing the main idea of filter
      packages in GICAT. A filter package can contain two different types of
      filters. (node and edge filters)<br />We applied our python class
      <b>node filter</b> from our basic python filter package onto two different
      snapshots of the xgaltool's source code. You can double click onto
      rectangular nodes to collapse/reveal all of its outgoing edges and left
      click rounded nodes to highlight them and their edges. Using your
      mousewheel allows you to zoom in/out of the visualization and holding down
      the left mouse button lets you move around. By doing so, one can adjust
      the visualization to their likings and export the emerging graph as a svg
      file.
      <br />
      As you might see in Figure 1.1 and Figure 1.2, the project structure
      changed at several places between November 2021 and June 2023. For
      example, the edge between the two classes EnvironmentTools and PlotBPT
      does exist in the 2021 version, but not in the later 2023 version thus
      removing dependencies between the two groups plotting_tools and
      analysis_tools.
    </p>
    <br />
    <br />
    <br />
    <figure>
      <img
        src="../assets/figure32old.jpg"
        alt="Figure 1.1 old code base"
        width="70%"
        height="70%"
      />
      <figcaption>
        Fig.1.1 - GICAT view on xgaltool of November 18th 2021
      </figcaption>
    </figure>
    <br />
    <br />
    <figure>
      <img
        src="../assets/figure32new.jpg"
        alt="Figure 1.2 new code base"
        width="70%"
        height="70%"
      />
      <figcaption>
        Fig.1.2 - GICAT view on xgaltool of June 19th 2023
      </figcaption>
    </figure>
    <br />
    <br />
    <p>
      After getting an overview of the whole project, you might want to go
      deeper into the fine structure of the code to identify concepts that are
      relevant to your analysis, to learn how they are realized in the code and
      how they are related to each other. For this, the use of
      <b>edgefilters</b> is strongly recommended. Figure 2.1 applies this to our
      example. Most of the information in astrophysics depends on spectral
      analysis - the information the astrophysicist seeks is encoded in the
      light the telescope catches. In our example, the main target of
      observation are spread reflections of light in space - gases. With the
      python class node filter we can easily identify the relevant class:
      AnalyseGas. Combining the class-node filter with our python class-edge
      filter lets pop up an <b>extends</b> attribute an edge if the target node
      inherits from its source. In this case we see that our class AnalyseGas
      inherits from the classes SFRTools and EmissionLineTools. SFR means 'star
      formation rate' while an 'emission line' is a concept employed in spectral
      analysis. Roughly spoken, the galaxies that Xgaltool searches for (merging
      galaxies) exhibit a specific kind of emission line (those that show a
      double peak) that can be computed from the RCSED. We have now found out
      that the search for specific emission lines (EmissionLineTools) in the
      context of the general task of a spectral analysis (AnalyseGas) is linked
      to the information about the star formation rate (SFRTools) and how this
      relationship is realized in the code.
    </p>
    <br />
    <br />
    <br />
    <figure>
      <img
        src="../assets/fig34.jpg"
        alt="Figure 2.1"
        width="50%"
        height="50%"
      />
      <figcaption>
        Figure 2.1 analysis_tools class after edge and node filter application
      </figcaption>
    </figure>
    <br />
    <p>
      For even further investigation into the source codes nature, you can
      double click any node to open the corresponding file with your Code Editor
      of choice which can be set in the <b>Options</b> page. However, we
      recommend using Window's free Code Editor
      <a href="https://code.visualstudio.com/" target="_blank">
        Visual Studio Code</a
      >
      with its build in syntax-highlighting. Of course, this interaction can be
      applied to different edge-node-filters for different outcomes. Help in
      creating your own filter files is being provided in our
      <b>Filter Generation</b> section of the guide.
      <br />
      You can also export the rendered graph as an .svg file and edit it with
      <a href="https://inkscape.org/" target="_blank">Inkscape</a> for example.
    </p>
    <h1>Filter Generation</h1>
    <p>
      Our tool uses
      <a
        href="https://en.wikipedia.org/wiki/Regular_expression#Basic_concepts"
        target="_blank"
        >regular expressions
      </a>
      (Regex) to filter certain code parts and render those as nodes or edges.
      Therefore we implemented a <b>Regex generator</b> to assist you generating
      a syntactical correct regular expression.<br />
      A regular expression is a string constisting of criterias which, applied
      to a text search (in our case program code), filters the text while
      returning all matching patterns.<br />
    </p>
    <p>
      Once you opened the Generator page, you will see that it is divided into
      three sections and two parts. The main part consists of the section
      <b>Package information</b> in which you can set underlying information of
      your generated filter package. Remember, that you cannot export your
      filter package file unless you pressed the <b>generate package</b> button
      which will initialize your filter package. The <b>Node filter</b> section
      lets you generate one or multiple node filters and the section
      <b>Edge filter</b> does so likewise for edge filters. The Package Explorer
      will provide you with useful information about your filter package and its
      filters while you are working on them. This is helpful to keep track of
      your current work.
    </p>
    <br />
    <br />
    <h3>Node filter</h3>
    <p>
      The first part of the Node filter is all about generating a Regex from a
      given code snippet. All you need to do is to copy and paste an example
      code snippet from your source code to start generating your Regex as
      follows:<br /><br />
    </p>
    <p>
      From left to right, select the part of your code snippet of which you wish
      to generate a (partial) regular expression from. To assist you doing so,
      we offer a list of predetermined commonly used rulesets. By highlighting a
      certain part of your code snippet and selecting an option from our
      predetermined list (optionally in combination with the
      <b>capture group</b> check mark and/or a <b>quantifier</b>) a valid
      regular expression will then be generated.
    </p>
    <p>
      A quantifier allows you to set a range of occurrences for the preceded
      expression. Therefore you can choose from different ranges:<br /><br />
    </p>
    <div id="list">
      <ul>
        <li>
          <i>{min,max}</i> for at least <i>min</i> and at most
          <i>max</i> occurrences
        </li>
        <li><i>{n}</i> for exactliy <i>n</i> occurrences</li>
        <li>
          <i>?</i> for none or one occurrence (equivalent to <i>{0,1}</i>)
        </li>
        <li>
          <i>+</i> for at least one occurrence (equivalent to <i>{1, }</i>)
        </li>
        <li>
          <i>*</i> for any number of occurrences (equivalent to <i>{0, }</i>)
        </li>
        <li>
          using none quantifier at all matches the default <i>{1}</i>
          quantifier.
        </li>
      </ul>
    </div>
    <br />
    <br />
    <p>
      To clarify, we provide a complete rundown on how one could generate our
      python class-extension filter regex from a given code snippet. You might
      also just use your own Regex.
    </p>
    <br />
    <br />
    <video width="650" height="400" controls>
      <source src="local-video://regex_generation_example.mp4" />
    </video>
    <br />
    <br />
    <p>
      Alongside you will find the option to add a <b>capture group</b>. As the
      name suggests, a capture group lets you capture text patterns matching the
      ruleset inside its round brackets. They can be regarded as a container for
      similar code patterns. We use this feature to draw the edges between two
      nodes (in this case between two named capture groups). Therefore, it is
      mandatory to name each of your specifified capture groups by filling out
      the <i>set capture group name</i> field. To assign a named capture group
      to an actual capture group in your Regex, simply write down its index
      inside the <i>set capture groups</i> field (starting at 1 from left to
      right). It is possible to assign multiple capture groups to one named
      capture group by separating them with a comma. Remember to always press
      the <i>add</i> button to push your changes into your filter before
      continuing with another named capture group.<br /><br />
      To show you an example, we will use the previous generated Regex:
      <br /><br />
      <v-content>
        <code>class\s<b>([A-Za-z]+)</b>\\(<b>(.*)</b>\\)\\:</code>
      </v-content>
      <br /><br />
      The first capture group with index 1 will collect all terms inside your
      program code matching the <i>[A-Za-z]+</i> pattern (this ruleset equals to
      any positive number of upper or lower case letters) with a preceding
      <i>class </i> term. Thus, it will collect all class-names. The second
      capture group (matching any number of any character, except line breaks)
      with index 2 will then collect all class-names of those classes the
      associated class in capture group 1 inherits from. Remember that this is
      just an example for the python programming language as your Regex or
      capture groups will differ from this one according to your chosen
      programming language's syntax.
      <br />
      <br />
      After you succesfully generated a Regular Expression, our Tool will give
      you the opportunity to provide some additional information about your
      filter package such as the <b>node label</b> (which will be shown as a
      Prefix inside the node followed by the <b>label attribute</b> as seen in
      Figure 2.1) or an exclude Regex which will ignore code patterns in the
      rendering process matching its Regex. Regarding the correct rendering of
      your graph, it is important to name and set your previously generated
      capture groups correctly. Figures 3.1 and 3.2 will show the assignment of
      both of our determined capture groups in the same way we used it to create
      our basic python filter package by naming our first capture group
      <i>className</i> and our second group <i>extends</i>. At last you will be
      asked to select a <i>label attribute</i> for the rendered nodes. You will
      have the option to choose between your previous assigned capture groups to
      choose which information (captured by your capture groups) should be
      shown. The label of a rendered node will then be displayed in the form
      <b>node label:label attribute</b>.
    </p>
    <br />
    <br />
    <br />
    <figure>
      <img
        src="../assets/capture_1.jpg"
        alt="Figure 3.1"
        width="70%"
        height="70%"
      />
      <figcaption>
        Figure 3.1 - assignment of the first capture group
      </figcaption>
    </figure>
    <br />
    <figure>
      <img
        src="../assets/capture_2.jpg"
        alt="Figure 3.2"
        width="70%"
        height="70%"
      />
      <figcaption>
        Figure 3.2 - assignment of the second capture group
      </figcaption>
    </figure>
    <br />
    <br />
    <h3>Edge filter</h3>
    <p>
      A Node Filter on its own is enough to render a graph.<br />
      But if you would like to represent additional information, you can also
      add edge filters by simply choosing a source and target attribute as shown
      in figure 4.1. Therefore you will have to select the respective Node
      Filter from your package and one of its previously declared capture groups
      to generate directed edges with your chosen edge label.
    </p>
    <br />
    <br />
    <br />
    <figure>
      <img
        src="../assets/edgefilter.jpg"
        alt="Figure 4.1"
        width="50%"
        height="50%"
      />
      <figcaption>Figure 4.1 - edge filter</figcaption>
    </figure>
  </v-main>
</template>
<style scoped>
h2 {
  text-align: left;
  margin-left: 45px;
  margin-right: 45px;
}

ul {
  text-align: left;
}

h3 {
  font-size: 25px;
}

a {
  color: #42b983;
}

video {
  box-shadow: 2px 2px 5px 5px;
  margin-top: 10px;
}

#list {
  margin-left: 33%;
  margin-right: 33%;
  list-style-position: outside;
}

p {
  margin-left: 15%;
  margin-right: 15%;
  text-align: start;
}
</style>
