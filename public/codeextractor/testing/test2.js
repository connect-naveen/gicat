const ce = require('../index')

const nodeFilter1 = ce.loadNodeFilter("./csslab-filter-library/nodeFilters/commentFilter.json")
const nodeFilter2 = ce.loadNodeFilter("./csslab-filter-library/nodeFilters/classFilter.json")

const edgeFilter = ce.loadEdgeFilter("./csslab-filter-library/edgeFilters/classEdgeFilter.json")

console.log('reading graph...')
const graph = ce.getGraph("./testing/testfiles")

;(async () => {
  console.log('filtering nodes...')
  await ce.filterNode(graph, nodeFilter1)
  await ce.filterNode(graph, nodeFilter2)

  console.log('filtering edges...')
  await ce.filterEdge(graph, edgeFilter)
  console.log('edges completely generated')

  console.log('save graph to file:')
  await ce.saveGraphToFile("./testing/tests/graph.json", graph)

})();