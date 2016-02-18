function run(){
	
	if(document.getElementById('calc') !== null){

		document.getElementById('calc').onclick = function(){

			// Value reset for re-calculation
			document.forms['calculation'].elements['Net Present Value'].value = "";
			document.forms['calculation'].elements['Profitability Index'].value = "";
			document.forms['calculation'].elements['Internal Rate of Return'].value = "";


			// Hide the error message first for re-calculation
			hide(document.getElementById('errorDiv'));
			
			// Reset the comments for re-calculation
			show(document.getElementsByClassName('result')[0]);
			show(document.getElementsByClassName('comments')[0]);
			hide(document.getElementsByClassName('go')[0]);
			hide(document.getElementsByClassName('go-comments')[0]);
			hide(document.getElementsByClassName('nogo')[0]);
			hide(document.getElementsByClassName('nogo-comments')[0]);



			// Place assumptions to variables
			// Use Number and parseXXX methods for type casting
			
			// Key Factors

			// 1. Initial Investment
			// Eliminate commas when users input them
			var initial = Number(document.forms['keyfactors'].elements['Initial Investment'].value.split(",").join(""));
			
			// 2. Cost of Capital
			var costOfCapital = parseFloat(document.forms['keyfactors'].elements['Cost of Capital'].value.split(",").join("") / 100);
			
			// 3. Investment Term(Year)
			var investmentTerm = Number(document.forms['keyfactors'].elements['Investment Term'].value.split(",").join(""));

			// 4. Coporate Tax Rate
			var corporateTax = parseFloat(document.forms['keyfactors'].elements['Corporate Tax Rate'].value.split(",").join("") / 100);

			// 5. Method of Depreciation => Straight-Line

			
			
			// Annual Cash Flows - Before Tax
			
			// 1, 2. Sales and Cost(Annual Economic Effect)
			// Place "after-tax" calculation results
			var sales = Number(document.forms['cashflows'].elements['Sales'].value.split(",").join("") * (1 - corporateTax));
			var cost = Number(document.forms['cashflows'].elements['Cost'].value.split(",").join("") * (1 - corporateTax));

			// 3. Annual Tax Shield from Depreciation(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			var depreciation = Number(document.forms['cashflows'].elements['Depreciation'].value.split(",").join("") * corporateTax);

			// 4. Residual Value => Cash equivalent value on disposal
			// No tax effect occurs due to the nature of transactions (simply in exchange of disposal assets)
			var residualValue = Number(document.forms['cashflows'].elements['Residual Value'].value.split(",").join(""));

			// 5. Tax Shield from Profit/Loss on Assets Sales(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			// Profit => -(Cash OutFlow), Loss => +(Cash InFlow)
			var profitLoss = Number(document.forms['cashflows'].elements['Profit Loss'].value.split(",").join("") * corporateTax);
			




			// Assumption Validation
			// Not using assumption variables (e.g. initial, sales...etc) to separate "0" and "empty boxes"
			// Validation should recognize when users input 0 on purpose
			var requiredArray  = [document.forms['keyfactors'].elements['Initial Investment'].value.split(",").join(""),
								document.forms['keyfactors'].elements['Cost of Capital'].value.split(",").join(""), 
								document.forms['keyfactors'].elements['Investment Term'].value.split(",").join(""), 
								document.forms['keyfactors'].elements['Corporate Tax Rate'].value.split(",").join(""),  
								document.forms['cashflows'].elements['Sales'].value.split(",").join(""), 
								document.forms['cashflows'].elements['Cost'].value.split(",").join("")];

			var positiveArray = [initial, costOfCapital, investmentTerm, corporateTax, 
								sales, cost, depreciation, residualValue];

			

			function validation(){
				for(var i = 0; i < requiredArray.length; i++){
					if((requiredArray[i] !== 0) && !requiredArray[i]){
							return false;
					}
				}

				for(var i = 0; i < positiveArray.length; i++){
					if(positiveArray[i] < 0){;
						return false;
					}
				}
				return true;
			}



			// Calculation based on assumptions

			// Annual Cash Flow calculation
			var annualCF = (sales - cost) + depreciation;

			// Cash Flow upon Termination
			var termination = residualValue + profitLoss;


			// Present Value variable declaration
			var pv = 0;


			// Function to calculate Present Value
			// The function calculates discounted values by using 
			// Cost of Capital and Invetment Periods
			function pvCalc(){
				
				// Present Value from Annual Cash Flow
				for(var i = 1; i <= investmentTerm; i++){
					pv += annualCF * (1 / Math.pow(1 + costOfCapital, i));
				}

				// Present Value from Termination
				pv += termination * (1 / Math.pow(1 + costOfCapital, investmentTerm));

				return pv;
			}

			pv = pvCalc();


			// Net Present Value variable declaration
			var npv = 0;


			// Function to calculate Net Present Value
			// NPV = PV - Initial
			function netPresentValue(){
				npv = Math.round(pv - initial);
				return npv;
			}

			
			// Profitability Index variable declaration
			var pIndex = 0;


			// Function to calculate Profitability Index
			// PI = PV / Initial
			function profitIndex(){
				
				// Move the floating point and then round the number
				pIndex = Math.round((pv / initial) * 100) / 100;
				
				if(pIndex){
					return pIndex;
				}else{
					return "N/A";
				}
			}


			// Assign NPV and PI values to each HTML element
			//document.forms['calculation'].elements['Net Present Value'].value = netPresentValue();
			//document.forms['calculation'].elements['Profitability Index'].value = profitIndex();





			// Internal Rate of Return Calculation
			/** Internal Rate of Return is the interest rate at which the net present 
			* value of all the cash flows (both positive and negative) from a project 
			* or investment equal zero.
			*/

			// Assign values to variables "irr" and "irrNPV" as a calculation starting point 
			//var irr = costOfCapital;
			//var irrNPV = npv;



			function IRR(){
				// Assign values to variables "irr" and "irrNPV" as a calculation starting point 
				var irr = costOfCapital;
				var irrNPV = npv;
				
				/** If irrNPV (equivalent to npv at this moment) is zero, 
				* then that's the IRR that we want. 
				* IRR = the interest rate for NPV being zero
				*/
				if(validation()){
					if(irrNPV === 0){
						return Math.round(irr * 100) / 100;
					}else{
						return irrCalc(irrNPV, irr);
					}
				}
			}
				
			function irrCalc(irrNPV, irr){
				var array = [];
				var rateNPV = irrNPV;
				
				// Adjust the temporary IRR by 0.01 and search values
				// irrNPV > 0 means irr is greater than the current rate
				// Else if for two cases (irrNPV > 0 or not)
				if(irrNPV > 0){
					for(var i = 0; ; i++, irr += 0.01){
						
						// Calculate NPV by the adjusted IRR
						rateNPV = irrNPVCalc(irr);

						// Place the adjusted IRR and NPV combination as a pair-value object in the array
						array[i] = {rate: irr, 
									rateNPV: rateNPV };
						
						// Break the else if when the NPV is equal to or less than zero
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

				/** IRR is between last object's NPV and second-to-last one's.
				* For example, Last => {rate: 0.09, rateNPV: 100} Second-to-Last => {rate: 0.10, rateNPV: -100}
				* rateNPV zero (=IRR) is between 0.09 and 0.10.
				*/
				var lastObj = array.pop();
				var secondLastObj = array.pop();

				// Calculate a remainder of the ratio (eg. 100 / (100 - (-100)) => 0.095(9.5%) for the example above)
				irr = secondLastObj['rate'] * 100 + secondLastObj['rateNPV'] / (secondLastObj['rateNPV'] - lastObj['rateNPV']);
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

			
			// Assign IRR value to the HTML element
			//document.forms['calculation'].elements['Internal Rate of Return'].value = IRR();


			// Effects functions (show, hide)
			function show(el){
				el.style.display = 'block';
			}

			function hide(el){
				el.style.display = 'none';
			}
			
			
			// Result Presentation
			if(validation()){
				document.forms['calculation'].elements['Net Present Value'].value = netPresentValue();
				document.forms['calculation'].elements['Profitability Index'].value = profitIndex();
				document.forms['calculation'].elements['Internal Rate of Return'].value = IRR();

				var irr = document.forms['calculation'].elements['Internal Rate of Return'].value;

				// Document.getElementsByClassName returns an array-like object(NodeList)
				if(npv > 0){
					if(pIndex > 1){
						if(irr > costOfCapital){
							hide(document.getElementsByClassName('result')[0]);
							show(document.getElementsByClassName('go')[0]);
							hide(document.getElementsByClassName('comments')[0]);
							show(document.getElementsByClassName('go-comments')[0]);
						}
					}
				}else{
					hide(document.getElementsByClassName('result')[0]);
					show(document.getElementsByClassName('nogo')[0]);
					hide(document.getElementsByClassName('comments')[0]);
					show(document.getElementsByClassName('nogo-comments')[0]);
				}

			}else{
				show(document.getElementById('errorDiv'));
			}
			
		};
	}


	// Effects functions (fadeIn, fadeOut)
	function fadeIn(elem, ms){
  		if(!elem){
  			return;
  		}
		 
		 elem.style.opacity = 0;
		 elem.style.filter = 'alpha(opacity=0)';
		 elem.style.display = 'inline-block';
		 elem.style.visibility = 'visible';

  		if(ms){
    		var opacity = 0;
    		var timer = setInterval(function(){
      			opacity += 50 / ms;
      			if(opacity >= 1){
        			clearInterval(timer);
        			opacity = 1;
      			}
		      	elem.style.opacity = opacity;
		      	elem.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
    		}, 50 );
	  		
  		}else{
		    elem.style.opacity = 1;
		    elem.style.filter = 'alpha(opacity=1)';
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
		        elem.style.display = 'none';
		        elem.style.visibility = 'hidden';
	      	}
			    elem.style.opacity = opacity;
			    elem.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
	  	  	}, 50);
	  	
	  	}else{
		    elem.style.opacity = 0;
		    elem.style.filter = 'alpha(opacity=0)';
		    elem.style.display = 'none';
		    elem.style.visibility = 'hidden';
	  	}
	}


	// Add fadeIn fadeOut effects to the Cost of Capital input box
	if(document.getElementById('costOfCapital') !== null){
		document.getElementById('costOfCapital').addEventListener('click', function(){
			fadeIn(document.getElementById('industry_return'), 400);
		});
		document.getElementById('costOfCapital').addEventListener('mouseout', function(){
			fadeOut(document.getElementById('industry_return'), 400);
		});
	}

		
	
		
		// 10 Industry Portfolios (Monthly)
		// 10 years data from 2005-08-31 to 2015-07-31
		var myurl = 'https://www.quandl.com/api/v3/datasets/KFRENCH/10_IND_PORTF_M.json?api_key=zygEkvv9GeTHH7Ep5M3y&start_date=2005-08-31';
		var request = new XMLHttpRequest();
		request.open('GET', myurl, true);

		request.onload = function(){
			if(request.status >= 200 && request.status < 400){
				var data = JSON.parse(request.responseText);
				industry_names = data['dataset']['column_names'];
				indexArray = data['dataset']['data'];

				var industryData = [];

				for(var i = 1; i < industry_names.length; i++){
					industryData[i - 1] = {	industry: industry_names[i],
										total: 0,
										average: 0,
										median: 0};
				}

				for(var row = 1; row <= 10; row++){
					var total = 0;
					var average = 0;
					var medianArray = [];
					for(var column = 0; column < indexArray.length; column++){
						total += indexArray[column][row];
						medianArray.push(indexArray[column][row]);
					}

					industryData[row - 1]['total'] = total;

					// Average calculation
					monthlyAvg = total / indexArray.length; // Monthly
					annualAvg = Math.round((monthlyAvg * 12) * 100) / 100; // Annual
					industryData[row - 1]['average'] = annualAvg;

					// Median calculation (Median of 120 months; 
					// An annual median by assuming the median of a month * 12;

					industryData[row - 1]['median'] = Math.round((medianCalc(medianArray) * 12) * 100) / 100;
				}
				
				
				// If the difference betwewen average and median is big, take the median.
		
				function avgVsMedian(arr){
						if(Math.abs(arr['average'] - arr['median']) > 3){
							return arr['median'];
						}else{
							return arr['average'];
						}
				}


				function medianCalc(arr, fn){
					var half = (arr.length / 2) | 0;
					var temp = arr.sort(fn);

					if(temp.length % 2){
						return temp[half];
					}
					return (temp[half - 1] + temp[half]) / 2;
				}


				for(var i = 0; i < document.getElementsByTagName('td').length; i++){
					var el = document.getElementsByTagName('td')[i];
					el.innerHTML = avgVsMedian(industryData[i]);
				}


			}else{
				alert('Error returned from the server');
			}
		}

		request.onerror = function(){
			alert('Connection Error');
		}

		request.send();


	// Add an addEventListener to "Try again?" button
	document.getElementById('reload').addEventListener('click', function(){
		window.location.reload();
	});

}



// Check the loading state of the document.
// Document.readyState property can be 'loading', 'interactive', or 'complete'.
if(document.readyState !== 'loading'){
	run();

}else if(document.addEventListener){
	
	// For modern browsers
	/** 
	* The DOMContentLoaded event is fired when the initial HTML document has been 
	* completely loaded and parsed, without waiting for stylesheets, images, and 
	* subframes to finish loading.
	*/
	document.addEventListener('DOMContentLoaded', run);

}else{
	
	// For IE <= 8
	// attachEvent is an alternative to the standard addEventListener() method.
	document.attachEvent('onreadystatechange', function(){
		if(document.readyState === 'complete'){
			run();
		}
	});
}




