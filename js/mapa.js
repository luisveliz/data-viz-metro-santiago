
var svg;
var viewport;
var background;
var container;
var stations;
var container_santiago;
var container_map;
var container_lines;
var container_stations;
var lines;
var projection;
var json_trafico;
var get_trafic;
var scale;
var stations;
var all_min=1000000000;
var all_max=0;
var all_median=0;

var min, max, median;

var morning_media = [];//{"stations":[]};
var afternoon_media = [];
var total_dia = [];
var min_total_dia = 0;
var media_total_dia = 0;
var max_total_dia = 0;

var mmedia=0;
var amedia=0;
var aux_total = 0;

var freq_array = [];

var morning = false;
var afternoon = false;
var total = false;

$(document).ready(function(){
	
	//console.log("mapa.js");
	
	svg = d3.select("#map-container").append("svg")
		// The viewport
		.attr("viewBox", "-100 -90 200 200")
		// Width and height of the svg (will be resized)
		.attr("preserveAspectRatio", "xMidYMid meet").attr("id", "map");
	
	viewport = svg.append("g").attr("id", "viewport").attr("transform", "scale(0.75)").call(d3.behavior.zoom().scale(0.75).scaleExtent([0.75, 1.5]).on("zoom", function() {
		viewport.attr("transform",
		//" translate(" + d3.event.translate + ")" +
		" scale(" + d3.event.scale + ")");
	}));
	//var background = viewport.append("rect").attr("class", "background").attr("x", -1000).attr("y", -1000).attr("width", 2000).attr("height", 2000)
	background = viewport.append("rect").attr("class", "background").attr("x", -500).attr("y", -500).attr("width", 1000).attr("height", 1000)
	//.on("click", click)
	;
	
	container = viewport.append("g").attr("id", "container");

	d3.json("json/santiago_alltrafic.json", function(data) {
		container_santiago = container.append("g").attr("id", "santiago");
		container_map = container.append("g").attr("class", "map");
		container_lines = container_map.append("g").attr("id", "lines");
		container_stations = container_map.append("g").attr("id", "stations");
	
		freq = d3.map(data.freq).values();
		//console.log("freq.length"+freq.length);
		
		/************************************************/
		var count = 0;
		for(var i=0;i<freq.length;i++){
			//morning_media[i] = 0;
			//afternoon_media[i] = 0;
			mmedia = 0;
			amedia = 0;
			aux_total = 0;
			
			freq_array[i]=(freq[i].trafic);
			
			for(var j=0;j<freq[i].trafic.length;j++){
				if(parseInt(freq[i].trafic[j]) < all_min){
					all_min = parseInt(freq[i].trafic[j]); 
				}
				if(parseInt(freq[i].trafic[j]) > all_max){
					all_max = parseInt(freq[i].trafic[j]); 
				}
				all_median += parseInt(freq[i].trafic[j]);
				
				//console.log("parseInt(freq[i].trafic[j])"+parseInt(freq[i].trafic[j]));
				
				//mañana
				if(j>0 && j<9){
					mmedia += parseInt(freq[i].trafic[j]);
					if(freq[i].key=="TB"){
						//console.log("mmedia:"+mmedia);
						//console.log(freq[i].key+" trafic"+parseInt(freq[i].trafic[j]));
					}
					//console.log(freq[i].key+" morning_media:"+mmedia);
				}else if(j>21 && j<30){
					amedia += parseInt(freq[i].trafic[j]);
					//console.log(freq[i].key+" afternoon_media:"+afternoon_media[i]);
				}
				aux_total += parseInt(freq[i].trafic[j]);
				count++;
			}
			mmedia /= 8;
			amedia /= 8;
			//console.log(freq[i].key+" morning_media:"+mmedia);
			//console.log(freq[i].key+" afternoon_media:"+amedia);
			morning_media.push({"key":freq[i].key, "morning_media":mmedia});
			afternoon_media.push({"key":freq[i].key, "afternoon_media":amedia});
			total_dia.push({"key":freq[i].key, "total":aux_total});
			
			if(min_total_dia>aux_total){
				min_total_dia = aux_total;
			}
			if(max_total_dia<aux_total){
				max_total_dia = aux_total;
			}
			media_total_dia += aux_total;
			
			//console.log(freq[i].trafic.length);
		}
		//console.log(morning_media);
		//console.log(afternoon_media);
		
		media_total_dia /= 100;
		all_median /= count;  
		/**************************************************/
		lines = data.lines;
	
		var median_x = d3.median(freq, function(e) {
			return e.latitude;
		});
		var median_y = d3.median(freq, function(e) {
			return e.longitude;
		}) - 0.03;
	
		// https://github.com/mbostock/d3/wiki/Geo-Projections#wiki-center
		projection = d3.geo.mercator().translate([0, 0]).scale(50000).center([median_x, median_y]);
	
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
			container_santiago.append("path").attr("d", line(santiago[i]["coords"])).attr("class", klass);
		}
	
		// Stuff needed to scale stations depending on their trafic
		//var value=0;
		get_trafic = function(e) {
			return parseInt(e.trafic[hour]);
		};
		min = d3.min(freq, get_trafic);
		max = d3.max(freq, get_trafic);
		median = d3.median(freq, get_trafic);
		
		$('#min').html(min);
		$('#media').html(median);
		$('#max').html(max);
		
		//console.log("min:"+all_min);
		//console.log("max:"+all_max);
		//console.log("median:"+all_median);
		//var scale = d3.scale.log().domain([min, median, max]).range([0.2, 1.2, 4]);
		//scale = d3.scale.log().domain([min, median, max]).range([0.2, 1.2, 4]);
		scale = d3.scale.linear().domain([all_min, all_median, all_max]).range([0.3, 5, 10]);	
		
		// Create the stations by first creating a group
		stations = container_stations.selectAll(".station").data(freq, function(d) {
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
	
		lines = container_lines.selectAll(".line").data(lines).enter().append("g").attr("class", line_class);
	
		lines.selectAll(".line_branch").data(gen_branch).enter().append("path").attr("class", branch_class).attr("d", draw_line(data, projection)).on("mouseover", select_line).on("mouseout", deselect_line);
	
	/*var _gaq = _gaq || [];
	    _gaq.push(['_setAccount', 'UA-21325121-6']);
	    _gaq.push(['_trackPageview']);
	
	    (function() {
	     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	     })();*/
	}); 		
	
	var offset = $("#map-container").offset();
	$("#interval").css("top", (offset.top+50)+"px");
	$("#interval").css("left", (offset.left+40)+"px");
	
	$("#interval").html("5:30 - 6:00 hrs.");
	

});

function draw(){
	//console.log("draw");
	$("#stations").empty();
	
	
	//console.log("trafic[hour]"+freq[0].trafic[hour]);
	// Stuff needed to scale stations depending on their trafic
	//var value=0;
	get_trafic = function(e) {
		return parseInt(e.trafic[hour]);
	};
	min = d3.min(freq, get_trafic);
	max = d3.max(freq, get_trafic);
	median = d3.median(freq, get_trafic);
	
	$('#min').html(min);
	$('#media').html(median);
	$('#max').html(max);
	//var scale = d3.scale.log().domain([min, median, max]).range([0.2, 1.2, 4]);
	//scale = d3.scale.log().domain([min, median, max]).range([0.2, 1.2, 4]);
	//scale = d3.scale.linear().domain([min, median, max]).range([1, 2, 4]);
	if(total){
		scale = d3.scale.linear().domain([min_total_dia, media_total_dia, max_total_dia]).range([0.3, 5, 10]);
	}else{
		scale = d3.scale.linear().domain([all_min, all_median, all_max]).range([0.3, 5, 10]);	
	}
	
	// Create the stations by first creating a group
	stations = container_stations.selectAll(".station").data(freq, function(d) {
		return d.key;
	}).enter().append("g")
	
	// Translate the group (helpers.js)
	.attr("transform", transform(projection))
	// helpers.js
	.attr("class", station_classes)
	// Sort the points by trafic to have
	// bigger stations behind (helpers.js)
	.sort(sort_stations).on("mouseenter", select_station).on("mouseleave", deselect_station);;

	// Then append an arc for each part
	stations.selectAll(".station_part").data(gen_pie(scale)).enter().append("path").attr("d", draw_arc)// helpers.js
	.attr("class", station_part_classes)// helpers.js
	;
	
	var offset = $("#map-container svg").offset();
	$("#interval").css("top", (offset.top+50)+"px");
	$("#interval").css("left", (offset.left+40)+"px");
	
	
	//stations.on("mouseenter", select_station).on("mouseleave", deselect_station);
}

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

