/* AFENET theme initialiser.
 * Adapted from the Builtup theme's function.js so the animations work with
 * Next.js client-side navigation: AfenetTheme.init() runs after every page change. */
(function ($) {
	"use strict";

	var firstRun = true;

	function killAnimations() {
		if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
		if (window.Waypoint) Waypoint.destroyAll();
	}

	function counters() {
		if ($('.counter').length) {
			$('.counter').counterUp({ delay: 6, time: 3000 });
		}
	}

	function imageReveal() {
		document.querySelectorAll(".reveal").forEach(function (container) {
			var image = container.querySelector("img");
			var tl = gsap.timeline({
				scrollTrigger: { trigger: container, toggleActions: "play none none none" }
			});
			tl.set(container, { autoAlpha: 1 });
			tl.from(container, 1, { xPercent: -100, ease: Power2.out });
			tl.from(image, 1, { xPercent: 100, scale: 1, delay: -1, ease: Power2.out });
		});
	}

	function textAnimation() {
		document.querySelectorAll('.text-anime-style-3').forEach(function (element) {
			if (element.animation) {
				element.animation.progress(1).kill();
				element.split.revert();
			}
			element.split = new SplitText(element, { type: "lines,words,chars", linesClass: "split-line" });
			gsap.set(element, { perspective: 400 });
			gsap.set(element.split.chars, { opacity: 0, x: "50" });
			element.animation = gsap.to(element.split.chars, {
				scrollTrigger: { trigger: element, start: "top 90%" },
				x: "0", y: "0", rotateX: "0", opacity: 1,
				duration: 1, ease: Back.easeOut, stagger: 0.02
			});
		});
	}

	function parallax() {
		var $parallaxie = $('.parallaxie');
		if ($parallaxie.length && $(window).width() > 991) {
			$parallaxie.parallaxie({ speed: 0.55, offset: 0 });
		}
	}

	function popups() {
		if ($('.popup-video').length) {
			$('.popup-video').magnificPopup({
				type: 'iframe', mainClass: 'mfp-fade', removalDelay: 160,
				preloader: false, fixedContentPos: true
			});
		}
	}

	function init() {
		killAnimations();
		gsap.registerPlugin(ScrollTrigger);

		if (firstRun) {
			firstRun = false;
			$(".preloader").fadeOut(600);
			// live: true makes WOW pick up elements added by later page navigations
			new WOW({ live: true }).init();
		}

		counters();
		imageReveal();
		textAnimation();
		parallax();
		popups();
		ScrollTrigger.refresh();
	}

	window.AfenetTheme = { init: init };
})(jQuery);
