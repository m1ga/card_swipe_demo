var sx = 0;
var sy = 0;
var cx = 0;
var cy = 0;

var cardWidth = $.view_card_front.width;
var cardHeight = $.view_card_front.height;

var dpi = (OS_ANDROID) ? Ti.Platform.displayCaps.logicalDensityFactor : 1;
var WIDTH = (OS_ANDROID) ? Ti.Platform.displayCaps.platformWidth / dpi : Ti.Platform.displayCaps.platformWidth;
var HEIGHT = (OS_ANDROID) ? Ti.Platform.displayCaps.platformHeight / dpi : Ti.Platform.displayCaps.platformHeight;

function onTouchStart(e) {
	// start movement
	if (e.source == $.content) {
		sx = cx = e.x;
		sy = cy = e.y;
	}
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
	if (rotationAngel > 0.01 || rotationAngel < -0.01) {
		$.view_card_front.rotation = rotationAngel * 20;
	}

	if (OS_IOS)
	{
		$.view_card_front.left = (WIDTH * 0.5 - cardWidth * 0.5) + xDistance * dpi;
		$.view_card_front.top = (HEIGHT * 0.5 - cardHeight * 0.5) + yDistance * dpi;
	}
	else
	{
		$.view_card_front.translationX = xDistance * dpi;
		$.view_card_front.translationY = yDistance * dpi;
	}

	$.view_card_front.scaleX = scale;
	$.view_card_front.scaleY = scale;

	cx = e.x;
	cy = e.y;
}

function onTouchEnd(e) {
	var isLeft = true;
	var ani = Ti.UI.createAnimation({});
	ani.duration = 200;


	if (OS_ANDROID){
		if ($.view_card_front.translationX>0){
			isLeft = false;
		}
	}
	
	let goSwipe = false;
	if (parseInt((e.x - sx)) > 0)
		isLeft = false;
	
		if (parseInt((e.x - sx)) < -100 || parseInt((e.x - sx)) > 100)
		goSwipe = true;


	if (isLeft && goSwipe) {
		// left
		ani.left = -cardWidth * 2;
		ani.addEventListener("complete", onCompleteAni);
	} else if (!isLeft && goSwipe) {
		// right
		ani.left = WIDTH + cardWidth * 2;
		ani.addEventListener("complete", onCompleteAni);
	} else {
		if (OS_ANDROID)
		{
			$.view_card_front.translationX = 0;
			$.view_card_front.translationY = 0;
		}
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

	if (OS_ANDROID)
	{
		$.view_card_front.translationX = 0;
		$.view_card_front.translationY = 0;
	}
	$.view_card_front.rotation = 0;
	$.view_card_front.scaleX = 1;
	$.view_card_front.scaleY = 1;
}

function onCompleteAni(e) {
	setCenter();
}

setCenter();
$.index.open();
