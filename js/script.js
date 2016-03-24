function run(){

	if(document.getElementById('calc') !== null){

		document.getElementById('calc').onclick = function(){

			// Value reset for re-calculation
			reset();


			// Place assumptions to variables
			// Use Number and parseXXX methods for type casting
			
			// Key Factors

			// 1. Initial Investment
			var initial = Number(initializer(document.getElementById('input-10')));
			
			// 2. Cost of Capital
			var costOfCapital = parseFloat(initializer(document.getElementById('input-11')) / 100);
			
			// 3. Investment Term(Year)
			var investmentTerm = Number(initializer(document.getElementById('input-12')));
			
			// 4. Coporate Tax Rate
			var corporateTax = parseFloat(initializer(document.getElementById('input-13')) / 100);
			
			// 5. Method of Depreciation => Straight-Line

			
			
			// Annual Cash Flows - Before Tax
			
			// 1, 2. Sales and Cost(Annual Economic Effect)
			// Place "after-tax" calculation results
			var sales = Number(initializer(document.getElementById('input-15')) * (1 - corporateTax));
			
			var cost = Number(initializer(document.getElementById('input-16')) * (1 - corporateTax));
			
			// 3. Annual Tax Shield from Depreciation(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			var depreciation = Number(initializer(document.getElementById('input-17')) * corporateTax);
			
			// 4. Residual Value => Cash equivalent value on disposal
			// No tax effect occurs due to the nature of transactions (simply in exchange of disposal assets)
			var residualValue = Number(initializer(document.getElementById('input-18')));
			
			// 5. Tax Shield from Profit/Loss on Assets Sales(Non-monetary item)
			// Tax Shield calculation = Profit/Loss(Expenses) * Tax Rate
			// Profit => -(Cash OutFlow), Loss => +(Cash InFlow)
			var profitLoss = Number(initializer(document.getElementById('input-19')) * corporateTax);
			



			// Calculation based on assumptions

			// Annual Cash Flow calculation
			var annualCF = (sales - cost) + depreciation;

			// Cash Flow upon Termination
			var termination = residualValue + profitLoss;


			// Function to calculate Present Value
			// The function calculates discounted values by using 
			// Cost of Capital and Invetment Periods
			function pvCalc(rate, term){
				
				// Present Value variable declaration
				var pv = 0;

				// Present Value from Annual Cash Flow
				for(var i = 1; i <= term; i++){
					pv += annualCF * (1 / Math.pow(1 + rate, i));
				}

				// Present Value from Termination
				pv += termination * (1 / Math.pow(1 + rate, term));

				return pv;
			}


			// Function to calculate Net Present Value
			// NPV = PV - Initial
			function netPresentValue(rate, term, initialAmount){
				
				// Net Present Value variable declaration
				var npv = 0;

				var pvResult = pvCalc(rate, term);
				
				// Here, the pvResult is the present value of cash flows from the investment, 
				// and if it's zero, the investment doesn't generate any cash flows. 
				
				npv = Math.round(pvResult - initialAmount);
				return npv;
			}


			// Function to calculate Profitability Index
			// PI = PV / Initial
			function profitIndex(pv, initialAmount){

				// Profitability Index variable declaration
				var pIndex = 0;

				// Move the floating point and then round the number
				pIndex = Math.round((pv / initialAmount) * 100) / 100;
				
				if(pIndex){
					return pIndex;
				}else{
					return 'N/A';
				}	
			}


			// Internal Rate of Return Calculation
			/** Internal Rate of Return is the interest rate at which the net present 
			* value of all the cash flows (both positive and negative) from a project 
			* or investment equal zero.
			*/

			function initialEstimate(){
				
				// Assign values to variables "irr" and "irrNPV" as a calculation starting point 
				var irr = costOfCapital;
				var irrNPV = netPresentValue(costOfCapital, investmentTerm, initial);

				
				/** If irrNPV (equivalent to npv at this moment) is zero, 
				* then that's the IRR that we want. 
				* IRR = the interest rate for NPV being zero
				*/
				if(irrNPV === 0){
					return Math.round(irr * 100) / 100;
				}else{
					return irrCalc(irr, investmentTerm, irrNPV);
				}

			}

				
			function irrCalc(irr, term, irrNPV){
				var array = [];
				var rateNPV = irrNPV;
				
				// Adjust the temporary IRR by 0.01 and search values
				// irrNPV > 0 means irr is greater than the current rate
				// Else if for two cases (irrNPV > 0 or not)
				if(irrNPV > 0){
					for(var i = 0; ; i++){
						
						irr += 0.01;

						// Calculate NPV by the adjusted IRR
						rateNPV = netPresentValue(irr, term, initial);

						// Place the adjusted IRR and NPV combination as a pair-value object in the array
						array[i] = {rate: irr, 
									rateNPV: rateNPV };

						// If the present value from the cahs flows is zero, 
						// IRR cannot be calculated because IRR is the interest rate at which 
						// the present cash flows equal the initial amount. 

						// So the present value is zero, the stack overflow will occur 
						// since the initial amount remains the same and 
						// (0 (PV) - initial (constant)) will be the same amount forever
						// and will never get out of the loop. 

						// Check first if rateNPV equals initial
						// NPV = Cash Flow Present Value - Investment Initial Amount
						// So if rateNPV equals initial, the cashflow present value is zero.
						// In that case, the function returns 'N/A'. 

						if(rateNPV === (-initial)){
							return 'N/A'

						// Break the loop if the NPV is equal to or less than zero
						}else if(rateNPV <= 0){
							return irrRateCalc(array);
						}
					}
				}else{
					for(var i = 0; ; i++){
						
						irr -= 0.01;

						rateNPV = netPresentValue(irr, term, initial);
						
						array[i] = {rate: irr, 
									rateNPV: rateNPV };

						if(rateNPV === (-initial)){
							return 'N/A';
						
						// Break the loop if the NPV is equal to or greater than zero
						}else if(rateNPV >= 0){
							return irrRateCalc(array);
						}
					}
				}
			}


			function irrRateCalc(array){
				
				/** IRR is between last object's NPV and second-to-last one's.
				* For example, Second-to-Last => {rate: 0.09, rateNPV: 100} Last => {rate: 0.10, rateNPV: -100}
				* rateNPV zero (=IRR) is between 0.09 and 0.10.
				*/


				// No need to check the length of the array because the array length is two or more
				var lastObj = array.pop();
				var secondLastObj = array.pop();

				var irr = 0;

				if(lastObj.rate > secondLastObj.rate){
					
					/** For example, Second-to-Last => {rate: 0.09, rateNPV: 100} Last => {rate: 0.10, rateNPV: -100}
					* rateNPV zero (=IRR) is between 0.09 and 0.10.
					*/

					// Calculate a remainder of the ratio (eg. 0.09 * 100 + 100 / (100 - (-100)) => 9.5 for the example above)
					irr = secondLastObj.rate * 100 + secondLastObj.rateNPV / (secondLastObj.rateNPV - lastObj.rateNPV);
					irr = Math.round(irr * 100) / 100;
					return irr;
				}else{

					/** For example, Second-to-Last => {rate: 0.10, rateNPV: -100} Last => {rate: 0.09, rateNPV: 100}
					* rateNPV zero (=IRR) is between 0.09 and 0.10.
					*/

					// Calculate a remainder of the ratio (eg. 0.09 * 100 + 100 / (100 - (-100)) => 9.5 for the example above)
					irr = lastObj.rate * 100 + lastObj.rateNPV / (lastObj.rateNPV - secondLastObj.rateNPV);
					irr = Math.round(irr * 100) / 100;
					return irr;
				}
			}


			

			var validationBoolean = validation(document.forms);

			// Result Presentation to HTML
			if(validationBoolean){
				
				var pv = pvCalc(costOfCapital, investmentTerm);
				var npv = netPresentValue(costOfCapital, investmentTerm, initial);
				var pIndex = profitIndex(pv, initial);
				var irr = initialEstimate();

				// Assign NPV, PI and IRR values to each HTML element
				document.getElementById('input-20').value = npv;
				document.getElementById('input-21').value = pIndex;
				document.getElementById('input-22').value = irr;

				// Document.getElementsByClassName returns an array-like object(NodeList)
				// NPV > 0, PI > 1, IRR > Cost of Capital, then good to go. 
				if(npv > 0 && pIndex > 1 && irr > costOfCapital){
					
					hide(document.getElementsByClassName('result')[0]);
					show(document.getElementsByClassName('result go')[0]);
					hide(document.getElementsByClassName('comment')[0]);
					show(document.getElementsByClassName('comment go')[0]);

				}else{
					
					hide(document.getElementsByClassName('result')[0]);
					show(document.getElementsByClassName('result nogo')[0]);
					hide(document.getElementsByClassName('comment')[0]);
					show(document.getElementsByClassName('comment nogo')[0]);

				}

			}else{
				
				// To prompt users to check their inputs 
				show(document.getElementById('errorDiv'));
			}
			
		};
	}


	// Validation Function
	function validation(obj){
				
		for(var i = 0; i < obj.length; i++){

			// Ignore the reset elements of the forms for validation
			for(var j = 0; j < obj[i].length - 1; j++){
						
				// Blank check
				if(obj[i][j].value.trim() === ''){
					return false;
				}

				// NaN check
				if(isNaN(Number(obj[i][j].value))){
					return false;
				}
			}
		}

		// Key Factor must be greater than or equal to zero
		for(var i = 0; i < obj[0].length - 1; i++){
			if(Number(obj[0][i].value) <= 0){
				return false;
			}
		}

		// Cash Flows must be greater than zero except for Profit/Loss on Asset Sales
		for(var i = 0; i < obj[1].length - 2; i++){
			if(Number(obj[1][i].value) < 0){
				return false;
			}
		}

		return true;
	}
	

	// Value reset for re-calculation
	function reset(){

		objEach(document.getElementsByClassName('input__field--indicator'), function(element){
			element.value = '';
		});

		// Hide the error message for re-calculation
		hide(document.getElementById('errorDiv'));
			
		// Reset the comments for re-calculation
		show(document.getElementsByClassName('result')[0]);
		show(document.getElementsByClassName('comment')[0]);
		hide(document.getElementsByClassName('result go')[0]);
		hide(document.getElementsByClassName('comment go')[0]);
		hide(document.getElementsByClassName('result nogo')[0]);
		hide(document.getElementsByClassName('comment nogo')[0]);
	}



	// Eliminate commas when users input them => split(",").join("")
	function initializer(element){
		return element.value.split(',').join('');
	}
	

	function objEach(element, fn){
		for(var i = 0; i < element.length; i++){
			fn(element[i]);
		}
	}

	// Effects Functions (show, hide)
	function show(el){
		el.style.display = 'block';
	}

	function hide(el){
		el.style.display = 'none';
	}
	


	// API Use
	// 10 Industry Portfolios (Monthly) from Quandl.com
	// 10 years data from 2005-08-31 to 2015-07-31
	(function(){

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

	})();


	// Add an addEventListener to "Try again" button
	if(document.getElementById('reload') !== null){
		document.getElementById('reload').addEventListener('click', function(){
			window.location.reload();
		});
	}


	(function(){
				
		// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
		if (!String.prototype.trim){
			(function(){
						
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
					return this.replace(rtrim, '');
				};
			})();
		}

		[].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl){
					
			// in case the input is already filled..
			if(inputEl.value.trim() !== ''){
				classie.add(inputEl.parentNode, 'input--filled');
			}

			// events:
			inputEl.addEventListener('focus', onInputFocus);
			inputEl.addEventListener('blur', onInputBlur);
		});

		function onInputFocus(ev){
			classie.add(ev.target.parentNode, 'input--filled');
		}

		function onInputBlur(ev){
			if(ev.target.value.trim() === ''){
				classie.remove(ev.target.parentNode, 'input--filled');
			}
		}
	})();

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

