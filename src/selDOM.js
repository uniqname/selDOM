;
(function(doc, win, undefined) {
    'use strict';

    var selDOM, arr, makeArray, deDup, htmlToNodes, isHTMLstr, proto, indexOfNode, injectContent;

    arr = Array.prototype;
    makeArray = function(list) {
        return arr.slice.call(list);
    };

    deDup = function(arr) {
        var deDupped = selDOM(),
            _i, _ilen, _iref;
        for (_i = 0, _ilen = arr.length; _i < _ilen; _i++) {
            _iref = arr[_i];
            if (deDupped.indexOf(_iref) === -1) {
                deDupped.push(_iref);
            }
        }
        return deDupped;
    };

    isHTMLstr = function(str) {
        return !!str.match(/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/);
    };
    htmlToNodes = function(htmlStr) {
        var frag = doc.createDocumentFragment(),
            temp = frag.appendChild(doc.createElement('div'));

        temp.innerHTML = htmlStr;
        return temp.childNodes;
    };
    indexOfNode = function(el) {
        var parent = el.parentNode,
            children = makeArray(parent.children);
        return children.indexOf(el);
    };

    injectContent = function(content, method) {
        var clone = this.length - 1; // Don't clone node if there's only one in the set, just move it.
        content = selDOM(content); // format the content
        this.each(function(i, el) {
            var parent, childIdx, lastChildIdx;

            if (method === 'after') {
                parent = el.parentNode;
                childIdx = indexOfNode(el);
                lastChildIdx = parent.childElementCount - 1;
            }
            content.each(function(j, item) {
                var node = clone ? item.cloneNode(true) : item;
                if (method === 'prepend') {
                    el.insertBefore(node, el.firstChild);
                } else if (method === 'append') {
                    el.appendChild(node);
                } else if (method === 'before') {
                    el.parentNode.insertBefore(node, el);
                } else if (method === 'after') {
                    if (childIdx === lastChildIdx) {
                        el.appendChild(node);
                    } else {
                        parent.insertBefore(node, parent.children[++childIdx]);
                    }
                }
            }, (method === 'prepend'));
        });
        return content;
    };

    selDOM = function(selector, context) {
        return new proto.init(selector, context);
    };
    selDOM.isPlainObject = function(obj) {
        // Ripped from jQuery source (http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.js)
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (typeof obj !== "object" || obj.nodeType || obj.window === win) {
            return false;
        }

        // Support: Firefox <20
        // The try/catch suppresses exceptions thrown when attempting to access
        // the "constructor" property of certain host objects, ie. |window.location|
        // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        try {
            if (obj.constructor && !Object.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    };

    selDOM.version = '0.0.1';

    proto = selDOM.prototype = [];
    proto.constructor = selDOM;
    proto.init = function(selector, context) {
        var selF = this;

        // empty case
        if (!selector && !context) {
            return selF;
        }

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
                throw new TypeError('`context` must be a selector string or selDOM object');
            }
        }

        //selector checking

        // If no selector, return empty selDOM object
        if (!selector) {
            // return selF; // No-op;
        } else if (selector === doc || selector === win || selector.nodeType) {
            selF.push(selector);
        } else if (typeof selector === 'string') {
            if (isHTMLstr(selector)) {
                selF.push.apply(selF, makeArray(htmlToNodes(selector)));
            } else {
                context.each(function(idx, el) {
                    selF.push.apply(selF, makeArray(el.querySelectorAll(selector)));
                });
            }

        } else if (selector instanceof selDOM) {
            if (context.length === 1 && context[0] === doc) {
                selF.push.apply(selF, selector);
            } else {
                context.each(function(ctx_i, ctx_el) {
                    var $ctx_el = selDOM(ctx_el);
                    selF.push.apply(selF, $ctx_el.find(selector));
                });
            }
        } else if (Array.isArray(selector)) {
            selF.splice(0, 0, selector);
        }
        return selF;
    };

    proto.find = function(selector) {
        var found = selDOM(),
            el;
        this.each(function(i, el) {
            var $items = (selector instanceof selDOM) ? selector : selDOM(selector);
            $items.each(function(idx, item) {
                //https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition
                if (el.compareDocumentPosition(item) & (Node.DOCUMENT_POSITION_CONTAINED_BY + Node.DOCUMENT_POSITION_FOLLOWING)) {
                    found.push.call(found, item);
                }
            });
        });

        return deDup(found);
    };
    proto.each = function(fn, reverse) {
        var _i, _len, _ref;
        if (reverse) {
            for (_i = this.length - 1; _i >= 0; _i--) {
                _ref = this[_i];
                fn.call(_ref, _i, _ref);
            }
        } else {
            for (_i = 0, _len = this.length; _i < _len; _i++) {
                _ref = this[_i];
                fn.call(_ref, _i, _ref);
            }
        }
        return this;
    };

    proto.addClass = function() {
        //Flatten nested arrays and normalize space delimited class lists
        var args = arr.slice.call(arguments, 0).toString().split(/[\s,]/);
        this.each(function(i, el) {
            el.classList.add.apply(el.classList, args);
        });
        return this;
    };
    proto.toggleClass = function() {
        //Flatten nested arrays and normalize space delimited class lists
        var args = arr.slice.call(arguments, 0).toString().split(/[\s,]/);
        this.each(function(i, el) {
            el.classList.toggle.apply(el.classList, args);
        });
        return this;
    };
    proto.removeClass = function() {
        //Flatten nested arrays and normalize space delimited class lists
        var args = arr.slice.call(arguments, 0).toString().split(/[\s,]/);
        this.each(function(i, el) {
            el.classList.remove.apply(el.classList, args);
        });
        return this;
    };
    proto.hasClass = function(className) {
        var hasClass = false;
        this.each(function(i, el) {
            if (el.classList.contains(className)) {
                hasClass = true;
            }
        });
        return hasClass;
    };
    proto.empty = function() {
        this.each(function(i, el) {
            el.innerHTML = '';
        });

    };
    proto.html = function(content) {
        var asHTMLStr = function(i, el) {
            el.innerHTML = content;
        },
            asFunction = function(i, el) {
                oldHTML = this.innerHTML;
                this.innerHTML = '';
                this.innerHTML = content.call(el, i, oldHTML);
            },
            oldHTML;
        if (content) {
            if (typeof content === 'string') {
                this.each(asHTMLStr);
            } else if (typeof content === 'function') {
                this.each(asFunction);
            } else {
                throw new TypeError('The first argument in the `html` method must be an HTML string or a function');
            }
            return this;
        } else {
            return this[0].innerHTML;
        }
    };
    proto.text = function(content) {
        var asTextStr = function(i, el) {
            el.innerText = content;
        },
            asFunction = function(i, el) {
                oldText = this.innerText;
                this.innerText = '';
                this.innerText = content.call(el, i, oldText);
            },
            oldText;
        if (!this.length) {
            return this;
        }
        if (content) {
            if (typeof content === 'string') {
                this.each(asTextStr);
            } else if (typeof content === 'function') {
                this.each(asFunction);
            } else {
                throw new TypeError('The first argument in the `text` method must be a text string or a function');
            }
            return this;
        } else {
            return this[0].innerText;
        }
    };
    proto.attr = function(attrName, attrValue) {
        var method = 'getAttribute',
            setAttr = function(i, el) {
                el.setAttribute(attr, attrName[attr]);
            },
            val;
        if (selDOM.isPlainObject(attrName)) {
            for (var attr in attrName) {
                if (attrName.hasOwnProperty(attr)) {
                    this.each(setAttr);
                }
            }
            return this;
        } else if (typeof attrName === 'string') {
            if (typeof attrValue === 'string') {
                this.each(function(i, el) {
                    el.setAttribute(attrName, attrValue);
                });
            } else if (attrValue === undefined) {
                val = this[0].getAttribute(attrName);
            }
            return (val === undefined) ? this : val;
        } else {
            throw new TypeError('The first argument of `attr` must be a propery name as a string or an object representing a hash of attribute:value pairs.');
        }
    };
    proto.removeAttr = function(attrName) {
        this.each(function(i, el) {
            el.removeAttribute(attrName);
        });
    };
    proto.remove = function(selector) {
        var $items = selDOM(selector, this);
        $items.each(function(i, el) {
            el.parentNode.removeChild(el);
        });
        return $items;
    };
    proto.prepend = function(content) {
        return injectContent.call(this, content, 'prepend');
    };
    proto.append = function(content) {
        return injectContent.call(this, content, 'append');
    };
    proto.prependTo = function(target) {
        target = (typeof target === 'string') ? selDOM(target) : target;
        if (target instanceof selDOM) {
            injectContent.call(target, this, 'prepend');
            return this;
        } else {
            throw new TypeError('The `target` parameter of the prependTo method must be a selector or selDOM object');
        }
    };
    proto.appendTo = function(target) {
        target = (typeof target === 'string') ? selDOM(target) : target;

        if (target instanceof selDOM) {
            injectContent.call(target, this, 'append');
            return this;
        } else {
            throw new TypeError('The `target` parameter of the appendTo method must be selector or selDOM object');
        }
    };
    proto.after = function(content) {
        injectContent.call(this, content, 'after');
        return this;
    };
    proto.before = function(content) {
        injectContent.call(this, content, 'before');
        return this;
    };
    proto.insertAfter = function(target) {
        target = (typeof target === 'string') ? selDOM(target) : target;

        if (target instanceof selDOM) {
            injectContent.call(target, this, 'after');
            return this;
        } else {
            throw new TypeError('The `target` parameter of the insertAfter method must be selector or selDOM object');
        }
    };
    proto.insertBefore = function(target) {
        target = (typeof target === 'string') ? selDOM(target) : target;

        if (target instanceof selDOM) {
            injectContent.call(target, this, 'before');
            return this;
        } else {
            throw new TypeError('The `target` parameter of the insertBefore method must be selector or selDOM object');
        }
    };
    proto.prop = function(propName, propValue) {
        var propNames,
            setProp = function(i, el) {
                el[prop] = propName[prop];
            };
        if (selDOM.isPlainObject(propName)) {
            for (var prop in propName) {
                if (propName.hasOwnProperty(prop)) {
                    this.each(setProp);
                }
            }
            return this;
        } else if (typeof propName === 'string') {
            if (propValue && typeof propValue === 'string') {
                this.each(function(i, el) {
                    el[propName] = propValue;
                });
                return this;
            } else if (propValue === undefined) {
                return this[0][propName];
            }
        } else {
            throw new TypeError('The first argument of `prop` must be a propery name as a string or an object representing a hash of property:value pairs.');
        }
    };
    proto.removeProp = function(propName) {
        this.each(function(i, el) {
            delete el[propName];
        });
        return this;
    };
    proto.init.prototype = proto;
    window.selDOM = selDOM;
})(document, window);