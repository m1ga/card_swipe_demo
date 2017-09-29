var sx = 0;
var sy = 0;
var cx = 0;
var cy = 0;

var cardWidth = $.view_card_front.width;
var cardHeight = $.view_card_front.height;

var dir = (OS_ANDROID) ? Ti.Filesystem.externalStorageDirectory : Ti.Filesystem.applicationDataDirectory;
var dpi = (OS_ANDROID) ? Ti.Platform.displayCaps.logicalDensityFactor : 1;

var WIDTH = (OS_ANDROID) ? Ti.Platform.displayCaps.platformWidth / dpi : Ti.Platform.displayCaps.platformWidth;
var HEIGHT = (OS_ANDROID) ? Ti.Platform.displayCaps.platformHeight / dpi : Ti.Platform.displayCaps.platformHeight;
var people;

function onTouchStart(e) {
	// start movement
	sx = e.x;
	sy = e.y;
	cx = e.x;
	cy = e.y;
}

function onTouchMove(e) {
	var xDistance = cx - sx;
	var yDistance = cy - sy;

	var rotationStrength = Math.min(xDistance / (WIDTH), 1);
	var rotationStrengthY = Math.min(yDistance / (HEIGHT), 1);

	var rotationAngel = (2 * Math.PI * rotationStrength / 16);
	var scaleStrength = 1 - Math.abs(rotationStrength) / 16;
	var scaleStrengthY = 1 - Math.abs(rotationStrengthY) / 16;

	var scaleMax = Math.min(scaleStrength, scaleStrengthY);
	var scale = Math.max(scaleMax, 0.93);

	$.view_card_front.rotation = rotationAngel * 20;
	$.view_card_front.translationX = xDistance;
	$.view_card_front.setTranslationY(yDistance);
	$.view_card_front.scaleX = scale;
	$.view_card_front.scaleY = scale;

	cx = e.x;
	cy = e.y;
}

function onTouchEnd(e) {

	var ani = Ti.UI.createAnimation({});
	ani.duration = 200;

	if (true) {
		// left
		ani.left = -cardWidth * 2;
		ani.addEventListener("complete", onCompleteAni);
	} else if (false) {
		// right    
		ani.left = WIDTH + cardWidth * 2;
		ani.addEventListener("complete", onCompleteAni);
	} else {

		$.view_card_front.translationX = 0;
		$.view_card_front.translationY = 0;
		$.view_card_front.scaleY = 1;
		$.view_card_front.scaleX = 1;
		$.view_card_front.rotation = 0;

		ani.left = WIDTH * 0.5 - cardWidth * 0.5;
		ani.top = HEIGHT * 0.5 - cardHeight * 0.5;
		ani.duration = 50;

	}

	$.view_card_front.animate(ani);
}

function setCenter() {
	$.view_card_front.left = WIDTH * 0.5 - cardWidth * 0.5;
	$.view_card_front.top = HEIGHT * 0.5 - cardHeight * 0.5;

	$.view_card_front.translationX = 0;
	$.view_card_front.setTranslationY(0);
	$.view_card_front.rotation = 0;
	$.view_card_front.scaleX = 1;
	$.view_card_front.scaleY = 1;
}

function onCompleteAni(e) {
	setCenter();
}

setCenter();
$.index.addEventListener("touchmove", onTouchMove);
$.index.addEventListener("touchstart", onTouchStart);
$.index.addEventListener("touchend", onTouchEnd);
$.index.open();
