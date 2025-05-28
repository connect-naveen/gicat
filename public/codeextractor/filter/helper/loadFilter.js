const fs = require('fs')

/**
 * Function which takes a file path or a FileDescriptor of a JSON file and returns its content as a string.
 * @param {PathOrFileDescriptor} filterFile Path to file or a FileDescriptor as a reference to an open file. 
 * @returns {string}  The parsed string of a JSON File
 */
const loadNodeFilter = function (filterFile) {
  return loadJSON(filterFile);
}

/**
 * Function which takes a file path or a FileDescriptor of a JSON file and returns its content as a string.
 * @param {PathOrFileDescriptor} filterFile Path to file or a FileDescriptor as a reference to an open file.
 * @returns {string}  The parsed string of a JSON File
 */
const loadEdgeFilter = function (filterFile) {
  return loadJSON(filterFile);
}

/**
 * Helper function which takes a file path or a FileDescriptor of a JSON file and returns its content as a string.
 * @param {PathOrFileDescriptor} file Path to file or a FileDescriptor as a reference to an open file.
 * @returns {string}  The parsed string of a JSON File
 */
const loadJSON = function (file) {
  try {
    return JSON.parse(fs.readFileSync(file))
  } catch (e) {
    console.error("The json could not be loaded")
    throw e
  }
}

export {
  loadNodeFilter,
  loadEdgeFilter,
  loadJSON,
}