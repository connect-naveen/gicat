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
    <h1>Filter Generation</h1>
  </v-main>
</template>
<style scoped>
p,
h2 {
  text-align: left;
  margin-left: 45px;
  margin-right: 45px;
}

ul {
  text-align: left;
  margin-left: 25px;
}

h3 {
  text-align: left;
  margin-left: 5px;
  font-size: 14px;
}

a {
  color: #42b983;
}

img {
  margin-right: 25px;
}

video {
  box-shadow: 2px 2px 5px 5px;
  margin-top: 10px;
}
</style>
