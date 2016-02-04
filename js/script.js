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

			return pv;
		}

		//Net Present Value Calculation
		function netPresentValue(){
			var NPV = 0;
			pv = pvCalc();
			NPV = pv - initial;
			return NPV;
		}

		var npv = Math.round(netPresentValue());	

		document.forms["calculation"].elements["Net Present Value"].value = npv;

		//$("#netPresentValue").val(npv);

		//Profitability Index Calculation
		function profitIndex(){
			var pIndex = 0;
			pv = pvCalc();
			pIndex = pv / initial;
			return pIndex;
		}

		// move the floating point and then round the number	
		var pi = Math.round(profitIndex() * 100) / 100;

		document.forms["calculation"].elements["Profitability Index"].value = pi;

		//$("#profitabilityIndex").val(pi);


		//Internal Rate of Return

		/*function IIR(){
			costOfCapital = ???
			
		}*/

		function show(el){
			el.style.display = "block";
		}

		function hide(el){
			el.style.display = "none";
		}

		
		// getElementsByClassName delivers a NodeList
		if(npv > 0){
			if(pi > 1){
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

