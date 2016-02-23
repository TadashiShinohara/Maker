function run(){
	
	if(document.getElementById('calc') !== null){

		document.getElementById('calc').onclick = function(){

			// Value reset for re-calculation
			document.forms['calculation'].elements['Net Present Value'].value = "";
			document.forms['calculation'].elements['Profitability Index'].value = "";
			document.forms['calculation'].elements['Internal Rate of Return'].value = "";


			// Hide the error message for re-calculation
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
			// XXXVal variables are for validation only
			
			// Key Factors

			// 1. Initial Investment
			// Eliminate commas when users input them => split(",").join("")
			var initial = Number(document.forms['keyfactors'].elements['Initial Investment'].value.split(",").join(""));
			var initialVal = document.forms['keyfactors'].elements['Initial Investment'].value;
			
			// 2. Cost of Capital
			var costOfCapital = parseFloat(document.forms['keyfactors'].elements['Cost of Capital'].value.split(",").join("") / 100);
			var costOfCapitalVal = document.forms['keyfactors'].elements['Cost of Capital'].value;
			
			// 3. Investment Term(Year)
			var investmentTerm = Number(document.forms['keyfactors'].elements['Investment Term'].value.split(",").join(""));
			var investmentTermVal = document.forms['keyfactors'].elements['Investment Term'].value;
			
			// 4. Coporate Tax Rate
			var corporateTax = parseFloat(document.forms['keyfactors'].elements['Corporate Tax Rate'].value.split(",").join("") / 100);
			var corporateTaxVal = document.forms['keyfactors'].elements['Corporate Tax Rate'].value;
			
			// 5. Method of Depreciation => Straight-Line

			
			
			// Annual Cash Flows - Before Tax
			
			// 1, 2. Sales and Cost(Annual Economic Effect)
			// Place "after-tax" calculation results
			var sales = Number(document.forms['cashflows'].elements['Sales'].value.split(",").join("") * (1 - corporateTax));
			var salesVal = document.forms['cashflows'].elements['Sales'].value;
			
			var cost = Number(document.forms['cashflows'].elements['Cost'].value.split(",").join("") * (1 - corporateTax));
			var costVal = document.forms['cashflows'].elements['Cost'].value;

			// 3. Annual Tax Shield from Depreciation(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			var depreciation = Number(document.forms['cashflows'].elements['Depreciation'].value.split(",").join("") * corporateTax);
			var depreciationVal = document.forms['cashflows'].elements['Depreciation'].value;
			
			// 4. Residual Value => Cash equivalent value on disposal
			// No tax effect occurs due to the nature of transactions (simply in exchange of disposal assets)
			var residualValue = Number(document.forms['cashflows'].elements['Residual Value'].value.split(",").join(""));
			var residualValueVal = document.forms['cashflows'].elements['Residual Value'].value;
			
			// 5. Tax Shield from Profit/Loss on Assets Sales(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			// Profit => -(Cash OutFlow), Loss => +(Cash InFlow)
			var profitLoss = Number(document.forms['cashflows'].elements['Profit Loss'].value.split(",").join("") * corporateTax);
			var profitLossVal = document.forms['cashflows'].elements['Profit Loss'].value;
			

			// Assumption Validation
<<<<<<< HEAD

			// Sorry for this ugly code, but this is to avoid "Aw snap" brower error
			function validation(){
				if(initialVal !== "" && typeof initial === "number" && initial > 0){
					if(costOfCapitalVal !== "" && typeof costOfCapital === "number" && costOfCapital > 0){
						if(investmentTermVal !== "" && typeof investmentTerm === "number" && investmentTerm > 0){
							if(corporateTaxVal !== "" && typeof corporateTax === "number" && corporateTax > 0){
								if(salesVal !== "" && typeof sales === "number" && sales > 0){
									if(costVal !== "" && typeof cost === "number" && cost > 0){
										if(depreciationVal !== "" && typeof depreciation === "number" && depreciation > 0){
											if(residualValueVal !== "" && typeof residualValue === "number" && residualValue > 0){
												if(profitLossVal !== "" && typeof profitLoss === "number"){
													return true;
												}else{
													return false;
												}
											}else{
												return false;
											}
										}else{
											return false;
										}
									}else{
										return false;
									}
								}else{
									return false;
								}
							}else{
								return false;
							}
						}else{
							return false;
						}
					}else{
=======
			// Not using assumption variables (e.g. initial, sales...etc) to separate "0" and "empty boxes"
			// Validation should recognize when users input 0 on purpose
			/*var requiredArray  = [document.forms['keyfactors'].elements['Initial Investment'].value.split(",").join(""),
								document.forms['keyfactors'].elements['Cost of Capital'].value.split(",").join(""), 
								document.forms['keyfactors'].elements['Investment Term'].value.split(",").join(""), 
								document.forms['keyfactors'].elements['Corporate Tax Rate'].value.split(",").join(""),  
								document.forms['cashflows'].elements['Sales'].value.split(",").join(""), 
								document.forms['cashflows'].elements['Cost'].value.split(",").join("")];*/

			/*var requiredArray = [initial, costOfCapital, investmentTerm, corporateTax, 
								sales, cost, depreciation, residualValue, profitLoss];

			var positiveArray = [initial, costOfCapital, investmentTerm, corporateTax, 
								sales, cost, depreciation];*/


			function validation(){
				if(typeof initial === "number" && initial > 0){
					if(typeof costOfCapital === "number" && costOfCapital > 0){
						if(typeof investmentTerm === "number" && investmentTerm > 0){
							if(typeof corporateTax === "number" && corporateTax > 0){
								if(typeof sales === "number" && sales > 0){
									if(typeof cost === "number" && cost > 0){
										if(typeof depreciation === "number" && depreciation > 0){
											if(typeof residualValue === "number" && residualValue > 0){
												if(typeof profitLoss === "number"){
													return true;
												}else{
													return false;
												}
											}else{
												return false;
											}
										}else{
											return false;
										}
									}else{
										return false;
									}
								}else{
									return false;
								}
							}else{
								return false;
							}
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else{
					return false;
				}
			}


			/*function validation(){
				for(var i = 0; i < requiredArray.length; i++){
					if((typeof requiredArray[i]) === "number"){
							return true;
					}
				}

				for(var i = 0; i < positiveArray.length; i++){
					if(positiveArray[i] >= 0){
						return true;
					}
				}
				return false;
			}*/

			
			//文字が入っていた場合に動かなくなる...

			/*function validation(){
				for(var i = 0; i < requiredArray.length; i++){
					if((requiredArray[i] !== 0) && !requiredArray[i]){
							console.log("requiredArray false");
							return false;
					}
				}

				for(var i = 0; i < positiveArray.length; i++){
					if(positiveArray[i] < 0){
						console.log("positiveArray false");
>>>>>>> 77769160c99e8b467469ab7a4514eb28813e2fc6
						return false;
					}
				}else{
					return false;
				}
<<<<<<< HEAD
			}
=======
				return true;
			}*/


			var validationBoolean = validation();
			console.log(validationBoolean);



>>>>>>> 77769160c99e8b467469ab7a4514eb28813e2fc6

			var validationBoolean = validation();



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



			// Internal Rate of Return Calculation
			/** Internal Rate of Return is the interest rate at which the net present 
			* value of all the cash flows (both positive and negative) from a project 
			* or investment equal zero.
			*/

			function IRR(){
				// Assign values to variables "irr" and "irrNPV" as a calculation starting point 
				var irr = costOfCapital;
				var irrNPV = npv;
				
				/** If irrNPV (equivalent to npv at this moment) is zero, 
				* then that's the IRR that we want. 
				* IRR = the interest rate for NPV being zero
				*/
				if(validationBoolean){
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
				
				if(array.length > 1){
					var lastObj = array.pop();
					var secondLastObj = array.pop();

					// Calculate a remainder of the ratio (eg. 100 / (100 - (-100)) => 0.095(9.5%) for the example above)
					irr = secondLastObj['rate'] * 100 + secondLastObj['rateNPV'] / (secondLastObj['rateNPV'] - lastObj['rateNPV']);
					irr = Math.round(irr * 100) / 100;
					return irr;
				}else{
					var lastObj = array.pop();
					irr = lastObj['rateNPV'];
					irr = Math.round(irr * 100) / 100;
					return irr;
				}
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




			// Effects functions (show, hide)
			function show(el){
				el.style.display = 'block';
			}

			function hide(el){
				el.style.display = 'none';
			}
			
			
			// Result Presentation to HTML
			if(validationBoolean){
				
				// Assign NPV, PI and IRR values to each HTML element
				document.forms['calculation'].elements['Net Present Value'].value = netPresentValue();
				document.forms['calculation'].elements['Profitability Index'].value = profitIndex();
				document.forms['calculation'].elements['Internal Rate of Return'].value = IRR();

				// Declare irr variable here to avoid null
				var irr = document.forms['calculation'].elements['Internal Rate of Return'].value;

				// Document.getElementsByClassName returns an array-like object(NodeList)
				// NPV > 0, PI > 1, IRR > Cost of Capital, then good to go. 
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
				// To prompt users to check their inputs 
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

		
	
		// API Use
		// 10 Industry Portfolios (Monthly) from Quandl.com
		// 10 years data from 2005-08-31 to 2015-07-31
		var myurl = 'https://www.quandl.com/api/v3/datasets/KFRENCH/10_IND_PORTF_M.json?api_key=zygEkvv9GeTHH7Ep5M3y&start_date=2005-08-31';
		var request = new XMLHttpRequest();
		request.open('GET', myurl, true);

		request.onload = function(){
			if(request.status >= 200 && request.status < 400){
				var data = JSON.parse(request.responseText);
				
				// Create a variable to place an array for industry names
				var industry_names = data.dataset.column_names;

				// Create a variable to place an array for industry returns of 120 month
				var indexArray = data.dataset.data;

				// An arry declaration for industry return information to be contained
				// This array is used for HTML presentation
				var industryData = [];

				// Counter starts from 1 to skip "Date" in the industry_names
				for(var i = 1; i < industry_names.length; i++){
					industryData[i - 1] = {	industry: industry_names[i],
										total: 0,
										average: 0,
										median: 0};
				}

				// Row => 10 industries (Skip "0" for "Date" information)
				for(var row = 1; row <= 10; row++){
					// Local variables declaration
					var total = 0;
					var average = 0;
					
					// A variable to calculate a median
					var medianArray = [];
					
					// Column => Returns by month    indexArray.length = 120 (months)
					for(var column = 0; column < indexArray.length; column++){
						
						// Total returns for 120 months for each industry
						total += indexArray[column][row];

						// To contain data of 120 months by industry (Not by month)
						medianArray.push(indexArray[column][row]);
					}

					// Assign the local variable "total" to the industryData array's "total" property
					industryData[row - 1].total = total;

					// Average calculation
					monthlyAvg = total / indexArray.length; // Monthly (120 months)
					annualAvg = Math.round((monthlyAvg * 12) * 100) / 100; // Convert to Annually
					
					// Place the annual average data to the industryData array's "average" property
					industryData[row - 1].average = annualAvg;

					// Median calculation (Median of 120 months) 
					// An annual median by assuming the median of a month * 12
					industryData[row - 1].median = Math.round((medianCalc(medianArray) * 12) * 100) / 100;
				}
				
				
				// If a difference betwewen average and median is too big, take the median for the industry expected return
				function avgVsMedian(arr){
						
						// Here, assuming the difference greater than 3% is too big
						if(Math.abs(arr.average - arr.median) > 3){
							return arr.median;
						}else{
							return arr.average;
						}
				}

				// Median calculation
				function medianCalc(arr, fn){

					// Put an index of the half in the array
					// Array length 7 => (7 / 2) | 0 => 3
					var half = (arr.length / 2) | 0;

					// Sort the array
					var temp = arr.sort(fn);

					// If the number of the temp array values is odd...
					if(temp.length % 2){

						// Return the element in the place of the half
						// [1, 2, 3, 4, 5, 6, 7] => 4 is a median
						return temp[half];
					}

					// If the number of the temp array values is even...
					// Return the average number of the half and the [half - 1] elements
					// [1, 2, 3, 4, 5, 6] => (4 + 3) / 2 => 3.5 is a median
					return (temp[half - 1] + temp[half]) / 2;
				}
				
				// Result presentation to the HTML
				function returnPresent(arr, fn){

					// Get 'td' tag object
					var el = document.getElementsByTagName('td');
					for(var i = 0; i < arr.length; i++){
						
						// Calculate Avg vs Median and invoke a function to present results
						// to td tags in the HTML
						fn(avgVsMedian(arr[i]), el[i]);
					}
				}

				returnPresent(industryData, function(num, el){
					
					// Null and undefined check
					if(el){
						el.innerHTML = num;	
					}
				});

			}else{
				alert('Error returned from the server');
			}
		}

		request.onerror = function(){
			alert('Connection Error');
		}

		request.send();




	// Add an addEventListener to "Try again" button
	if(document.getElementById('reload') !== null){
		document.getElementById('reload').addEventListener('click', function(){
			window.location.reload();
		});
	}
	
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

