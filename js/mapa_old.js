
var svg;
$(document).ready(function(){
	
	//var width = 100, height = 100;
	
	console.log("main.js");
	
	svg = d3.select("#map-container").append("svg")
	// The viewport
	.attr("viewBox", "-100 -100 200 200")
	// Width and height of the svg (will be resized)
	.attr("preserveAspectRatio", "xMidYMid meet").attr("id", "map");
	
	var viewport = svg.append("g").attr("id", "viewport").attr("transform", "scale(0.75)").call(d3.behavior.zoom().scale(0.75).scaleExtent([0.75, 1.5]).on("zoom", function() {
		viewport.attr("transform",
		//" translate(" + d3.event.translate + ")" +
		" scale(" + d3.event.scale + ")");
	}))
	//var background = viewport.append("rect").attr("class", "background").attr("x", -1000).attr("y", -1000).attr("width", 2000).attr("height", 2000)
	var background = viewport.append("rect").attr("class", "background").attr("x", -500).attr("y", -500).attr("width", 1000).attr("height", 1000)
	//.on("click", click)
	;
	
	var container = viewport.append("g").attr("id", "container");

	d3.json("../json/santiago_nuevo.json", function(data) {
		container_santiago = container.append("g").attr("id", "santiago");
		container_map = container.append("g").attr("class", "map");
		container_lines = container_map.append("g").attr("id", "lines");
		container_stations = container_map.append("g").attr("id", "stations");
	
		freq = d3.map(data.freq).values();
		lines = data.lines;
	
		var median_x = d3.median(freq, function(e) {
			return e.latitude;
		});
		var median_y = d3.median(freq, function(e) {
			return e.longitude;
		}) - 0.03;
	
		// https://github.com/mbostock/d3/wiki/Geo-Projections#wiki-center
		var projection = d3.geo.mercator().translate([0, 0]).scale(50000).center([median_x, median_y]);
	
		// Function to project the santiago borders in drawing coordinates
		for (var i = 0; i < santiago.length; ++i) {
			var line = d3.svg.line(santiago[i]["coords"]).interpolate("linear").x(function(d) {
				return projection(d)[0];
			}).y(function(d) {
				return projection(d)[1];
			});
	
			var klass = "santiago " + santiago[i]["name"];
			if (i != 0)
				klass += " province";
	
			// Create Santiago's borders
			container_santiago.append("path").attr("d", line(santiago[i]["coords"])).attr("class", klass)
			;
		}
	
		// Stuff needed to scale stations depending on their trafic
		var get_trafic = function(e) {
			return e.trafic;
		};
		var min = d3.min(freq, get_trafic);
		var max = d3.max(freq, get_trafic);
		var median = d3.median(freq, get_trafic);
		var scale = d3.scale.log().domain([min, median, max]).range([0.2, 1.2, 4]);
	
		// Create the stations by first creating a group
		var stations = container_stations.selectAll(".station").data(freq, function(d) {
			return d.key;
		}).enter().append("g")
		// Translate the group (helpers.js)
		.attr("transform", transform(projection))
		// helpers.js
		.attr("class", station_classes)
		// Sort the points by trafic to have
		// bigger stations behind (helpers.js)
		.sort(sort_stations).on("mouseover", select_station).on("mouseout", deselect_station);
	
		// Then append an arc for each part
		stations.selectAll(".station_part").data(gen_pie(scale)).enter().append("path").attr("d", draw_arc)// helpers.js
		.attr("class", station_part_classes)// helpers.js
		;
	
		var lines = container_lines.selectAll(".line").data(lines).enter().append("g").attr("class", line_class);
	
		lines.selectAll(".line_branch").data(gen_branch).enter().append("path").attr("class", branch_class).attr("d", draw_line(data, projection)).on("mouseover", select_line).on("mouseout", deselect_line);
	}); 
	
	/*var _gaq = _gaq || [];
	    _gaq.push(['_setAccount', 'UA-21325121-6']);
	    _gaq.push(['_trackPageview']);
	
	    (function() {
	     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	     })();*/


});


function color(d, inv) {
	var color;
	if (d.lines.length == 1) {
		var l = d.lines[0];
		if (l.toString().indexOf("bis") !== -1)
			color = colors[parseInt(l)];
		else
			color = colors[l];
	} else {
		color = inv ? "0,0,0" : "255,255,255";
	}
	return "rgb(" + color + ")";
}

