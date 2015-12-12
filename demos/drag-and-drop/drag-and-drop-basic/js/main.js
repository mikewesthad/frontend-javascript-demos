/*
	
	DRAG AND DROP - BASIC

	A drag event is simply a combination of a couple mouse events:
		drag = mousedown + mousemove + mouseup

	There *is* a mouse drag API, but it's support for mobile is not great at the 
	moment.  You can learn more about it here:
		http://www.w3schools.com/html/html5_draganddrop.asp

	To implement a draggable element, we need to:
		- on mousedown, define a currently dragged element and make it 
		  absolutely positioned 
		- on mousemove, set the current drag's top & left property to the mouse
		  position.
		- on mouseup, release the dragged element, and if it's within a 
		  specified drop zone, snap it to that zone. 

	In the HTML, an element is flagged as draggable by adding a data attribute -
	"data-draggable".  All draggable items are placed in the #drag-items div so
	that we can use make use of the event delegation pattern.  The drop zone is
	a div with the id "drop-zone".

	Requirements:
		- No plugins necessary 
		- Only works on modern browsers.

*/

(function () {
	// Get & cache DOM elements 
	var dragItems = document.getElementById("drag-items");
	var dropZone = document.getElementById("drop-zone");

	// Global variables for tracking the element that is currently being dragged
	var dragElement = null;
	// Tracking z-index, so that the currently dragged element can sit on top
	// of all other draggable elements 
	var dragZIndex = 0; 


	// Mouse Event Handlers for Dragging
	// ---------------------------------

	// Kick off the mouse drag if a draggable item is selected
	dragItems.addEventListener("mousedown", function (e) {
		var selectedElement = e.target;
		if (selectedElement.dataset.draggable !== undefined) {			
			dragElement = selectedElement;
			centerElementAt(selectedElement, e.pageX, e.pageY);
			// Bump selected element to the top of the page
			dragZIndex += 1; 
			dragElement.style.zIndex = dragZIndex;
		}
	}, false);

	// Continue the mouse drag.  If this event handler is attached to
	// dragItems.onmousemove, we end up with glitchy behavior when the mouse
	// moves too quickly.
	window.addEventListener("mousemove", function (e) {
		e.preventDefault(); // prevent default drag behavior
		if (dragElement) {		
			centerElementAt(dragElement, e.pageX, e.pageY);
		}
	}, false);

	// Finish the mouse drag
	dragItems.addEventListener("mouseup", function (e) {
		if (dragElement) {
			if (isInsideRect(e.pageX, e.pageY, dropZone)) {
				var center = getCenter(dropZone);
				centerElementAt(dragElement, center.x, center.y);
			}
			else {		
				centerElementAt(dragElement, e.pageX, e.pageY);
			}
			dragElement = null;
		}
	}, false);


	// Helper functions for positioning elements
	// -----------------------------------------

	function centerElementAt(element, x, y) {
		element.style.position = "absolute";
		element.style.top = y + "px";
		element.style.left = x + "px";
		element.style.transform = "translate(-50%, -50%)";
	}

	function getCenter(element) {
		var r = element.getBoundingClientRect();
		var cx = r.left + r.width / 2;
		var cy = r.top + r.height / 2;
		return {x: cx, y: cy};
	}

	function isInsideRect(x, y, element) {
		var r = element.getBoundingClientRect();
		if (x <= r.right && x >= r.left && y <= r.bottom && y >= r.top) {
			return true;
		} 
		return false;
	}
}());