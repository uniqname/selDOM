;(function (doc, win, undefined) {
    'use strict';

    var selDOM, arr, makeArray, deDup;
    
    arr = Array.prototype;
    makeArray = function (list) {
        return arr.slice.call(list);
    };

    deDup = function (arr) {
        var deDupped = selDOM(),
            _i, _ilen, _iref;
        for (_i =0, _ilen = arr.length; _i < _ilen; _i++) {
            _iref = arr[_i];
            if (deDupped.indexOf(_iref) === -1) {
                deDupped.push(_iref);
            }
        }
        return deDupped;
    };

    selDOM = function (selector, context) {
        return new selDOM.prototype.init(selector, context);
    };

    selDOM.prototype = [];
    selDOM.prototype.constructor = selDOM;
    selDOM.prototype.init = function (selector, context) {
        var collection, _i, _ilen, _iref, _j, _jlen, _jref, _jfound, found, that, selF;

        selF = this;

        // empty case
        if (!selector && !context) { return selF; }

        // root
        if (selector === doc && !context) {
            selF.push(doc);
            return selF;
        }

        // context checking
        if (!(context instanceof selDOM)) {
            if (!context) {
                context = selF.constructor(doc);
            } else if (typeof context === 'string') {
                context = selF.constructor(context);
            } else {
                new TypeError('`context` must be a selector string or selDOM object');
            }
        }

        //selector checking

        // If no selector, return empty selDOM object
        if (!selector) {
            return selF;
        } else if (selector === doc) {
            selF.push(doc);
        } else if (typeof selector === 'string') {
            that = selF;
            context.each(function (idx, el) {
                that.push.apply(that, makeArray(el.querySelectorAll(selector)));
            });

        } else if (selector instanceof selDOM) {
            that = selF;
            context.each(function (ctx_i, ctx_el) {
                that.push.apply(that, ctx_el.find(selector));
            });
        }
    };
 
    selDOM.prototype.find = function (selector) {
        var found = selDOM();
        this.each(function (i, el) {
            var $items = selDOM(selector);

            $items.each(function (idx, item) {
                //https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition
                if (el.compareDocumentPosition(item) & (Node.DOCUMENT_POSITION_CONTAINED_BY + Node.DOCUMENT_POSITION_FOLLOWING)) {
                    found.push.call(found, item);
                }
            });
        });

        return deDup(found);
    };
    selDOM.prototype.each = function (fn) {
        var _i, _len, _ref;
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            _ref = this[_i];
            fn.call(_ref, _i, _ref);
        }
        return this;
    };

    selDOM.prototype.addClass = function () {
        var args = arguments;
        this.each(function (i, el) {
            el.classList.add.apply(el.classList, args);
        });
        return this;
    };
    selDOM.prototype.toggleClass = function () {
        var args = arguments;
        this.each(function (i, el) {
            el.classList.toggle.apply(el.classList, args);
        });
        return this;
    };
    selDOM.prototype.removeClass = function () {
        var args = arguments;
        this.each(function (i, el) {
            el.classList.remove.apply(el.classList, args);
        });
        return this;
    };
    selDOM.prototype.hasClass = function (className) {
        var hasClass = false;
        this.each(function (i, el) {
            if (el.classList.contains(className)) {
                hasClass = true;
            };
        });
        return hasClass;
    };
    selDOM.prototype.empty = function () {
        this.each(function (i, el) {
            el.innerHTML = '';
        });

    };
    selDOM.prototype.html = function () {
        return this[0].innerHTML;
    };
    selDOM.prototype.text = function () {
        return this[0].innerText;
    };
    /*
    TODO: Mirrior jQuery's api for the following methods:
    after
    append
    attr
    before
    insertAfter
    insertBefore
    prepend
    prependTo
    prop
    remove
    removeAttr
    removeProp
    */

    selDOM.prototype.init.prototype = selDOM.prototype;

    window.selDOM = selDOM;
})(document, window);
