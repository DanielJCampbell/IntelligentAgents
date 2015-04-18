var Test = {
	Writer : require("./writer.js"),
	Ranker : require("./ranker.js")
};

function runTests() {

}

function runLimitTests() {
	
}
new Test.Ranker().test("funny", 25, 0).then(function(result) {
	new Test.Writer().writeTest(result, "test.txt");
});