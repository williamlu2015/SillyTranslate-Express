let Queue = function(max_size) {
    let queue = {};

    queue.datum = Array(max_size).fill({});
    queue.front = 0;
    queue.back = 0;

    /**
     * Adds the given data to the back of this Queue, removing the data at the
     * front of this Queue if this Queue is already full.
     * @param {*} data   the data to add to the back of this Queue
     */
    queue.push = function(data) {
        if (queue.isFull()) {
            queue.pop();
        }

        queue.datum[queue.back] = data;
        queue.back = (queue.back + 1) % max_size;
    };

    /**
     * Removes and returns the data at the front of this Queue. If this Queue is
     * empty, throws an Error.
     * @returns {*}   the data at the front of this Queue
     */
    queue.pop = function() {
        if (queue.isEmpty()) {
            throw Error("Queue is empty");
        }

        let result = queue.datum[queue.front];
        queue.front = (queue.front + 1) % max_size;
        return result;
    };

    /**
     * Returns the data at the front of this Queue. If this Queue is empty,
     * throws an Error.
     * @returns {*}   the data at the front of this Queue
     */
    queue.peek = function() {
        if (queue.isEmpty()) {
            throw Error("Queue is empty");
        }

        return queue.datum[queue.front];
    };

    /**
     * Returns the number of data entries in this Queue.
     * @returns {!number}   the number of data entries in this Queue
     */
    queue.size = function() {
        if (queue.front <= queue.back) {
            return queue.back - queue.front;
        } else {
            return (max_size - queue.front) + queue.back;
        }
    };

    /**
     * Returns true iff this Queue does not contain any data entries.
     * @returns {!boolean}   true iff this Queue does not contain any data
     * entries
     */
    queue.isEmpty = function() {
        return queue.front === queue.back;
    };

    /**
     * Returns true iff this Queue contains exactly (max_size - 1) data entries.
     * @returns {!boolean}   true iff this Queue contains exactly (max_size - 1)
     * data entries
     */
    queue.isFull = function() {
        return (queue.back + 1) % max_size === queue.front;
    };

    /**
     * Returns a new array containing the data entries in this Queue sorted by
     * the time they were pushed to this Queue (data entries that were pushed
     * earlier have lower indices in the result array.)
     * @returns {!*[]}   a new array containing the data entries in this Queue
     */
    queue.toList = function() {
        let result = [];
        for (let i = queue.front; i !== queue.back; i = (i + 1) % max_size) {
            result.push(queue.datum[i]);
        }
        return result;
    };

    return queue;
};

module.exports = Queue;
