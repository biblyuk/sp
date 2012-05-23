/**
 * Create a circularly-linked list
 *
 * Adapted from original version by James Coglan.
 *
 * @fileOverview
 * @copyright Assanka Limited [All rights reserved]
 * @author Matthew Caruana Galizia <matt.cg@ft.com>
 */


/**
 * @constructor
 */
function CircularList() {

	/**
	 * The length of the linked list
	 *
	 * @type number
	 */
	this.length = 0;


	/**
	 * The first item in the linked list
	 *
	 * @type Object
	 */
	this.first = null;


	/**
	 * The last item in the linked list
	 *
	 * @type Object
	 */
	this.last = null;
}


/**
 * Explicit item object to allow items to belong to more than linked list at a time
 *
 * @example
 * myList.append(new CircularList.Item(someObject));
 *
 * @constructor
 * @param {object} data
 */
CircularList.Item = function(data) {
	this.prev = null;
	this.next = null;
	this.data = data;
};


/**
 * Append an object to the linked list
 *
 * @param {object} item The item to append
 */
CircularList.prototype.append = function(item) {
	if (this.first === null) {
		item.prev = item;
		item.next = item;
		this.first = item;
		this.last = item;
	} else {
		item.prev = this.last;
		item.next = this.first;
		this.first.prev = item;
		this.last.next = item;
		this.last = item;
	}

	this.length++;
};


/**
 * Remove an item from the linked list
 *
 * @param {object} item The item to remove
 */
CircularList.prototype.remove = function(item) {
	if (this.length > 1) {
		item.prev.next = item.next;
		item.next.prev = item.prev;

		if (item === this.first) {
			this.first = item.next;
		}

		if (item === this.last) {
			this.last = item.prev;
		}
	} else {
		this.first = null;
		this.last = null;
	}

	item.prev = null;
	item.next = null;
	this.length--;
};


/**
 * Convert the linked list to an Array
 *
 * The first item in the list is the first item in the array.
 *
 * @return {Array}
 */
CircularList.prototype.toArray = function() {
	var i, item, array = [], length = this.length;

	item = this.first;

	for (i = 0; i < length; i++) {
		array.push(item);

		item = item.next;
	}

	return array;
};


/**
 * Insert an item after one already in the linked list
 *
 * @param {object} item The reference item
 * @param {object} newItem The item to insert
 */
CircularList.prototype.insertAfter = function(item, newItem) {
	newItem.prev = item;
	newItem.next = item.next;
	item.next.prev = newItem;
	item.next = newItem;

	if (newItem.prev === this.last) {
		this.last = newItem;
	}

	this.length++;
};

module.exports = CircularList;