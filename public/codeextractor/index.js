const getGraph = require('./files/getGraph');
const filter = require('./filter/filter');
const saveGraphToFile = require('./filter/helper/saveGraphToFile');

/** Defining entry points for module exports. */
module.exports = {
  getGraph: getGraph.getGraph,
  saveGraphToFile: saveGraphToFile.saveGraphToFile,
  filterNode: filter.filterNode,
  filterEdge: filter.filterEdge,
  loadNodeFilter: filter.loadNodeFilter,
  loadEdgeFilter: filter.loadEdgeFilter,
  loadJSON: filter.loadJSON,
}