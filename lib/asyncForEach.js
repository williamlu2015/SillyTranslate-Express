/**
 * @callback asyncForEachCallback
 * @param {*} element   an element of array
 * @param {!number} index   the index of element
 * @param {!*[]} array   the array the for-each loop is traversing
 */

/**
 * Calls the given callback on each element in the given array, awaiting the
 * execution of the callback on the current element before calling the callback
 * on the next element.
 * @param {!*[]} array   the array to traverse
 * @param {!asyncForEachCallback} callback   the function to call on and await
 * for each element in array
 * @returns {Promise<void>}
 */
async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
}

module.exports = asyncForEach;
