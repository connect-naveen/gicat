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
      want to, you can also add a <a href="#capture groups">capture group</a> to
      that part of the Regex.
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
      <li>
        using none quantifier at all matches the default <i>{1}</i>
        quantifier.
      </li>
    </ul>
    <br />
    <p>
      The following video shows an example by generating a Regex for the
      programming language Java which is supposed to filter all subclasses of a
      class A.<br />
      In Java, all classes can have an <b>optional</b> keyword such as
      <i>public</i> or <i>private</i> in front of them which is why we use the
      <i>*</i> quantifier in the first step. Then, we mark the keyword
      <i>class</i> as mandatory since it signals a following class name. We also
      wrap the class name inside a <a href="#capture groups">capture group</a>.
      The keyword <i>extends</i> signals that the previously captured classname
      is a subclass of its succeeding superclass which is why it's marked as
      mandatory. Last but not least, we capture the superclass <i>A</i> of which
      we want to find all subclasses.
      <br />
    </p>
    <video
      width="360"
      height="300"
      controls
      loop
      autoplay
      controlsList="nofullscreen"
    >
      <source src="local-video://example.mp4" type="video/mp4" />
    </video>
    <br /><br />
    <p>
      You will then proceed providing information about the node filter such as
      file extension, filter name, etc. You can also add a Regex for patterns
      which shall be ignored by our visualization tool.<br />
    </p>
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
      <code>[A-Za-z]*\sclass\s<b>([A-Za-z]+)</b>\sextends\s<b>(A)</b></code>
      <br /><br />
      As you can see, there are two different capture groups. The first one
      matches all subclasses of its superclass. The latter matches the addressed
      superclass A. One possible allocation of the named capture groups might
      look like this:<br /><br />
      <img src="..\assets\sub.jpg" alt="child class" width="175" height="150" />
      <img
        src="..\assets\super.jpg"
        alt="parent class"
        width="175"
        height="150"
      />
      <br /><br />
      If you've been doing everything correctly, the dropdown
      <i>label attribute</i> will now show you a selection of your previously
      added capture class names of which you will be able to select one. This
      selection will later be used as a label for all nodes in the visualisation
      part in the likes of <i>node label:capture group name</i>. You can always
      select <i>null</i> if you would like to show the <i>node label</i> only.
    </p>
    <br /><br />
    <h1>Code Editor</h1>
    <p>
      You can also select nodes of our visualization tool and jump to the
      corresponding line of code inside its associated file by right clicking
      it. To do so, you will need Microsoft's code editor
      <a href="https://code.visualstudio.com/" target="_blank">
        Virtual Studio Code </a
      >to make use of their built-in syntax highlighting.
    </p>
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

img {
  margin-right: 25px;
}

video {
  box-shadow: 2px 2px 5px 5px;
  margin-top: 10px;
}
</style>
