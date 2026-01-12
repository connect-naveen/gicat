/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

/**
 * This function creates edges between nodes based on the given edge filter.
 * It first determines all eligible source and target nodes based on the filter criteria.
 * Then it calls the createEdges function to generate the edges between these nodes.
 * @param {ObjectConstructor} graph The generated graph
 * @param {JSON} filter A generated filter file.
 * @returns After edges were created.
 */
exports.filterEdge = async function (graph, filter) {
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
 * Helper function to create the actual edges for edge filters from the eligible nodes which are being determined through the filterEdge function.
 * For every eligible source node it checks for each eligible target node if an edge should be created.
 * @param {ObjectConstructor} graph The graph data of the current graph with all its nodes and edges.
 * @param {Array} eligibleNodesFrom A list of eligible source nodes determined by the filterEdge function.
 * @param {Array} eligibleNodesTo A list of eligible target nodes determined by the filterEdge function.
 * @param {ObjectConstructor} filter The edge filter for which the edges should be created.
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
