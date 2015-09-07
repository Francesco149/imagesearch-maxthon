/*
	Copyright 2014 Franc[e]sco (lolisamurai@tfwno.gf)
	This file is part of Image Search Options for Maxthon.
	Image Search Options for Maxthon is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	Image Search Options for Maxthon is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	You should have received a copy of the GNU General Public License
	along with Image Search Options for Maxthon.  If not, see <http://www.gnu.org/licenses/>.
	
	JQuery by https://jquery.com/
	URI.js by http://medialize.github.io/URI.js/
*/

// I suck at javascript and jquery so this script is an ugly collage of stuff I googled. sorry.

if (typeof String.prototype.format != 'function') {
	// http://stackoverflow.com/a/5077091
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
	};
}

if (typeof String.prototype.startsWith != 'function') {
	// http://stackoverflow.com/a/646643
	String.prototype.startsWith = function (str) {
		return this.slice(0, str.length) == str;
	};
}

// the pop-up code is heavily inspired by http://userscripts-mirror.org/scripts/review/131426

function imgsrcInit() {
	console.info("{0} {1}".format(imgsrcInitializing(), imgsrcTitle()));
		
	var img = $('<div>').attr('id', 'imgsrc-hover-popup');
	var selector = 'img';
	var ctrlDown = false;
	var target = undefined;
	
	// show the popup  
	function showMenu() {
		// ignore invalid images
		if (typeof target == 'undefined' || typeof target.attr('src') == 'undefined') {
			return;
		}
		
		// move popup to the top left corner of the image
		var tp = target.offset();
		img.css('top', tp.top + 5).css('left', tp.left + 5);
		
		// obtain absolute image url
		var imgurl = target.attr('src');
		if (!imgurl.startsWith('http://') && !imgurl.startsWith('https://')) {
			var uriLocation = new URI(window.location.href);
			
			if (imgurl.startsWith('//')) {
				imgurl = uriLocation.protocol() + ':' + imgurl;
			}
			else {
				var uriImage = new URI(imgurl);
				uriImage = uriImage.absoluteTo(
					uriLocation.protocol() + '://' + uriLocation.hostname() + uriLocation.directory()
				);
				imgurl = uriImage.href();
			}
		}
		
		// build the image search urls
		img.html(
			'\
			<p><b>{1}</b></p>\
			<p><a href="https://www.google.com/searchbyimage?image_url={0}" target="_blank">Google</a></p>\
			<p><a href="https://saucenao.com/search.php?url={0}" target="_blank">SauceNAO</a></p>\
			<p><a href="http://iqdb.org/?url={0}" target="_blank">IQDB</a></p>\
			<p><a href="https://www.tineye.com/search?url={0}" target="_blank">TinEye</a></p>\
			<p id="imgsrc-donate">\
				<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=93EJS88KVQBB8" \
					target="_blank">{2}</a>\
			</p>\
			'
			.format(encodeURIComponent(imgurl), imgsrcSearch(), imgsrcDonate())
		);
		
		// make the div visible
		img.css('display', 'block');
		
		// override font, margins, padding and url color for the popup
			
		img.find('p')
			.css('margin', '0')
			.css('padding', '0')
			.css('line-height', 'inherit')
			.css('font', 'inherit')
			.css('color', 'inherit')
			.css('background', 'none');
			
		img.find('a')
			.css('text-decoration', 'none')
			.css('color', '#369')
			.css('font', 'inherit')
			.css('background', 'none')
			.css('line-height', 'inherit');
			
		img.find('#imgsrc-donate')
			.css('font-style', 'italic')
			.css('text-align', 'right');
		
		console.debug('(' + tp.top + ',' + tp.left + ') -> ' + imgurl);
	}
	
	// hide the popup
	function hideMenu() {
		img.css('display', 'none');
	}
	
	// updates the ctrl keydown status
	function updateCtrl(e) {
		ctrlDown = e.ctrlKey;
		//console.debug(ctrlDown);
		if (ctrlDown) {
			showMenu();
		} else {
			hideMenu();
		}
	}
     
	function mouseOver(e) {
		target = $(e.target);
		
		if (ctrlDown) {
			showMenu();
		}
	}

	function mouseLeave(e) {
		hideMenu();
		target = undefined;
	}

	// create the popup placeholder
	img
		.css('position', 'absolute')
		.css('top', 5).css('left', 5)
		.css('z-index', 9999)
		.css('width', '80px')
		.css('height', '72px')
		.css('padding', '5px')
		
		.css('color', '#000')
		.css('background', 'rgba(255, 255, 255, 0.75)')
		.css('border', '1px solid #333')
		.css('font', 'normal 10px verdana,arial,helvetica,sans-serif').css('line-height', '12px')
		.css('display', 'none');
	
	// attach it to the page
	$("body").append(img);
	
	// bind mouse events
	img.mouseenter(function(e) { img.css('display', 'block'); });
	img.mouseleave(function(e) { img.css('display', 'none'); });
	$(document).on('mouseenter', selector, mouseOver);
	$(document).on('mouseleave', selector, mouseLeave);
	$(document).mousemove(updateCtrl);
	$(document).keydown(updateCtrl);
	$(document).keyup(updateCtrl);
	
	console.info("{0} {1}".format(imgsrcTitle(), imgsrcIsReady()));
}

imgsrcInit();