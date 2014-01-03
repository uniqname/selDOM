selDOM
======

SelDOM is a drop-in replacement for a subset of jQuery's DOM manipulation methods. The methods chosen are the ones I personally have found to be the most useful and simpliest to implement. This allows the library to be terse and fast.

API
======

*selDOM*
--------
	
Selects all nodes that match the given CSS selector string

	var $matchedSet = selDOM(selector);

Generates HTML nodes from an HTML string passed in as `content`

	var $content = selDOM(content);

*addClass*
---------
Add the specified class(es) to each element in the matched set if it does not already exist. Classes can be specified as an array of classNames, a space separated string of classNames or mixed.

	$matchedSet.addClass('className'[, 'className2'[..., 'classNameN']]);
	$matchedSet.addClass('className className2' ['className3[,... classNameN]]);

*after*
--------
Inserts the value of `content` directly after each item in the matched set

	$matchedSet.after(content|selector);

*append*
--------

Appends the `content` passed to the method to each element in the matched set.
	
	$MatchedSet.append(content|selector);


*appendTo*
--------

Appends the elements in the matched set into the elements matched by `selector`
	
	$matchedSet.appendTo(selector)

Appends the `content` generated or selected by the `selDOM` method into the elements matched by `selector`

	$content.appendTo(selector)

*attr*
-----
Returns the value of the given attribute from the first element in the matched set.

	$matchedSet.atr(attrName);

Set the value of the given attribute on each of the elements in the matched set.

	$matchedSet.atr(attrName, attrValue);


Set the value of the given attributes on each of the elements in the matched set.

	$matchedSet.atr({
		attrName1: attrValue1,
		attrName2: attrValue2,
		attrNameN: attrValueN
	});

*before*
--------
Inserts the value of `content` directly before each item in the matched set

	$matchedSet.before(content)

*hasClass*
--------
Returns true if any of the element in the matched set contain the designated class.

	$matchedSet.hasClass('className')

*each*
----
executes `fn` for every item in the matched set passing it the index of the item within the set and the element itself. The item is also set as `this` within the context of `fn`
	
	$matchedSet.each(fn)

	//example
	$matchedSet.each(function (index, elem) {
		return this === elem;	// true
	});

*find*
-----
Finds all elements that match the selector that are children of the matched set

	$matchedSet.find(selector)

*removeClass*
---------
Removes the specified class(es) on each element in the matched set if they exist. Classes can be specified as an array of classNames, a space separated string of classNames or mixed.

	$matchedSet.removeClass('className'[, 'className2'[..., 'classNameN']]);
	$matchedSet.removeClass('className className2' ['className3[,... classNameN]]);

*toggleClass*
---------
Toggles the specified class(es) on each element in the matched set. Classes can be specified as an array of classNames, a space separated string of classNames or mixed.

	$matchedSet.toggleClass('className'[, 'className2'[..., 'classNameN']]);
	$matchedSet.toggleClass('className className2' ['className3[,... classNameN]]);