// fishbowl.js

$(document).ready(function() {
	$("#login_area").css("visibility", "visible");

	// check if we have previously authed to facebook
	if (!localStorage.fishbowl) {
		alert("No token, showing the login page");
		loginPopupToFaceBook();
	} else {
		console.log("Got an existing token.");
		FacebookAPI.setToken(localStorage.fishbowl);

		setTimeout(me, 5000);
	}

	$("#login").click(FacebookAPI.login);	
	$("#getme").click(me);	
	
	// Start some movement
	waterDown();
	swimRight();

	$.play();

});

function me() {
	FacebookAPI.me(function(user) {
		console.log("test me: " + JSON.stringify(user));
	});
}



// Mousetrap.bind("r", getFinancialData);

//setInterval(getFinancialData, 5000);

function setWaterLevel(data) {
	var level = data[0].finalRunningBalanceForView;
	console.log("orgi " + level);
	level = level.replace(',', '') + 0;
	console.log(level);

	if (level < 0) {
		fishDie(); 
	} else {
		waterLevel = 500-(level/15000)*500;
	}
	//$("#fish").html(level);
}

///////////////////////////////////
// Basic movement
///////////////////////////////////

var waterLevel 	= 100;
var tankHeight 	= 500;
var tankWidth 	= 500;
var tide		= 30;
var fishDead	= false;
var fishSpeed	= 2;

Mousetrap.bind("a", function() {waterLevel -= 30;});
Mousetrap.bind("z", function() {waterLevel += 30;});

Mousetrap.bind("q", function() {fishSpeed += 0.4});
Mousetrap.bind("w", function() {fishSpeed -= 0.4});

function swimLeft() {
	if (fishDead) return;
	$('#fish').css('z-index', 1);
	$('#fish').tween({left:{start: 400, stop: 12, time: 0, duration: fishSpeed, units: 'px', 
		//effect: 'quadInOut',
		onStop: swimRight,
		onFrame: chooseLeftFish }});
}

function swimRight() {
	if (fishDead) return;
	$('#fish').css('z-index', 3);
	$('#fish').tween({left:{start: 12, stop: 400, time: 0, duration: fishSpeed, units: 'px', 
		// effect: 'InOut',
		onStop: swimLeft,
		onFrame: chooseRightFish }});
}

function waterDown() {
	$('#water').tween(
		{height:{start: waterLevel, stop: waterLevel-tide, time: 0, duration: 0.8, units: 'px', effect: 'easeInOut', onStop: waterUp }},
		{top:{start: tankHeight-waterLevel, stop: tankHeight-waterLevel+tide, time: 0, duration: 1, units: 'px', effect: 'easeInOut' }}
	);
}

function waterUp() {
	$('#water').tween(
		{height:{start: waterLevel-tide, stop: waterLevel, time: 0, duration: 0.8, units: 'px', effect: 'easeInOut', onStop: waterDown }},
		{top:{start: tankHeight-waterLevel+tide, stop: tankHeight-waterLevel, time: 0, duration: 1.5, units: 'px', effect: 'easeInOut'}}
	);
}

function chooseRightFish() {
	var f = Math.floor(($("#fish").offset().left / tankWidth)*5) + 1;
	$("#fish").css("background-image", "url('images/Fish-3_" + f + ".png')");

	var w = 100 + Math.sin(($("#fish").offset().left/400)*Math.PI)*40;
	
	$("#fish").width(w);
}

function chooseLeftFish() {
	var f = Math.floor(5 - ($("#fish").offset().left / tankWidth)*5) +5;
	//console.log("left" + f);
	$("#fish").css("background-image", "url('images/Fish-3_" + f + ".png')");

	var w = 100 - Math.sin(($("#fish").offset().left/400)*Math.PI)*40;
	$("#fish").width(w);

}

Mousetrap.bind("d", fishDie, "keyup");
function fishDie() {
	console.log("DEAD!");
	fishDead = true;
	$("#fish").css("transform", "scaleY(-1)");
	$('#fish').tween({top:{start: 300, stop: 12, time: 0, duration: 7, units: 'px'}}); 
}

function testToken() {			
	try {
		// Test the token
		console.log("testing the token")
		me();
	} catch (e) {
		alert("blah error bbbbbbbfdksdjf;adkfjas;dfkjads;fkasjdf;kasdjf;alskdjfas;dkfjads;fkla");
		console.log("Error connecting to facebook: " + e.message);
		loginPopupToFaceBook();
	}
}


