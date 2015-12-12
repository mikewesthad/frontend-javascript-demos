/*
	
	DRAG AND DROP - BASIC

	A drag event is simply a combination of a couple mouse events:
		drag = mousedown + mousemove + mouseup
	OR a couple of touch events:
		drag = touchstart + touchmove + touchend

	In the HTML, an element is flagged as draggable by adding a data attribute -
	"data-draggable".  All draggable items are placed in the #drag-items div so
	that we can use make use of the event delegation pattern.  The drop zone is
	a div with the id "drop-zone".

	This advanced version improves on the basic version:
		- It is mobile-friendly.  This means that mouse events and touch events
		  have to be handled.  Touch events also then prevent default behavior,
		  because touch devices will also try to emulate mouse events by 
		  default.
		- The draggable area is defined by the #drag-area div.  Draggable items
		  cannot leave this area.  This allows for the drag-area to be placed
		  anywhere on the page and be self-contained.

	Requirements:
		- No plugins necessary 
		- Only works on modern browsers.

*/

(function () {
	// Get & cache DOM elements 
	var dragArea = document.getElementById("drag-area");
	var dragItems = document.getElementById("drag-items");
	var dropZone = document.getElementById("drop-zone");

	// Global variables for tracking the element that is currently being 
	// dragged by a MOUSE.  Touch events do not need this.
	var dragElement = null;
	// Tracking z-index, so that the currently dragged element can sit on top
	// of all other draggable elements.  Both mouse and touch use this.
	var dragZIndex = 0; 


	// Mouse Event Handlers for Dragging
	// ---------------------------------

	// DRAG START
	// Desktop - if a draggable element is clicked, start tracking this element
	// globally in dragElement.
	// Mobile - touch events fires on the original element that was dragged, so
	// we don't need to track a dragged element. 

	dragItems.addEventListener("mousedown", function (e) {
		if (isDraggable(e.target)) {	
			dragElement = e.target;
			dragStart(e.target, e.clientX, e.clientY);
		}
	}, false);

	dragItems.addEventListener("touchstart", function (e) {
		e.preventDefault(); // Prevent mouse events from also happening
		var touch = e.targetTouches[0]; // First touch on target
		if (isDraggable(touch.target)) {	
			dragStart(touch.target, touch.clientX, touch.clientY);
		}
	}, false);

	function dragStart(target, clientX, clientY) {		
		// Get mouse position within the drag area
		var pos = getClientPositionWithin(clientX, clientY, dragArea);
		centerElementAt(target, pos.x, pos.y);
		// Bump selected element to the top of the page
		dragZIndex += 1; 
		target.style.zIndex = dragZIndex;
	}


	// DRAG CONTINUE 
	// Desktop - if event handler is attached to dragItems.onmousemove, we end
	// up with glitchy behavior when the mouse moves too quickly.

	window.addEventListener("mousemove", function (e) {
		e.preventDefault(); // Prevent default drag behavior
		if (dragElement) dragMove(dragElement, e.clientX, e.clientY);
	}, false);

	dragItems.addEventListener("touchmove", function (e) {
		e.preventDefault(); // Prevent mouse events from also happening
		var touch = e.targetTouches[0]; // First touch on target
		if (isDraggable(touch.target)) {	
			dragMove(touch.target, touch.clientX, touch.clientY);
		}
	}, false);

	function dragMove(target, clientX, clientY) {
		// Get mouse/touch position within the drag area
		var pos = getClientPositionWithin(clientX, clientY, dragArea);
		centerElementAt(target, pos.x, pos.y);
	}


	// DROP
	// Desktop - once the element is dropped, we must null the global variable
	// that is tracking the dragged element
	// Mobile - instead of using targetTouches, we need to use changedTouches

	window.addEventListener("mouseup", function (e) {
		e.preventDefault(); // Prevent default drag behavior
		if (dragElement) {
			drop(dragElement, e.clientX, e.clientY);
			dragElement = null;
		}
	}, false);

	dragItems.addEventListener("touchend", function (e) {
		e.preventDefault(); // Prevent mouse events from also happening
		var touch = e.changedTouches[0]; // First touch to change (e.g. removed)
		if (isDraggable(touch.target)) {	
			drop(touch.target, touch.clientX, touch.clientY);
		}
	}, false);

	function drop(target, clientX, clientY) {
		// Get mouse/touch position within the drag area
		var pos = getClientPositionWithin(clientX, clientY, dragArea);
		// Determine where to drop the dragged element
		var dropBbox = getElementBoundingRectWithin(dropZone, dragArea);
		if (isInsideRect(pos.x, pos.y, dropBbox)) {
			var center = getRectCenter(dropBbox);
			centerElementAt(target, center.x, center.y);
		}
		else {		
			centerElementAt(target, pos.x, pos.y);
		}
	}


	// Helper functions!
	// -----------------

	function isDraggable(element) {
		return element.dataset.draggable !== undefined;
	}

	function getClientPositionWithin(clientX, clientY, element) {
		var bbox = element.getBoundingClientRect(); // screen pos of container
		var x = clientX - bbox.left; // x pos within the container
		var y = clientY - bbox.top; // x pos within the container
		x = clampValue(x, 0, bbox.width);
		y = clampValue(y, 0, bbox.height);
		return {x: x, y: y};
	}

	function getElementBoundingRectWithin(element, containerElement) {
		var bbox = element.getBoundingClientRect();
		var containerBbox = containerElement.getBoundingClientRect();
		// ClientRects are read-only, so we need a new obj
		var relativeBbox = { width: bbox.width, height: bbox.height }; 
		relativeBbox.left = bbox.left - containerBbox.left;
		relativeBbox.right = bbox.right - containerBbox.left;
		relativeBbox.top = bbox.top - containerBbox.top;
		relativeBbox.bottom = bbox.bottom - containerBbox.top;
		return relativeBbox;
	}

	function clampValue(val, min, max) {
		val = Math.min(val, max);
		val = Math.max(val, min);
		return val;
	}

	function centerElementAt(element, x, y) {
		element.style.position = "absolute";
		element.style.top = y + "px";
		element.style.left = x + "px";
		element.style.transform = "translate(-50%, -50%)";
	}

	function getRectCenter(bbox) {
		var cx = bbox.left + bbox.width / 2;
		var cy = bbox.top + bbox.height / 2;
		return {x: cx, y: cy};
	}

	function isInsideRect(x, y, rect) {
		if (x <= rect.right && x >= rect.left && y <= rect.bottom && y >= rect.top) {
			return true;
		} 
		return false;
	}
}());