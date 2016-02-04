$(document).ready(function(){
	/*function fadeIn(element){
		element.style.opacity = 0;

		var last = new Date();
		var tick = function(){
			element.style.opacity = element.style.opacity + (new Date() - last) / 400;
			last = new Date();

			if(element.style.opacity < 1){
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			}
		};
		tick();
	}*/


	




	$(function(){
		$("#keyfactors").hover(function(){
			$("#explanation1").fadeIn();
			//console.log("fadein");
		}, function(){
			$("#explanation1").fadeOut("slow");
			//console.log("fadeout");
		});
	});

	$(function(){
		$("#cashflows").hover(function(){
			$("#explanation2").fadeIn();
			//console.log("fadein");
		}, function(){
			$("#explanation2").fadeOut("slow");
			//console.log("fadeout");
		});
	});

	$(function(){
		$("#calculation").hover(function(){
			$("#explanation3").fadeIn();
			//console.log("fadein");
		}, function(){
			$("#explanation3").fadeOut("slow");
			//console.log("fadeout");
		});
	});
});

/*function run(){
	document.addEventListener("mouseover", )

}

if(document.readyState != "loading"){
	run();
}else if(document.addEventListener){
	document.addEventListener("DOMContentLoaded", run);
}else{
	document.attachEvent("onreadystatechange", function(){
		if(document.readyState == "complete"){
			run();
		}
	});
}

function fadeIn(el, duration, display){
	var s = el.style, step = 25 / (duration || 300);
	s.opacity = s.opacity || 0;
	(function fade(){
		(s.opacity = parseFloat(s.opacity) + step) > 1 ? s.opacity = 1 : setTimeout(fade, 25);
	})();
}

function fadeOut(el, duration){
	var s = el.style, step = 25 / (duration || 300);
	s.opacity = s.opacity || 1;
	(function fade(){
		(s.opacity -= step) < 0 ? s.display = "none" : setTimeout(fade, 25);
	})();
}*/


