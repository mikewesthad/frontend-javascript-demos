/*
	SPLIT IMAGE COMPARISION - BASIC
	
	The split image mechanism works by having two overlapping, absolutely
	positioned figures.  The width of the top figure is controlled by the mouse
	position on the screen.  The figures are styled so that they act as
	clipping masks for their images (i.e. overflow:hidden).  So when the top
	figure's width is 40%, 60% of the bottom figure is visible.

	This demo shows a basic, full screen only version of this split image 
	comparision. 

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
	var divider = container.querySelector(".divider");
	var leftFigure = container.querySelector(".left-figure");
	var images = container.querySelectorAll("img");

	// Scale & center the images to fit the screen
	function fitImages() {
		function fitImage(img) {	
			// Get the original size of the image
			var w = img.naturalWidth;
			var h = img.naturalHeight;
			// Find the scale factor that contains the image without overflow
			var scale = Math.min(window.innerWidth / w, window.innerHeight / h);
			// Scale the image down 
			var newWidth, newHeight;
			img.width = newWidth = scale * w;
			img.height = newHeight = scale * h;
			// Center the image within the container using margins
			img.style.marginTop = (window.innerHeight - newHeight) / 2 + "px";
			img.style.marginLeft = (window.innerWidth - newWidth) / 2 + "px";
		}
		fitImage(images[0]);
		fitImage(images[1]);
	}
	fitImages();

	// Use mouse position to change the width of the left image so that it 
	// reveals the image behind it
	container.addEventListener("mousemove", function (e) {
		var x = e.clientX; // x pos of mouse within screen
		divider.style.left = x + "px";
		leftFigure.style.width = x + "px";
	}, false);
}