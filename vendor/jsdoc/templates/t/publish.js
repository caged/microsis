load("app/JsIO.js");
load("app/JsPlate.js");

function publish(data) {
	var file_template = new JsPlate("templates/t/example.tmpl");
	
	var output = file_template.process(data);
	print(output);
}

var t1 = {one: "red", two: "blue", three: "green"};
publish(t1);

var t2 = ['ayy', 'bee', 'cee'];
publish(t2);
