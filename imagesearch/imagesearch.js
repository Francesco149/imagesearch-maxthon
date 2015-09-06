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

function imgsrcInject() {
	// load the Maxthon runtime
	var rt = window.external.mxGetRuntime();

	// get the browser interface
	var browser = rt.create("mx.browser");

	// inject libraries
	browser.injectScriptFile("include/jquery.js");
	browser.injectScriptFile("include/URI.js");

	// inject localization stuff
	function localeGetter(methodName, key) {
		return '\
			function ' + methodName + '() {\
				return "' + rt.locale.t(key) + '";\
			}';
	}
	browser.executeScript(
		localeGetter('imgsrcTitle', 'app.title') +
		localeGetter('imgsrcInitializing', 'app.initializing') +
		localeGetter('imgsrcIsReady', 'app.isready') + 
		localeGetter('imgsrcSearch', 'app.search') +
		localeGetter('imgsrcDonate', 'app.donate')
	);

	// inject the menu script
	browser.injectScriptFile("inject/menu.js");
}

imgsrcInject();