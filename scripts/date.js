// makeDate script

// function that makes formatted date for scraped data
const makeDate = function(){
	//save current date to d
	const d = new Date();
	// prepare empty string for formatted state
	const formattedDate = "";
	// take string and concatenate current month of d
	formattedDate += (d.getMonth() + 1) + "_";
	// get number of day in month from d and concatenate it to formatted date string
	formattedDate += d.getDate() + "_";
	// get full year and add to formatted date string
	formattedDate += d.getFullYear();
	// return formatted date
	return formattedDate;
};

// export makeDate function so other backend files can use
module.exports = makeDate;