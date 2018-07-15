const util = require("util");
const crypto = require("crypto");

/**
 * Generates a random integer in the interval [lo, hi].
 * @param {!number} lo   the lower bound on the generated integer. lo must be an
 * integer.
 * @param {!number} hi   the upper bound on the generated integer. hi must be an
 * integer greater than or equal to lo.
 * @returns {!number}   the generated random integer
 */
function nextInt(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/**
 * Shuffles the given array in-place. Each of the (array.length)! permutations
 * is equally likely.
 * @param {!*[]} array   the array to shuffle
 */
function shuffle(array) {
    for (let i = 0; i < array.length; i++) {
        let j = nextInt(i, array.length - 1);
        swap(array, i, j);
    }
}

/**
 * Swaps the elements of the given array at the given indices.
 * @param {!*[]} array   the array to swap the elements of
 * @param {!number} i   the index of one of the elements to swap. i must be a
 * valid index.
 * @param {!number} j   the index of the other element to swap. j must be a
 * valid index.
 */
function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

/**
 * Generates a random translation ID (consisting of 32 hex characters.) Does not
 * check whether the generated translation ID is already in use in the database.
 * @returns {Promise<!string>}   the generated translation ID
 */
async function generateTranslationId() {
    const randomBytesAsync = util.promisify(crypto.randomBytes);

    let data = await randomBytesAsync(16);
    return data.toString("hex");
}

module.exports.nextInt = nextInt;
module.exports.shuffle = shuffle;
module.exports.generateTranslationId = generateTranslationId;
