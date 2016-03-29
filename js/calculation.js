var calcModule = (function(){

	var calculator = {

		// Annual Cash Flow calculation
		annualCashFlow: function(sales, cost, depreciation){
			var annualCF = (sales - cost) + depreciation;
			return annualCF;
		},


		// Cash Flow upon Termination
		terminationCalculation: function(residualValue, profitLoss){
			var termination = residualValue + profitLoss;
			return termination;
		},


		// Function to calculate Present Value
		// The function calculates discounted values by using 
		// Cost of Capital and Invetment Periods
		pvCalculation: function(rate, term, annualCF, termination){
				
			// Present Value variable declaration
			var pv = 0;

			// Present Value from Annual Cash Flow
			for(var i = 1; i <= term; i++){
				pv += annualCF * (1 / Math.pow(1 + rate, i));
			}

			// Present Value from Termination
			pv += termination * (1 / Math.pow(1 + rate, term));

			return pv;
		},



		// Function to calculate Net Present Value
		// NPV = PV - Initial
		netPresentValue: function(pv, initialAmount){
				
			// Net Present Value variable declaration
			var npv = 0;

			// Here, the pv is the present value of cash flows from the investment, 
			// and if it's zero, the investment doesn't generate any cash flows. 
				
			npv = Math.round(pv - initialAmount);
			return npv;
		},


		// Function to calculate Profitability Index
		// PI = PV / Initial
		profitIndex: function(pv, initialAmount){

			// Profitability Index variable declaration
			var pIndex = 0;

			// Move the floating point and then round the number
			pIndex = Math.round((pv / initialAmount) * 100) / 100;
				
			if(pIndex){
				return pIndex;
			}else{
				return 'N/A';
			}	
		},


		// Internal Rate of Return Calculation
		
		/** Internal Rate of Return is the interest rate at which the net present 
		* value of all the cash flows (both positive and negative) from a project 
		* or investment equal zero.
		*/
		initialEstimate: function(rate, pv, initial){
				
			// Assign values to the variables "irr" and "irrNPV" as a calculation starting point 
			var irr = rate;
			var irrNPV = this.netPresentValue(pv, initial);

				
			/** If irrNPV (equivalent to npv at this moment) is zero, 
			* then that's the IRR that we want. 
			* IRR = the interest rate for NPV being zero
			*/
			if(irrNPV === 0){
				return Math.round(irr * 100) / 100;
			}else{
				return false;
			}
		},


		
		// Adjust the temporary IRR by 0.01 and search values
		// irrNPV > 0 means irr is greater than the current rate
		// Else if for two cases (irrNPV > 0 or not)
		irrCalculation: function(npv, irr, term, annualCF, termination, initial){
			
			var array = [{rate: irr, rateNPV: npv}];
				
			if(npv > 0){
				for(var i = 1; ; i++){
						
					irr += 0.01;

					var pv = this.pvCalculation(irr, term, annualCF, termination);

					// Calculate NPV by the adjusted IRR
					rateNPV = this.netPresentValue(pv, initial);

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
						return this.irrRateCalculation(array);
					}
				}
			}else{
				for(var i = 1; ; i++){
						
					irr -= 0.01;

					var pv = this.pvCalculation(irr, term, annualCF, termination);

					rateNPV = this.netPresentValue(pv, initial);
						
					array[i] = {rate: irr, 
								rateNPV: rateNPV };

					if(rateNPV === (-initial)){
						return 'N/A';
						
					// Break the loop if the NPV is equal to or greater than zero
					}else if(rateNPV >= 0){
						return this.irrRateCalculation(array);
					}
				}
			}
		},


		/** IRR is between last object's NPV and second-to-last one's.
		* For example, Second-to-Last => {rate: 0.09, rateNPV: 100} Last => {rate: 0.10, rateNPV: -100}
		* rateNPV zero (=IRR) is between 0.09 and 0.10.
		*/
		irrRateCalculation: function(array){
				
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
		},

	};

	return calculator;

})();




