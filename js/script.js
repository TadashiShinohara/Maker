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
			
			
			// Array for Key Factor validation
			var validationArray1 = [initial, costOfCapital, investmentTerm, corporateTax];

			
			
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
			

			// Array for Annual Cash Flow validation
			var validationArray2 = [sales, cost, depreciation, residualValue];



			// Calculation based on assumptions

			// Annual Cash Flow calculation
			var annualCF = calcModule.annualCashFlow(sales, cost, depreciation);

			// Cash Flow upon Termination
			var termination = calcModule.terminationCalculation(residualValue, profitLoss);
			


			// Input form validation
			var validationBoolean = validation(document.forms, validationArray1, validationArray2);


			// Result Presentation to HTML
			if(validationBoolean){
				
				var pv = calcModule.pvCalculation(costOfCapital, investmentTerm, annualCF, termination);
				var npv = calcModule.netPresentValue(pv, initial);
				var pIndex = calcModule.profitIndex(pv, initial);
				var irrInitialGuess = calcModule.initialEstimate(costOfCapital, pv, initial);

				var irr = '';

				if(!irrInitialGuess){
					irr = calcModule.irrCalculation(npv, costOfCapital, investmentTerm, annualCF, termination, initial);
 				}else{
					irr = irrInitialGuess;
				}

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
	function validation(obj, array1, array2){
				
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
		var filtered1 = array1.filter(function(value){
			return value <= 0;
		});

		// Cash Flows must be greater than zero except for Profit/Loss on Asset Sales
		var filtered2 = array2.filter(function(value){
			return value < 0;
		});


		if(filtered1.length || filtered2.length){
			return false;
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

