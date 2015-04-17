function Page() {
	this.Ranker = require("./ranker.js")
}

Page.prototype.tab = function(tab) {
	var elem = document.getElementById(tab);
	if (elem.getAttribute("active") === false) {
		elem.setAttribute("active", true);
		if (tab === "predict") {
			document.getElementById("experiment").setAttribute("active", false);
			document.getElementById("experimentDiv").style.display = "none";
			document.getElementById("predictDiv").style.display = "initial";
		}
		else {
			document.getElementById("predict").setAttribute("active", false);
			document.getElementById("experimentDiv").style.display = "initial";
			document.getElementById("predictDiv").style.display = "none";
		}
	}
};

var page = new Page();