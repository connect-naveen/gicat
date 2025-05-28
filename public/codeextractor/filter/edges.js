/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
//const filter = require("./filter");

/**
 * Asynchronous function which is being used to add the edges found from an edge filter to the graph.
 * Therefore it creates a list of eligible source and target nodes by filtering the list of graph nodes as follows:
 * * checks if the node filter ID of a node equals to either the edge filter ID of the source or target (from/to) attribute of the provided edge filter, AND
 * * checks if the node has any entries in the respective from/to-attribute matches column.
 *
 * and runs the createEdges function with the lists of eligible nodes.
 * @param {ObjectConstructor} graph The generated graph
 * @param {JSON} filter A generated filter file.
 * @returns After edges were created.
 */
exports.filterEdge = async function (graph, filter) {
  //console.log("edge-filter starting (FilterID: " + filter.id + ")")
  /*
  Only nodes which have the given filter metadata are considered for edge creation:
    1. they need to have the specific filter tag
    2. they need to have the attribute the edge filter is looking for (depending on from/to)
  */
  let eligibleNodesFrom = graph.nodes.filter(
    (el) =>
      el.meta.filterID === filter.from.nodeFilterID &&
      el.meta.matches[filter.from.attribute]
  );
  let eligibleNodesTo = graph.nodes.filter(
    (el) =>
      el.meta.filterID === filter.to.nodeFilterID &&
      el.meta.matches[filter.to.attribute]
  );
  try {
    await createEdges(graph, eligibleNodesFrom, eligibleNodesTo, filter);
  } catch (e) {
    console.warn(e);
    throw (
      "An error has occurred while creating the edges of filter " + filter.id
    );
  }
  return;
};

/**
 * Asynchronous function which creates the actual edges for edge filters from the eligible nodes which are being determined through the filterEdge function.
 * For every eligible source node it checks for each eligible target node if an edge should be created.
 * @param {ObjectConstructor} graph The graph data of the current graph with all its nodes and edges.
 * @param {Array} eligibleNodesFrom A list of eligible source nodes determined by the filterEdge function.
 * @param {Array} eligibleNodesTo A list of eligible target nodes determined by the filterEdge function.
 * @param {ObjectConstructor} filter
 */
const createEdges = async function (
  graph,
  eligibleNodesFrom,
  eligibleNodesTo,
  filter
) {
  for (nodeFrom of eligibleNodesFrom) {
    for (nodeTo of eligibleNodesTo) {
      if (
        nodeFrom.meta.matches[filter.from.attribute] ===
        nodeTo.meta.matches[filter.to.attribute] ||
        nodeFrom.meta.matches[filter.from.attribute].includes(
          nodeTo.meta.matches[filter.to.attribute]
        ) ||
        nodeTo.meta.matches[filter.to.attribute].includes(
          nodeFrom.meta.matches[filter.from.attribute]
        )
      ) {
        //console.log("adding edge from " + nodeFrom.id + " to " + nodeTo.id)
        graph.edges.push({
          from: nodeFrom.id,
          to: nodeTo.id,
          label: filter.label,
          meta: {
            filter: filter.id,
            color: filter.style.color,
          },
          arrows: "to",
        });
      }
    }
  }
};

/* tests two arrays containing matches if the wanted attributes match closely */
/*
const testForMatchesEquals = function (
  matchesFrom,
  matchesTo,
  attributeFrom,
  attributeTo
) {
  for (matchFrom in matchesFrom) {
    for (matchTo in matchesTo) {
      if (matchFrom[attributeFrom] === matchTo[attributeTo]) {
        return true;
      }
    }
  }
  return false;
};
*/

/* tests two arrays containing matches if the wanted attributes match closely */
// Q? in which direction to test, from includes to or to includes from?
/*
const testForMatchesIncludes = function (
  matchesFrom,
  matchesTo,
  attributeFrom,
  attributeTo
) {
  for (matchFrom of matchesFrom) {
    for (matchTo of matchesTo) {
      if (matchFrom[attributeFrom] === matchTo[attributeTo]) {
        return true;
      }
    }
  }
  return false;
};
*/
