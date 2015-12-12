/*
	SPLIT IMAGE COMPARISION - ADVANCED
	
	The split image mechanism works by having two overlapping, absolutely
	positioned figures.  The width of the top figure is controlled by the mouse
	position on the screen.  The figures are styled so that they act as
	clipping masks for their images (i.e. overflow:hidden).  So when the top
	figure's width is 40%, 60% of the bottom figure is visible.

	This mobile-friendly demo shows an advanced version of the split image
	comparision.  This version allows you to place a split image container
	anywhere on a page and at any size (within reason).  The images within the
	container are then scaled down to fit & centered, while preserving aspect
	ratio.

	Requirements:
		- No plugins necessary 
		- Only works on modern browsers.
*/

// Wait until all images are loaded before starting up the split image 
// comparison.  The scaling & centering of images will break because they need
// for the browser to have the width & height of the image. 
(function () {
	var images = document.querySelectorAll(".split-image-container img");
	var numLoaded = 0;
	for (var i = 0; i < images.length; i += 1) {
		images[i].addEventListener("load", function () {
			numLoaded += 1;
			if (numLoaded === images.length) initSplitComparision();
		}, false);
	}
}());

function initSplitComparision() {
	// Get & cache DOM elements 
	var container = document.querySelector(".split-image-container");
	var images = container.querySelectorAll("img");
	var leftFigure = container.querySelector(".left-figure");
	var divider = container.querySelector(".divider");

	// Scale & center the images to fit the container
	function fitImages() {
		var bbox = container.getBoundingClientRect(); // screen pos of container
		function fitImage(img) {	
			// Get the original size of the image
			var w = img.naturalWidth;
			var h = img.naturalHeight;
			// Find the scale factor that contains the image without overflow
			var scale = Math.min(bbox.width / w, bbox.height / h);
			// Scale the image down 
			var newWidth, newHeight;
			img.width = newWidth = scale * w;
			img.height = newHeight = scale * h;
			// Center the image within the container using margins
			img.style.marginTop = (bbox.height - newHeight) / 2 + "px";
			img.style.marginLeft = (bbox.width - newWidth) / 2 + "px";
		}
		fitImage(images[0]);
		fitImage(images[1]);
	}
	fitImages();

	// Use mouse position to change the width of the left image so that it 
	// reveals the image behind it
	container.addEventListener("mousemove", function (e) {
		var bbox = container.getBoundingClientRect(); // screen pos of container
		var x = e.clientX - bbox.left; // x pos within the container
		var percent = x / bbox.width * 100;
		divider.style.left = percent + "%";
		leftFigure.style.width = percent + "%";
	}, false);

	// Use touch to mirror the functionality of the mousemove
	container.addEventListener("touchmove", function (e) {
		e.preventDefault(); // prevent event from also triggering mouse events
		var bbox = container.getBoundingClientRect(); // screen pos of container
		var x = e.changedTouches[0].clientX - bbox.left; // x pos within the container
		var percent = x / bbox.width * 100;
		// Touches can move beyond the container, so cap the percent at 0 & 100
		percent = Math.min(percent, 100);
		percent = Math.max(percent, 0);
		divider.style.left = percent + "%";
		leftFigure.style.width = percent + "%";
	}, false);

	// If the browser is resized, recalculate the image size & positions
	window.addEventListener("resize", function (e) {
		fitImages();
	}, false);
}