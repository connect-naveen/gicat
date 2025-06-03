const fs = require('fs')

/**
 * This is not being used at the moment. Converts the graph data into a JSON string and tries to save it on the system.
 * @param {PathOrFileDescriptor} file Filename or file descriptor
 * @param {*} graph A JavaScript value, usually an object or array of a generated graph, to be converted.
 */
exports.saveGraphToFile = function (file, graph) {
  try {
    let data = JSON.stringify(graph, null, "\t")
    fs.writeFileSync(file, data)
    // console.log("Saved graph to file " + file)
  } catch (e) {
    // console.error("The graph could not be saved to the specified file")
    throw e
  }
}