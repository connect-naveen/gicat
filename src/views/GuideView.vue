<template>
  <v-main>
    <div class="guide"></div>
    <h1>Motivation</h1>
    <p>
      As mentioned in [source?], the analysis of a program is quite complex.
      This is due to the large amount of different programming languages but
      also the possibility to run a code analysis from multiple points of view
      such as inheritance, refactoring, comments, class growth etc. To address
      those issues, our tool provides you with the functionality to generate
      your own filter files based on regular expressions (<b>Regex</b>) which
      will be generated from from a given code snippet. Those filter files can
      then be used to analyze a given source code by its rules. Thereby, the
      programming language and the specific type of the analysis process is left
      open to the users deciscions.
    </p>
    <p>
      In the follwing, we are going to provide a short Use case showing how our
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
      A filter package can contain two different types of filters. (node and
      edge filters)<br />
      As our first example, we will take a look at two different versions of the
      previously mentioned xgaltool. We applied our python class
      <b>node filter</b> from our basic python filter package onto two different
      snapshots of the xgaltool's source code. You can double click onto
      rectangular nodes to collapse/reveal all of its outgoing edges and left
      click rounded nodes to highlight them and their edges. Using your
      mousewheel allows you to zoom in/out of the visualization and holding down
      the left mouse button lets you move around. By doing so, one can adjust
      the visualization to their likings and export the emerging graph as a svg
      file.
      <br />
      <br />
      As you might see in Figure 1.1 and Figure 1.2, the project structure
      changed at several places between November 2021 and June 2023. For
      example, the edge between the two classes EnvironmentTools and PlotBPT
      does exist in the 2021 version, but not in the later 2023 version thus
      removing dependencies between the two groups plotting_tools and
      analysis_tools.
    </p>
    <figure>
      <img
        src="../assets/figure32old.jpg"
        alt="Figure 1.1 old code base"
        width="1000"
        height="800"
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
        width="1000"
        height="800"
      />
      <figcaption>
        Fig.1.2 - GICAT view on xgaltool of June 19th 2023
      </figcaption>
    </figure>
    <br />
    <br />
    <p>
      For a deeper analysis into classes for example, the use of
      <b>edge filters</b> is strongly recommended. As you can see in Figure 2.1
      after using the python class node filter in combination with our python
      class-edge filter, an <b>extends</b> attribute pops up above an edge if
      the target node inherits from its source.
    </p>
    <figure>
      <img
        src="../assets/fig34.jpg"
        alt="Figure 2.1"
        width="600"
        height="400"
      />
      <figcaption>
        Figure 2.1 analysis_tools class after edge and node filter application
      </figcaption>
    </figure>
    <br />
    <p>
      For even further investigation into the source codes nature, you can
      double click any node to open the corresponting file with your Code
      Editior of choice which can be set in the <b>Options</b> page. However, we
      recommend using Window's free Code Editor
      <a href="https://code.visualstudio.com/" target="_blank">
        Visual Studio Code</a
      >
      with its build in syntax-highlighting. Of course, this interaction can be
      applied to different edge-node-filters for different outcomes. Help in
      creating your own filter files is being provided in our
      <b>Filter Generation</b> section of the guide.
    </p>
    <br /><br />
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
      follows:
    </p>
    <p>
      From left to right, select the part of your code snippet of which you wish
      to generate a (partial) regular expression from. To assist you doing so,
      we offer a list of predetermined commonly used regular expressions. By
      highlighting a certain part of your code snippet and selecting an option
      from our predetermined list (optionally in combination with the
      <b>capture group</b> check mark and a <b>quantifier</b>) a valid regular
      expression will then be generated. To clarify, we provide a complete
      rundown on how one could generate our python class-extension filter regex
      from a given code snippet.
    </p>
    <video width="650" height="420" controls>
      <source src="../../public/regex_generation_example.mp4" />
    </video>
    <br />
    <br />
    <h3>Quantifier</h3>
    <p id="center">
      A quantifier allows you to set a range of occurrences for the preceded
      expression. Therefore you can choose from different ranges:<br /><br />
    </p>
    <div class="col-lg-3" id="list">
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
    <section id="capture groups"></section>
    <h3>Capture groups</h3>
    <p>
      Alongside you will find the input fields <i>set attributes</i>,
      <i>set capture groups</i> and <i>label attribute</i>. First, lets talk
      about <b>capture groups</b>: as the name suggests, a capture group lets
      you capture text patterns matching the ruleset inside its round brackets.
      They can be regarded as a container for similar code patterns. We use this
      feature to draw the edges between two nodes (in this case between two
      named capture groups). Therefore, it is mandatory to name each of your
      specifified capture groups by filling out the
      <i>set capture group name</i> field. To assign a named capture group to an
      actual capture group in your Regex, simply write down its index inside the
      <i>set capture groups</i> field (starting at 1 from left to right). It is
      possible to assign multiple capture groups to one named capture group by
      separating them with a comma. Remember to always press the
      <i>add</i> button to push your changes into your filter before continuing
      with another named capture group.<br /><br />
      To show you an example, we will use the previous generated Regex:
      <br /><br />
      <v-content>
        <code>class <b>([A-Za-z]+)</b>\\(<b>(.*)</b>\\)\\:</code>
      </v-content>
    </p>
  </v-main>
</template>
<style scoped>
p,
h2 {
  text-align: left;
  margin-left: 45px;
  margin-right: 45px;
}

#center {
  text-align: center;
}

#list {
  background-color: whitesmoke;
  margin-left: 45px;
  margin-right: 45px;
  border-radius: 15px;
  text-align: center;
}

video {
  clip-path: inset(1px 1px);
}

ul {
  display: inline-block;
  text-align: left;
}

li {
  margin-top: 5px;
}

h3 {
  font-size: 20px;
}

a {
  color: #42b983;
}

video {
  box-shadow: 2px 2px 5px 5px;
  margin-top: 10px;
}
</style>
