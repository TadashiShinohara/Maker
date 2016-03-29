function run(){

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
					var monthlyAvg = total / indexArray.length; // Monthly (120 months)

					var annualAvg = Math.round((monthlyAvg * 12) * 100) / 100; // Convert to Annually
					
					// Place the annual average data to the industryData array's "average" property
					industryData[row - 1].average = annualAvg;

					// Median calculation (Median of 120 months) 
					// An annual median by assuming the median of a month * 12
					industryData[row - 1].median = Math.round((medianCalculation(medianArray) * 12) * 100) / 100;
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
				function medianCalculation(arr, fn){

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

