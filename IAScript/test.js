var Test = {
	Writer : require("./writer.js"),
	Ranker : require("./ranker.js"),
	when : require("when")
};

//Run a set of tests, controlling for different variables.
//The 'default' values are:
//subreddit = /r/funny
//posts ranked = 25
//time delay = 6 hours
function runTests() {
	Test.when.join(runLimitTests(), runTimeTests(), runSubTests()).then(function(){
		console.log("tests completed");
	});
}

//Attempt to identify the affect of changing the post limit on results
function runLimitTests() {
	return Test.when.join(
		new Test.Ranker().test("funny", 25, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/limit25.txt");
		}),

		new Test.Ranker().test("funny", 50, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/limit50.txt");
		}),

		new Test.Ranker().test("funny", 100, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/limit100.txt");
		})
	);
}

//Attempt to identify the affect of changing the wait delay on results
function runTimeTests() {
	return Test.when.join(
		new Test.Ranker().test("funny", 25, 1000*60*60*1).then(function(result) {
			new Test.Writer().writeTest(result, "results/time1.txt");
		}),

		new Test.Ranker().test("funny", 25, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/time6.txt");
		}),

		new Test.Ranker().test("funny", 25, 1000*60*60*12).then(function(result) {
			new Test.Writer().writeTest(result, "results/time12.txt");
		})
	);
}

//Attempt to identify impact different subs have on the results
function runSubTests() {
	return Test.when.join(
		new Test.Ranker().test("funny", 25, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/subFunny.txt");
		}),

		new Test.Ranker().test("pics", 25, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/subPics.txt");
		}),

		new Test.Ranker().test("cats", 25, 1000*60*60*6).then(function(result) {
			new Test.Writer().writeTest(result, "results/subCats.txt");
		})
	);
}

runTests();