;(function() {
	var externalCircle = document.querySelector('.main__external-circle'),
			internalCircle = document.querySelector('.main__internal-circle'),
			mainContainer = document.querySelector('.main'),
			navIcon = document.querySelector('.main__nav-icon'),
			navList = document.querySelector('.main__nav-list'),
			navLinks = document.querySelectorAll('.nav-list__item__link'),
			svgSign = document.getElementById('svg-sign'),
			angle = 0,
			transitionTime = 0.3;

	// events listeners
	mainContainer.addEventListener('mousemove', manageShadows);
	navIcon.addEventListener('click', toggleNavIcon);
	navList.addEventListener('mouseover', hoverNavLink);
	window.onload = appeareCircles;

	// start svg animation
	var vivus = new Vivus('svg-sign', {duration: 100}, function() {
		var paths = svgSign.children;

		for(var i = 0; i < paths.length; i++) {
			paths[i].style.fill = 'black';
		}
	});
	svgSign.addEventListener('click', function(e) {
		vivus.reset();
		vivus.play();
	});


	// functions
	function resetTransitionTime() {
		transitionTime = 0.3;
	}

	function showNavLinks() {
		for(var i = 0; i < navLinks.length; i++) {
			navLinks[i].classList.toggle('nav-list__item__link_transitioned');
			navLinks[i].style.transition = 'color .2s ease-in, opacity ' + transitionTime + 's ease-in .7s, left ' + transitionTime + 's ease-in .7s';
			transitionTime += 0.3;
		}

		if(i == navLinks.length) {
			resetTransitionTime();
		}
	}

	function hoverNavLink(event) {
		var target = event.target;

		for(var i = 0; i < navLinks.length; i++) {
			if(navLinks[i] === target) {
				navLinks[i].classList.remove('nav-list__item__link_gray');
			} else {
				navLinks[i].classList.add('nav-list__item__link_gray');
			}

			if(target.tagName != 'A') {
				navLinks[i].classList.remove('nav-list__item__link_gray');
			}
		}
	}

	function toggleNavList() {
		navList.classList.toggle('main__nav-list_hidden');
	}

	function showNavIcon() {
		navIcon.classList.remove('main__nav-icon_hidden');
	}

	function toggleNavIcon() {
		navIcon.classList.toggle('main__nav-icon_active');
		toggleNavList();
		showNavLinks();
	}

	function appeareCircles(event) {
		externalCircle.classList.remove('main__external-circle_hidden');
		externalCircle.children[0].classList.remove('main__internal-circle_hidden');

		showNavIcon();

		// var pointer = document.querySelector('.main__pointer');
		// pointer.classList.remove('main__pointer_hidden');
	}

	function manageShadows(event) {
		var centerX = mainContainer.clientWidth / 2,
			centerY = mainContainer.clientHeight / 2;

		if(event.clientX > centerX && event.clientY < centerY) {
			var rectSizeB = event.clientX - centerX,
				rectSizeA = centerY - event.clientY;
		} else if(event.clientX > centerX && event.clientY > centerY) {
			var rectSizeB = event.clientX - centerX,
				rectSizeA = event.clientY - centerY;
		} else if(event.clientX < centerX && event.clientY > centerY) {
			var rectSizeB = centerX - event.clientX,
				rectSizeA = event.clientY - centerY;
		} else if(event.clientX < centerX && event.clientY < centerY) {
			var rectSizeB = centerX - event.clientX,
				rectSizeA = centerY - event.clientY;
		}

		var hipotenuse = Math.sqrt( Math.pow(rectSizeA, 2) + Math.pow(rectSizeB, 2) );
			angle = Math.sin(rectSizeA / hipotenuse) * 53 * 2;
			angle = Math.floor(angle);

		if(event.clientX > centerX && event.clientY < centerY) {
			angle = 360 - angle;
		} else if(event.clientX < centerX && event.clientY > centerY) {
			angle = 180 - angle;
		} else if(event.clientX < centerX && event.clientY < centerY) {
			angle = 180 + angle;
		}

		externalCircle.style.transform = 'rotate(' + angle + 'deg)';
		setTimeout(function() {
			externalCircle.classList.remove('circle_transitioned');
		}, 300);
	}
}) ();