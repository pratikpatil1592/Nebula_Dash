/*
Theme Name: Cany
Description: Coming Soon
Author: Erilisdesign
Theme URI: http://erilisdesign.com/preview/themeforest/html/cany/
Author URI: http://themeforest.net/user/Erilisdesign
Version: 2.1.0
*/

(function($) {
	"use strict";

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('body').addClass('mobile');
	}

	function detectIE() {
		if (navigator.userAgent.indexOf('MSIE') != -1)
			var detectIEregexp = /MSIE (\d+\.\d+);/ //test for MSIE x.x
		else // if no "MSIE" string in userAgent
			var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ //test for rv:x.x or rv x.x where Trident string exists

		if (detectIEregexp.test(navigator.userAgent)){ //if some form of IE
			var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
			if (ieversion >= 9) {
				return true;
			}
		}
		return false;
	}

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	function getWindowHeight() {
		return Math.max( $(window).height(), window.innerHeight);
	}
	

	// Preloader
	function initPreloader() {
		var preloaderDelay = 350;
		var	preloaderFadeOutTime = 800;

		function hidePreloader() {
			var loadingAnimation = $('#loading-animation');
			var	preloader = $('#preloader');

			loadingAnimation.fadeOut();
			preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
		}

		hidePreloader();
	}
	
	
	// Animations
	function initAnimations() {
		if( !$('body').hasClass('mobile') ) {
			if( detectIE() ) {
				$('.animated').css({
					'display':'block',
					'visibility': 'visible'
				});
			} else {			
				// Starting Animation on Load
				$('.animated').each( function() {
					var elem = $(this);
					if ( !elem.hasClass('visible') ) {
						var animationDelay = elem.data('animation-delay');
						var animation = elem.data('animation');
						if ( animationDelay ) {
							setTimeout(function(){
								elem.addClass( animation + ' visible' );
							}, animationDelay);
						} else {
							elem.addClass( animation + ' visible' );
						}
					}
				});				
			}
		}
	}
	
	
	// Fullscreen Elements
	function fullscreenElements() {
		$('.fullscreen-element').each(function(){
			$(this).css('min-height', getWindowHeight());
		});
	}
	fullscreenElements();
	
	
	// Navigation
	function initLayoutLines() {
		$('.site-nav').each(function() {
			var menu = $(this).find('ul');
			var menuHeight = menu.innerHeight();
			
			menu.css('margin-top', -(menuHeight/2));
			$('.line.vertical.top').css('margin-bottom', menuHeight/2);
			$('.line.vertical.top').css('margin-bottom', menuHeight/2);
			$('.line.vertical.bottom').css('margin-top', menuHeight/2);
		});
		
		$('.socials-icons').each(function() {
			var socialIcons = $(this).find('ul');
			var socialIconsWidth = socialIcons.innerWidth() + 15;
			
			$('.line.horizontal.left').css('margin-right', socialIconsWidth);
		});
	}
		
	function initNavigation() {
		
		$('.site-nav a').tooltip({
			placement: 'left'
		});
		
		var section = $('section.on-menu');
		section.css({
			'opacity': '0',
			'visibility': 'hidden',
			'display': 'none'	
		});
		
		$('#home').css({
			'opacity': '1',
			'display': 'block',
			'visibility': 'visible'
		});
		
		// Move To Section
		$('a.move-to').on( 'click', function(e) {
			e.preventDefault();
			
			var elem = $(this);
			var currentSection = $(this).attr('href').substring(1);
			var section = $('section.on-menu');
			var customBackground = elem.data('section-background');
			
			$('.site-nav a').removeClass('active');
			$('.site-nav').find('[href="#'+ currentSection + '"]').addClass('active');
			
			section.animate({
				opacity: 0
			},{
				duration: 500,
				easing: 'easeOutQuad',
				queue: true,
				complete: function() {
					$(this).css({
						'visibility': 'hidden',
						'display': 'none'	
					});
					
					if( !$('body').hasClass('mobile') ) {
						if( detectIE() ) {
							$('.animated').css({
								'display': 'block',
								'visibility': 'visible'
							});
						} else {			
							// Remove Animations
							$('.animated').each( function() {
								var elem = $(this);
								var animation = elem.data('animation');
								if ( elem.hasClass('visible') ) {
									elem.removeClass( animation + ' visible' );
								}
							});
						}
					}
					
				}
			});
			
			$('#'+ currentSection + '').animate({
				opacity: 1
			},{
				duration: 700,
				easing: 'easeOutQuad',
				queue: true,
				start: function() {
					$(this).css({
						'display': 'block',
						'visibility': 'visible'
					});
					
					if(customBackground){
						$('.background-layer').removeClass (function (index, css) {
							return (css.match (/(^|\s)image\S+/g) || []).join(' ');
						});
						$('.background-layer').addClass(customBackground);
					}
					
					if( !$('body').hasClass('mobile') ) {
						if( detectIE() ) {
							$('.animated').css({
								'display': 'block',
								'visibility': 'visible'
							});
						} else {
							// Starting Animation on Load
							$('#'+ currentSection + '').find('.animated').each( function() {
								var elem = $(this);
								var animation = elem.data('animation');
								if ( !elem.hasClass('visible') ) {
									var animationDelay = elem.data('animation-delay');
									if ( animationDelay ) {
										setTimeout(function(){
											elem.addClass( animation + ' visible' );
										}, animationDelay);
									} else {
										setTimeout(function(){
											elem.addClass( animation + ' visible' );
										}, 0);
									}
								}
							});
						}
					}
					
				}
			});
		});

		// Keyboard Support
		$(document).keydown(function(e) {
			if(e.keyCode == 38 || e.keyCode == 39) { 
				e.preventDefault();
				$('.site-nav a.active').closest('li').next('li').find('a.move-to').trigger('click');			
			} else if(e.keyCode == 37 || e.keyCode == 40) { 
				e.preventDefault();
				$('.site-nav a.active').closest('li').prev('li').find('a.move-to').trigger('click');			
			}
		});
		
	}

	
	// Animated Gradient
	function animatedGradient() {
		var colors = new Array(
			[62,35,255],
			[60,255,60],
			[255,35,98],
			[45,175,230],
			[255,0,255],
			[255,128,0]);

		var step = 0;
		//color table indices for: 
		// current color left
		// next color left
		// current color right
		// next color right
		var colorIndices = [0,1,2,3];

		//transition speed
		var gradientSpeed = 0.002;

		function updateGradient() {
		  
			if ( $===undefined ) return;
		  
			var c0_0 = colors[colorIndices[0]];
			var c0_1 = colors[colorIndices[1]];
			var c1_0 = colors[colorIndices[2]];
			var c1_1 = colors[colorIndices[3]];

			var istep = 1 - step;
			var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
			var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
			var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
			var color1 = "rgb("+r1+","+g1+","+b1+")";

			var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
			var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
			var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
			var color2 = "rgb("+r2+","+g2+","+b2+")";

			$('#gradient')
				.css({background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"})
				.css({background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
			  
			step += gradientSpeed;
			if ( step >= 1 ) {
				step %= 1;
				colorIndices[0] = colorIndices[1];
				colorIndices[2] = colorIndices[3];
				
				//pick two new target color indices
				//do not pick the same as the current one
				colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
				colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
			}
		}
		setInterval(updateGradient,10);
	}
	
	
	// BACKGROUNDS
	function initPageBackground() {
		
		if($('body').hasClass('mobile')) {
			$('.video-wrapper, .player').css('display', 'none');	
		}
		
		// Slideshow Background
		if ($('body').hasClass('slideshow-background')) {
			$('body').vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-1.jpg' },
					{ src: 'demo/images/image-2.jpg' },
					{ src: 'demo/images/image-5.jpg' }
				]
			});
		}
		
		// Kenburns Background
		if ($('body').hasClass('kenburns-background')) {

			var kenburnsDisplayBackdrops = false;
			var kenburnsBackgrounds = [
				{ src: 'demo/images/image-5.jpg', valign: 'top' },
				{ src: 'demo/images/image-2.jpg', valign: 'top' },
				{ src: 'demo/images/image-1.jpg', valign: 'top' }
			];

			$('body').vegas({
				preload: true,
				transition: 'swirlLeft2',
				transitionDuration: 4000,
				timer: false,
				delay: 10000,
				slides: kenburnsBackgrounds,
				walk: function (nb) {
					if (kenburnsDisplayBackdrops === true) {
						var backdrop;

						backdrop = backdrops[nb];
						backdrop.animation  = 'kenburns';
						backdrop.animationDuration = 20000;
						backdrop.transition = 'fade';
						backdrop.transitionDuration = 1000;

						body
							.vegas('options', 'slides', [ backdrop ])
							.vegas('next');
					}
				}
			});
		}
		
		if($('body').hasClass('youtube-background')) { // YOUTUBE VIDEO BACKGROUND
			if($('body').hasClass('mobile')) {

				// Default background on mobile devices
				$("body").backstretch([
					"demo/video/video.jpg"
				]);

			} else {
				$(".player").each(function() {
					$(".player").mb_YTPlayer();
				});
			}
		}
		
		if($('body').hasClass('youtube-list-background')) { // YOUTUBE LIST VIDEOS BACKGROUND
			if($('body').hasClass('mobile')) {

				// Default background on mobile devices
				$("body").backstretch([
					"demo/video/video.jpg"
				]);

			} else {

				var videos = [
					{videoURL: "0pXYp72dwl0",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:true},
					{videoURL: "9d8wWcJLnFI",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:false},
					{videoURL: "nam90gorcPs",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:true}
				];

				$(".player").YTPlaylist(videos, true);

			}
		}
		
		if($('body').hasClass('animated-gradient')) { // MOBILE BACKGROUND - Image background instead of video on mobile devices
			animatedGradient();
		}
		
	}
	
	
	// Plugins
	function initPlugins() {
		
		// NivoLightbox
		$('.nivoLightbox').nivoLightbox({
			effect: 'fade',                             // The effect to use when showing the lightbox
			theme: 'default',                           // The lightbox theme to use
			keyboardNav: true,                          // Enable/Disable keyboard navigation (left/right/escape)
			clickOverlayToClose: true,                  // If false clicking the "close" button will be the only way to close the lightbox
			errorMessage: 'The requested content cannot be loaded. Please try again later.' // Error message when content can't be loaded
		});

		// RESPONSIVE VIDEO - FITVIDS
		$(".video-container").fitVids();

		// FLEXSLIDER
		$('.flexslider').flexslider({
			animation: "fade",
			animationLoop: true,
			slideshowSpeed: 7000,
			animationSpeed: 600,
			controlNav: false,
			directionNav: false,
			keyboard: false,
			start: function(slider){
				$('body').removeClass('loading');
			}
		});

		// Countdown
		if ($('.countdown').length > 0) {			
			$('.countdown').each(function() {
				var $countdown = $(this),
					finalDate = $countdown.data('countdown');
				$countdown.countdown(finalDate, function(event) {
					$countdown.html(event.strftime(
						'<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div><div class="counter-box"><div class="number">%H</div><span>Hours</span></div><div class="counter-box"><div class="number">%M</div><span>Minutes</span></div><div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'
					));
				});
			});
		}

		// MAILCHIMP
		$('.mailchimp').ajaxChimp({
			callback: mailchimpCallback,
			url: "mailchimp-post-url" //Replace this with your own mailchimp post URL. Don't remove the "". Just paste the url inside "".  
		});

		function mailchimpCallback(resp) {
			 if (resp.result === 'success') {
				$('.success-message').html(resp.msg).fadeIn(1000);
				$('.error-message').fadeOut(500);

			} else if(resp.result === 'error') {
				$('.error-message').html(resp.msg).fadeIn(1000);
			}  
		}

		$('#email').focus(function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$('#email').keydown(function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$("#email").on( 'click', function() {
			$("#email").val('');
		});

		// Placeholder
		$('input, textarea').placeholder();

	}
	

	/* CONTACT FORM */
	function initContactForm() {
		var $contactForm = $('.contact-form');
		if( $contactForm.length < 1 ){ return true; }

		$contactForm.each( function(){
			var element = $(this),
				elementAlert = element.attr('data-alert-type'),
				elementResult = element.find('.response-message');

			element.find('form').validate({
				submitHandler: function(form) {
					elementResult.hide();

					$(form).ajaxSubmit({
						target: elementResult,
						dataType: 'json',
						success: function( data ) {
							elementResult.html( data.message ).fadeIn( 400 );
							if( data.alert != 'error' ) { $(form).clearForm(); }
						}
					});
				}
			});

		});
	}
	
	
	// WINDOW.LOAD FUNCTION
	$(window).load(function() {
		initPreloader();
	});
	
	// DOCUMENT.READY FUNCTION
	jQuery(document).ready(function($) {
		initAnimations();
		fullscreenElements();
		initPageBackground();
		initLayoutLines();
		initNavigation();
		initPlugins();
		initContactForm();
	});
	
	// WINDOW.RESIZE FUNCTION
	$(window).on('resize', function () {
		fullscreenElements();
		initLayoutLines();
	});

})(jQuery);