<template>
  <div class="guide">
    <h1>Generator</h1>
    <br />
    <h2>Package information</h2>
    <p>
      Our Generator provides you with the opportunity to gather one or multiple
      edge and node filters in one single filter file.<br />
      While the entries for authors and description are completely optional, the
      <b>package name</b> cannot be empty for our visualisation to work
      properly.<br />
      Before you can start working on your own node or edge filters you will
      need to click the <b>generate package</b> button. This will create a new
      filter package which will include all your different kinds of filters. If
      used correctly, information about your filter will be shown on the
      Generator page to keep track of your work.<br /><br />
    </p>
    <h2>Node filter</h2>
    <p>
      Our tool uses
      <a
        href="https://en.wikipedia.org/wiki/Regular_expression#Basic_concepts"
        target="_blank"
        >regular expressions
      </a>
      (Regex) to extract certain code part and render those as nodes.<br />
      Therefore we implemented a <b>Regex generator</b> to assist you generating
      a correct regular expression.<br />
      A regular expression is a string constisting of criterias which, applied
      to a text search (in our case program code), filters the text while
      returning all matching patterns.<br />
    </p>
    <section id="regex generator"></section>
    <h3>Regex Generator:</h3>
    <p>
      Once you opened the Generator page, you will see the input field called
      <b>code snippet</b> in which you can paste a piece of code you want to
      generate a regular expression from. The generator will generate a Regex as
      follows:<br />
      From left to right: mark parts of the code snippet with your cursor. You
      can then decide if that part of the code is mandatory (f.e. key words like
      <i>class</i> or the beginning of a <i>comment</i>), arbitrary, etc. If you
      want to, you can also add a <b>capture group</b> to that part of the
      Regex.
      <br />
    </p>
    <h3>Quantifier:</h3>
    <p>
      A quantifier allows you to set a range of occurrences for the preceded
      string. Therefore you can choose from (optional) different ranges:<br /><br />
    </p>
    <ul>
      <li>
        <i>{min,max}</i> for at least <i>min</i> and at most
        <i>max</i> occurrences
      </li>
      <li><i>{n}</i> for exactliy <i>n</i> occurrences</li>
      <li><i>?</i> for none or one occurrence (equivalent to <i>{0,1}</i>)</li>
      <li><i>+</i> for at least one occurrence (equivalent to <i>{1,}</i>)</li>
      <li>
        <i>*</i> for any number of occurrences (equivalent to <i>{0,}</i>)
      </li>
    </ul>
    <br />
    Clicking the <b>submit</b> button will generate the associated part of your
    Regex.<br />
    The following video shows an example by generating a Regex which is supposed
    to filter all comments in Java. In Java, the characters <i>//</i> mark the
    beginning of a single line comment:<br /><br />
    <video
      width="360"
      height="300"
      controls
      loop
      autoplay
      controlsList="nofullscreen"
    >
      <source src="..\assets\example.mp4" type="video/mp4" />
    </video>
    <br /><br />
    <h2>Edge filter</h2>
  </div>
</template>
<style scoped>
p,
h2 {
  text-align: left;
  margin-left: 5px;
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
</style>
