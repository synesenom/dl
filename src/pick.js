/**
 * Class for generating various random entities.
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Content_type
 */
const pick = {
    /**
     * Core functionality.
     * The core random generator and basic uniform generators.
     */
    core: {
        /**
         * The main random number generator.
         * If min > max, a random number in (max, min) is generated.
         *
         * @param min Lower boundary.
         * @param max Upper boundary.
         * @returns {number} Random number in (min, max) if min < max, otherwise a random number in (max, min).
         * @private
         */
        _r: function(min, max) {
            if (min >= max)
                return Math.random()*(min-max) + max;
            return Math.random()*(max-min) + min;
        },

        /**
         * Selects a random element from an array.
         *
         * @param values Array of values.
         * @returns {object} Random element if array has any, null pointer otherwise.
         * @private
         */
        _choice: function(values) {
            if (values.length == 0)
                return null;
            return values[Math.floor(Math.random() * values.length)];
        },

        /**
         * Selects a random character of a string.
         *
         * @param string String to select character from.
         * @returns {string} Random character if string is noy empty, empty string otherwise.
         * @private
         */
        _char: function(string) {
            if (string.length == 0)
                return "";
            return string.charAt(Math.floor(Math.random() * string.length));
        },

        /**
         * Generates a random float in (min, max).
         * If min > max, a random number in (max, min) is generated.
         * If max is not given, a random number in (0, min) is generated.
         * If no arguments are given, returns a random float in (0, 1).
         *
         * @param min Lower boundary, or upper if max is not given.
         * @param max Upper boundary.
         * @returns {number} Random float in (min, max) if min < max, otherwise a random float in (max, min). If max
         * is not specified, random float in (0, min) if min > 0, otherwise in (min, 0). If none is specified, a random
         * float in (0, 1).
         */
        float: function (min, max) {
            if (arguments.length == 0)
                return this._r(0, 1);
            if (arguments.length == 1)
                return this._r(0, min);
            else
                return this._r(min, max);
        },

        /**
         * Generates a random integer in (min, max).
         * If min > max, a random number in (max, min) is generated.
         * If max is not given, a random number in (0, min) is generated.
         *
         * @param min Lower boundary, or upper if max is not given.
         * @param max Upper boundary.
         * @returns {number} Random integer in (min, max) if min < max, otherwise a random integer in (max, min). If max
         * is not specified, random integer in (0, min) if min > 0, otherwise in (min, 0).
         */
        int: function (min, max) {
            if (arguments.length == 1)
                return Math.floor(this.float(min));
            else
                return Math.floor(this.float(min, max));
        },

        /**
         * Selects a random element from an array.
         *
         * @param values Array of values.
         * @returns {object} Random element if k is not given or less than 2, an array of random elements otherwise.
         */
        choice: function(values, k) {
            if (arguments.length == 1 || k === null || k === undefined || k < 2)
                return this._choice(values);
            else {
                var elems = [];
                for (var i=0; i<k; i++) {
                    elems.push(this._choice(values));
                }
                return elems;
            }
        },

        /**
         * Samples some random characters of a string.
         *
         * @param string String to select character from.
         * @param k Number of characters to sample.
         * @returns {object} Random character if k is not given or less than 2, an array of random characters otherwise.
         */
        char: function(string, k) {
            if (arguments.length == 1 || k === null || k === undefined || k < 2)
                return this._char(string);
            else {
                var chars = [];
                for (var i=0; i<k; i++) {
                    chars.push(this._char(string));
                }
                return chars;
            }
        }
    },

    /**
     * Generators of CSS related entities.
     */
    css: {
        /**
         * Returns a <number> content type:
         * integer | [+-]? [0-9]* "." [0-9]+
         *
         * @returns {number} Intensity value.
         */
        // TODO unit test
        number: function() {
            return this.float();
        }
    },

    /**
     * Generators of SVG related entities.
     */
    svg: {
        /**
         * Returns a random <integer> content type.
         *
         * @returns {string} Random integer.
         */
        integer: function() {
            // FIXME Should be between -2147483648 and 2147483647
            return (pick.core.char("+- ") + pick.core.int(10)).trim();
        },

        /**
         * Returns a random <number> content type:
         *
         * @returns {string} Random number.
         */
        number: function() {
            if (Math.random() < 0.5) {
                return this.integer()
                    + (Math.random() < 0.5 ? pick.core.char("Ee") + this.integer() : "");
            } else {
                return (pick.core.char(" +-")
                    + (Math.random() < 0.5 ? pick.core.int(100) : "")
                    + "."
                    + pick.core.int(100)
                    + (Math.random() < 0.5 ? pick.core.char("Ee") + this.integer() : "")).trim();
            }
        },

        /**
         * Returns a random <length> content type.
         *
         * @param positive Whether to generate strictly positive length.
         * @returns {string} Random length.
         */
        length: function(positive) {
            var length = this.number() + pick.core.choice(["em", "ex", "px", "in", "cm", "mm", "pt", "pc", "%"]);
            return (positive && length.charAt(0) == "-") ? length.replace("-", "") : length;
        },

        /**
         * Returns a random <coordinate> content type.
         *
         * @returns {string} Random coordinate.
         */
        coordinate: function() {
            return this.length();
        },

        // TODO unit test
        color: function() {
            if (Math.random() < 0.333) {
                return "rgb(" + this.int(255) + "," + this.int(255) + "," + this.int(255) + ")";
            } else if (Math.random() < 0.5)
                return "rgba(" + this.int(255) + "," + this.int(255) + "," + this.int(255) + "," + this.float(1.0) + ")";
            else
                return "#" + Math.floor(Math.random()*16777215).toString(16);
        },

        // TODO unit test
        opacityValue: function() {

        },

        // TODO unit test
        transformList: function() {

        },

        // TODO unit test
        point: function() {

        },

        // TODO unit test
        movement: function() {

        },

        // TODO unit test
        listOfT: function(t) {

        },
    }
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports = pick;