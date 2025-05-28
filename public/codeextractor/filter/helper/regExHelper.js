/* eslint-disable prettier/prettier */
/**
 * Creates a new Regular Expression Object from a given string (usually from a filter file).
 * @param {string} str The string of a given RegEx from a filter file.
 * @returns A new RegEx Object including the RegEx and its flags.
 */
RegExp.fromString = (str) =>
    new RegExp(
        str.slice(1, str.lastIndexOf("/")),
        str.slice(str.lastIndexOf("/") + 1)
    );
