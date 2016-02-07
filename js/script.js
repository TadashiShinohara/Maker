function run(){

	document.getElementById("calc").onclick = function(){

		//Assumption Input

		//Key Assumptions

		//1. Initial Investment
		var initial = parseInt(document.forms["keyfactors"].elements["Initial Investment"].value);

		//2. Cost of Capital
		var costOfCapital = parseFloat(document.forms["keyfactors"].elements["Cost of Capital"].value / 100);
		
		//3. Investment Term(Year)
		var investmentTerm = parseInt(document.forms["keyfactors"].elements["Investment Term"].value);

		//4. Coporate Tax Rate
		var corporateTax = parseFloat(document.forms["keyfactors"].elements["Corporate Tax Rate"].value / 100);

		//5. Method of Depreciation => Straight-Line

		/*window.onload = function(){
			document.getElementById("calc").onclick = function(){
				for(var i = 0; i < (document.keyfactors.elements.length) - 1; i++){
					var num = document.keyfactors.elements[i].value;
					if(num != null){
						if(isNaN(num)){
							alert("Please input numbers!");
							num = num.defaultValue;
							num.focus();
							num.select();
						}
					}
				}
			};
		};*/
		
		//Cash Flows
		
		//1. Annual Economic Effect

		//Annual Sales and Cost(after-tax)
		var sales = parseInt(document.forms["cashflows"].elements["Sales"].value * (1 - corporateTax));
		var cost = parseInt(document.forms["cashflows"].elements["Cost"].value * (1 - corporateTax));

		//Annual Tax Shield from Depreciation
		var depreciation = parseInt(document.forms["cashflows"].elements["Depreciation"].value * corporateTax);

		//2. Economic Effect on assets sales

		//Residual Value
		var residualValue = parseInt(document.forms["cashflows"].elements["Residual Value"].value);

		//4. Tax Shield from Profit/Loss on Assets Sales
		// Profit => -(Cash OutFlow), Loss => +(Cash InFlow)
		var profitLoss = parseInt(document.forms["cashflows"].elements["Profit Loss"].value * corporateTax);

		//Annual Cash Flow
		var annualCF = (sales - cost) + depreciation;

		//Cash Flow upon investment termination
		var termination = residualValue + profitLoss;

		//Present Value Variable Declaration
		var pv = 0;

		//Present Value Calculation
		function pvCalc(){
			
			//Present Value from Annual Cash Flow
			for(var i = 1; i <= investmentTerm; i++){
				pv += annualCF * (1 / Math.pow(1 + costOfCapital, i));
			}

			//Present Value from Investment Termination
			pv += termination * (1 / Math.pow(1 + costOfCapital, investmentTerm));
		}

		//Net Present Value Variable Declaration
		var npv = 0;

		//Net Present Value Calculation
		function netPresentValue(){
			pvCalc();
			npv = Math.round(pv - initial);
			return npv;
		}

		document.forms["calculation"].elements["Net Present Value"].value = netPresentValue();

		//Profitability Index Variable Declaration
		var pIndex = 0;

		//Profitability Index Calculation
		function profitIndex(){
			
			// move the floating point and then round the number
			pIndex = Math.round((pv / initial) * 100) / 100;
			return pIndex;
		}

		document.forms["calculation"].elements["Profitability Index"].value = profitIndex();


		//Internal Rate of Return

		var irr = costOfCapital;
		var irrNPV = npv;

		function IRR(){
			if(irrNPV === 0){
				return irr;
			}else{
				return irrCalc(irrNPV, irr);
			}

			function irrCalc(irrNPV, irr){
				var array = [];
				var rateNPV = irrNPV;
				if(irrNPV > 0){
					for(var i = 0; ; i++, irr += 0.01){
						rateNPV = irrNPVCalc(irr);
						array[i] = {rate: irr, 
									rateNPV: rateNPV };
						if(rateNPV <= 0){
							break;
						}
					}
				}else{
					for(var i = 0; ; i++, irr -= 0.01){
						rateNPV = irrNPVCalc(irr);
						array[i] = {rate: irr, 
									rateNPV: rateNPV };
						if(rateNPV >= 0){
							break;
						}
					}
				}

				var lastObj = array.pop();
				var secondLastObj = array.pop();

				irr = secondLastObj["rate"] * 100 + secondLastObj["rateNPV"] / (secondLastObj["rateNPV"] - lastObj["rateNPV"]);
				irr = Math.round(irr * 100) / 100;
				return irr;
			}

			function irrPVCalc(irr){
				var irrPV = 0;
				for(var i = 1; i <= investmentTerm; i++){
					irrPV += annualCF * (1 / Math.pow(1 + irr, i));
				}

				//Present Value from Investment Termination
				irrPV += termination * (1 / Math.pow(1 + irr, investmentTerm));
				return irrPV;
			}

			function irrNPVCalc(irr){
				var irrPVResult = irrPVCalc(irr);
				irrNPV = Math.round(irrPVResult - initial);
				return irrNPV;
			}
		}

		document.forms["calculation"].elements["Internal Rate of Return"].value = IRR();


		function show(el){
			el.style.display = "block";
		}

		function hide(el){
			el.style.display = "none";
		}

		
		// getElementsByClassName delivers a NodeList
		if(npv > 0){
			if(pIndex > 1){
				hide(document.getElementsByClassName("result")[0]);
				show(document.getElementsByClassName("go")[0]);
				hide(document.getElementsByClassName("comments")[0]);
				show(document.getElementsByClassName("go-comments")[0]);
			}
		}else{
			hide(document.getElementsByClassName("result")[0]);
			show(document.getElementsByClassName("nogo")[0]);
			hide(document.getElementsByClassName("comments")[0]);
			show(document.getElementsByClassName("nogo-comments")[0]);
		}
	}

	function fadeIn(elem, ms){
  		if(!elem){
  			return;
  		}
		 elem.style.opacity = 0;
		 elem.style.filter = "alpha(opacity=0)";
		 elem.style.display = "inline-block";
		 elem.style.visibility = "visible";

  		if(ms){
    		var opacity = 0;
    		var timer = setInterval(function(){
      			opacity += 50 / ms;
      			if(opacity >= 1){
        			clearInterval(timer);
        			opacity = 1;
      			}
		      elem.style.opacity = opacity;
		      elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    		}, 50 );
  		
  		}else{
	    elem.style.opacity = 1;
	    elem.style.filter = "alpha(opacity=1)";
  		}
	}

	function fadeOut(elem, ms){
  		if(!elem){
  			return;
  		}
  		
  		if(ms){
		    var opacity = 1;
		    var timer = setInterval(function(){
		    opacity -= 50 / ms;
	      	if(opacity <= 0){
		        clearInterval(timer);
		        opacity = 0;
		        elem.style.display = "none";
		        elem.style.visibility = "hidden";
	      	}
			    elem.style.opacity = opacity;
			    elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
	  	  	}, 50);
	  	}else{
		    elem.style.opacity = 0;
		    elem.style.filter = "alpha(opacity=0)";
		    elem.style.display = "none";
		    elem.style.visibility = "hidden";
	  	}
	}

	
	document.getElementById("keyfactors").addEventListener("click", function(){
		fadeIn(document.getElementById("explanation1"), 400);
	});

	document.getElementById("keyfactors").addEventListener("mouseout", function(){
		fadeOut(document.getElementById("explanation1"), 400);
	});

	document.getElementById("cashflows").addEventListener("click", function(){
		fadeIn(document.getElementById("explanation2"), 400);
	});

	document.getElementById("cashflows").addEventListener("mouseout", function(){
		fadeOut(document.getElementById("explanation2"), 400);
	});

	document.getElementById("calculation").addEventListener("click", function(){
		fadeIn(document.getElementById("explanation3"), 400);
	});

	document.getElementById("calculation").addEventListener("mouseout", function(){
		fadeOut(document.getElementById("explanation3"), 400);
	});

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

