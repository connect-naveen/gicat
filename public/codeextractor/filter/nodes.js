/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let helper = require("./helper/regExHelper");
let fs = require("fs");
let util = require("util");
let readFile = util.promisify(fs.readFile);
let matchAll = require("string.prototype.matchall");

/**
 * This function extracts the RegEx from the given node filter and selects all file-nodes with a matching file extension as eligible.
 * Then runs the addNodeToGraph function to resolve the Promise and add the data to the file-node.
 * @param {Object} graph The current graph Object.
 * @param {Object} filter The node filter Object.
 * @returns After all eligible file-nodes were processed.
 */
exports.filterNode = async function (graph, filter) {
  let filterRegExp = RegExp.fromString(filter.regex);
  // Set all file-nodes to be modified by the specific filter (for all eligible files)
  let eligibleFiles = graph.nodes.filter(
    (el) => el.meta.file && el.meta.extension === filter.extension
  );
  // For every eligible file add data to file-node
  await Promise.all(
    eligibleFiles.map(async (e) => {
      addNodeToGraph(
        graph,
        filterRegExp,
        filter,
        e,
        await readFile(e.id, "utf-8")
      );
    })
  );
  return;
};

/**
 * Removes all occurrences of the Regular Expression inside the data.
 * @param {RegExp} excludes Exclude RegEx.
 * @param {*} data
 * @returns The data without any matches of the exclude RegEx.
 */
const replaceExcludes = function (excludes, data) {
  for (exclude of excludes) {
    let r = RegExp.fromString(exclude);
    data = data.replace(r, "");
  }

  return data;
};

/**
 * Adds nodes to the graph based on the matches of the RegExp in the data of the file-node.
 * @param {Object} graph The current graph object.
 * @param {RegExp} regExp A Regular Expression.
 * @param {Object} filter A valid node filter.
 * @param {Object} fileNode A node of the graph representing a file.
 * @param {string} data Code File.
 * @returns After the nodes were added to the graph.
 */
const addNodeToGraph = function (graph, regExp, filter, fileNode, data) {
  if (filter.excludes) {
    data = replaceExcludes(filter.excludes, data);
  }
  let lineArr = data.split("\n");
  let matches = [];
  // for every line, test for regexp
  lineArr.forEach((line, index) => {
    let matchArr = [...matchAll(line, regExp)];
    // for every match (in every line, see above) push match data and line to match array
    matchArr.forEach((matchData) => {
      matches.push({
        matchData,
        lineIndex: index + 1,
      });
    });
  });
  // for every match
  for (match of matches) {
    // define every predefined attribute
    let attributes = {};
    for (a in filter.attributes) {
      // by trying to match the index to the attribute
      for (index of filter.attributes[a]) {
        if (match.matchData[index]) {
          attributes[a] = match.matchData[index];
          break;
        }
      }
    }
    // Generates the String of an attribute Object entry
    let attributesToString = function (obj) {
      let arr = Object.keys(obj).reduce(function (res, v) {
        return res.concat(obj[v]);
      }, []);
      return arr.toString();
    };
    let idStringTemp = fileNode.id + "|" + attributesToString(attributes);
    // Handles duplicates
    if (graph.nodes.some((e) => e.id === idStringTemp)) {
      // console.warn("Duplicates where found. The Graph does not show duplicates at the moment")
      continue;
    }
    // Actual generation of a node
    // If a label Attribute exists in the filter file: generate the label as expected
    let generatedLabel = filter.labelAttribute
      ? filter.label + ": " + attributes[filter.labelAttribute]
      : filter.label;
    //create new node
    let newNode = {
      id: idStringTemp,
      label: generatedLabel,
      group: fileNode.id,
      meta: {
        color: filter.style.color,
        filterID: filter.id,
        matches: attributes,
        line: match.lineIndex,
      },
    };
    //create edge
    graph.nodes.push(newNode);
    let newEdge = {
      from: idStringTemp,
      to: fileNode.id,
      meta: {
        filterID: filter.id,
        color: filter.style.color,
      },
    };
    graph.edges.push(newEdge);
  }
  return;
};
