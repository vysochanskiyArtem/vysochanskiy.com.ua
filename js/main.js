;(function() {
	var externalCircle = document.querySelector('.main__external-circle'),
		internalCircle = document.querySelector('.main__internal-circle'),
		mainContainer = document.querySelector('.main'),
		navIcon = document.querySelector('.main__nav-icon'),
		navList = document.querySelector('.main__nav-list'),
		navLinks = document.querySelectorAll('.nav-list__item__link'),
		svgSign = document.getElementById('svg-sign'),
		contentContainer = document.querySelector('.content'),
		angle = 0,
		duration = 0.3,
		indexPageTitle = 'Vysochanskiy Artem',
		timerId;

	// events listeners
	if(document.title == indexPageTitle) {
		mainContainer.addEventListener('mousemove', manageShadows);
		window.addEventListener('load', appeareCircles);
	} else {
		window.addEventListener('load', showContent);
		window.addEventListener('load', showNavIcon);
		window.addEventListener('load', setListenerOnWorksItem);
	}

	navIcon.addEventListener('click', toggleNavIcon);
	navList.addEventListener('mouseover', hoverNavLink);

	for(var i = 0; i < navLinks.length; i++) {
		navLinks[i].addEventListener('click', changePage);
	}

	// listening history navigation
	window.onpopstate = manageBrowserHistory;

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
	function manageBrowserHistory() {
		if(location.pathname != '/') {
			var url = 'short_pages' + location.pathname;
		} else {
			var url = location.pathname;
		}

		clearPlaceForContent();
		hideContent();

		var xhr = new XMLHttpRequest();

		if(url == '/') {
			changePageOnIndex();
			setTimeout(appeareCircles, 10);

			return;
		}

		xhr.onload = function() {
			setTimeout(function() {
				contentContainer.innerHTML = xhr.responseText;
				setListenerOnWorksItem();
				clearExcessListeners();
			}, 1000);

			showContent();
			document.title = history.state.title;
		};

		xhr.open('POST', url, true);
        xhr.send();
	}

	function hideContent() {
		contentContainer.classList.remove('content_shown');
		contentContainer.hidden = true;
	}

	function showDemoLabel() {
		var label = this.parentElement.nextElementSibling;
		label.style.bottom = '-15px';
	}

	function hideDemoLabel() {
		var label = this.parentElement.nextElementSibling;
		label.style.bottom = '';
	}

	function setListenerOnWorksItem() {
		var workItemLinks = document.querySelectorAll('.content__works__item__overlay__link');

		if(workItemLinks[0]) {
			for(var i = 0; i < workItemLinks.length; i++) {
				workItemLinks[i].addEventListener('mouseover', showDemoLabel);
				workItemLinks[i].addEventListener('mouseout', hideDemoLabel);
			}
		}
	}

	function showContent() {
		setTimeout(function() {
			contentContainer.hidden = false;

			setTimeout(function() {
				contentContainer.classList.add('content_shown');
			}, 100);
		}, 1000);
	}

	function changeUrl(link) {
		var ndx = link.pathname.lastIndexOf('/'),
			pageName = '';

		if(ndx != -1) {
			pageName = link.pathname.slice(ndx+1);
		} else {
			pageName = link.pathname;
		}

		if(pageName == '') {
			pageName = '/';
		}

		history.pushState({title: document.title}, '', pageName);
	}

	function clearExcessListeners() {
		mainContainer.removeEventListener('mousemove', manageShadows);
		window.onload = showNavIcon;
	}

	function clearPlaceForContent() {
		externalCircle.classList.add('main__external-circle_hidden');
		externalCircle.children[0].classList.add('main__internal-circle_hidden');

		timerId = setTimeout(function() {
			externalCircle.style.display = 'none';
		}, 1000);

		svgSign.classList.add('main__assign_header');
		navIcon.classList.add('main__nav-icon_header');
	}

	function changePageOnIndex() {
		clearTimeout(timerId);
		externalCircle.style.display = '';
		mainContainer.addEventListener('mousemove', manageShadows);

		svgSign.classList.remove('main__assign_header');
		navIcon.classList.remove('main__nav-icon_header');

		document.title = indexPageTitle;
	}

	function changePage(event) {
		event.preventDefault();
		clearPlaceForContent();
		toggleNavIcon();
		hideContent();

		var xhr = new XMLHttpRequest(),
			self = this,
			url = self.href;

		if(self.pathname == '/') {
			changePageOnIndex();
			changeUrl(self);
			setTimeout(appeareCircles, 10);

			return;
		}

		xhr.onload = function() {
			setTimeout(function() {
				contentContainer.innerHTML = xhr.responseText;
				setListenerOnWorksItem();
				clearExcessListeners();
			}, 1000);

			showContent();
			document.title = self.title;
			changeUrl(self);
		};

		xhr.open('POST', url, true);
        xhr.send();
	}

	function resetDuration() {
		duration = 0.3;
	}

	function showNavLinks() {
		for(var i = 0; i < navLinks.length; i++) {
			navLinks[i].classList.toggle('nav-list__item__link_transitioned');
			navLinks[i].style.transition = 'color .2s ease-in, opacity ' + duration + 's ease-in .7s, left ' + duration + 's ease-in .7s';
			duration += 0.3;
		}

		if(i == navLinks.length) {
			resetDuration();
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