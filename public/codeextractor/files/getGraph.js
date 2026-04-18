  const dirTree = require("directory-tree");
//const fs = require("fs");

/** This function generates the node label of a file or directory from its file path.
 * @param {string} temp File or directory path.
 * @returns {string} File or directory name.
 */
const getBase = function (temp) {
  return temp.split("/").splice(-1)[0];
};

/**
 * Generate the baseline graph (folders in the directory and all its files nested in them)
 * by utilizing the dirTree library which creates a JavaScript object representing a directory tree.
 * Also adds the size of the Graph to the root nodes meta data.
 * @see {@link https://www.npmjs.com/package/directory-tree} Official dirTree Documentation.
 * @param {string} dir A String representing the path to the directory.
 * @param {RegExp} extensions A RegExp to test for exclusion of files with the matching extension.
 * @param {RexExp | RegExp[]} exclude A RegExp or an array of RegExp to test for exclusion of directories.
 * @param {any} graph Graph
 * @returns {JSON} JavaScript Object representing a directory tree.
 */
const generateTree = function (dir, extensions, exclude, graph) {
  dirTree(
    dir,
    {
      extensions,
      exclude,
      normalizePath: true, // normalize unix path
    },
    (item, PATH, stats) => {
      addFile(item, PATH, stats, graph);
    },
    (item, PATH, stats) => {
      if (item.path == dir) {
        graph.meta.size = item.size;
      }
      addDirectory(item, PATH, stats, graph);
    }
  );
  return graph;
};

/**
 * Callback function used in generateTree() to add files found through dirTree to the graph.
 * Generates the label for a node and adds the node to the graph including some of the following meta information:
 * @param {any} item Directory item (has path, name, size, and extension)
 * @param {any} PATH Instance of node path (provides utilities for working with file and directory paths) @see {@link https://nodejs.org/api/path.html#path}
 * @param {any} stats Instance of node FS.stats (provides information about a file) @see {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
 * @param {any} param3 Nodes of the current graph.
 */
const addFile = function (item, PATH, stats, { nodes }) {
  let label = getBase(item.path);
  let extension = "." + label.split(".").splice(-1)[0]; //pls rework doesn't look good
  nodes.push({
    id: item.path,
    label,
    group: item.path,
    shape: "box",
    meta: {
      color: "#8ebae5",
      extension: extension,
      size: item.size,
      file: true,
      filterID: null,
    },
  });
};

/**
 * Callback function used in generateTree() to add directories found through dirTree to the graph.
 *  Then, adds edges for each of its contained files from the directory node towards all of its file nodes with the default label:
 *
 * 'source' is a child of 'target'
 *
 * to the graph.
 * @param {any} item Directory item (has path, name, size, and extension)
 * @param {any} PATH Instance of node path (provides utilities for working with file and directory paths) @see {@link https://nodejs.org/api/path.html#path}
 * @param {any} stats Instance of node FS.stats (provides information about a file) @see {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
 * @param {any} param3 Nodes and edges of the current graph.
 */
const addDirectory = function (item, PATH, stats, { nodes, edges }) {
  let label = getBase(item.path);
  nodes.push({
    id: item.path,
    label,
    group: item.path,
    shape: "square",
    meta: {
      color: "#8ebae5",
      size: item.size,
      file: false,
      filterID: null,
    },
  });
  item.children.forEach((element) => {
    label = `${getBase(element.path)} is a child of ${getBase(item.path)}`;
    edges.push({
      from: element.path,
      to: item.path,
      meta: {
        filterID: null,
        color: "#17202A",
      },
    });
  });
};

// exported function
module.exports.getGraph = function (dir, ext = [], exc = [".git"]) {
  if (!dir) console.error("No Path specified");
  let graph = {
    nodes: [],
    edges: [],
    meta: {
      size: 0,
    },
  };
  let extensions;
  if (ext.length > 0) {
    extensions = new RegExp(".(" + ext.join("|") + ")$");
  } else {
    extensions = new RegExp("");
  }
  
const exclude = /[\\/](node_modules|\.git|\.vscode|\.idea|\.vs|\.settings|\.gradle|dist_electron|dist|build|out|bin|obj|target|vendor|pkg|__pycache__|venv|env|\.venv|\.tox|coverage|captures|Debug|Release)([\\/]|$)/i;

  // let exclude;
  // if (exc.length > 0) {
  //   exclude = new RegExp(exc.join("|"));
  // } else {
  //   exclude = null;
  // }
  return generateTree(dir, extensions, exclude, graph);
};
