


var linenb_class = function(d) { return "line_" + d; };

/********** STATION HELPERS ***********/

// Create the classes for a station
var station_classes = function(e) { 
  return "active station " + e.lines.map(linenb_class).join(" ");
};
var station_part_classes = function(d) {
  return "active station_part " + linenb_class(d.line);
}

// Create the transformation for stations
var transform = function(projection) {
  return function(d) {
    return "translate(" + projection([d.latitude, d.longitude]) + ")";
  };
};

// Create objects suitable for d3.svg.arc
var pie = d3.layout.pie()
                   .sort(null);

// Create an arc. Use the argument to create the radius
var draw_arc = function(d) {
  return d3.svg.arc()
    .innerRadius(0)
    .outerRadius(d.r)
    (d);
};

// Transform a station object into an object suitable for arc
var gen_pie = function(scale) {
  return function(d,j) {
    var res = pie(d.lines.map(function() { return 1; }));
    res.map(function(e, i) { 
    	
    	//console.log("d.key:"+d.key+" d.lines[i]"+d.lines[i]+" j:"+j);
    	
    	e["line"] = d.lines[i]; 
    	//e["r"] = scale(d.trafic_avg);
    	
    	if(morning){
    		var avg = 0;
    		for(var i=0;i<morning_media.length;i++){
    			
    			if(morning_media[i].key==d.key){
    				avg = morning_media[i].morning_media;
    				//console.log("morning_media[i].key:"+morning_media[i].key);
    			}
    		}
    		e["r"] = scale(avg);
    		//console.log("d.key:"+d.key+" avg:"+avg);
    		
    		
    	}else if(afternoon){
    		var avg = 0;
    		for(var i=0;i<afternoon_media.length;i++){

    			if(afternoon_media[i].key==d.key){
    				avg = afternoon_media[i].afternoon_media;
    				//console.log("afternoon_media[i].key:"+afternoon_media[i].key);
    			}
    		}
    		
    		e["r"] = scale(avg);
    		//console.log("d.key:"+d.key+" avg:"+avg);
    		
    	}else if (total){
			for(var i=0;i<total_dia.length;i++){
    			if(total_dia[i].key==d.key){
    				e["r"] = scale(total_dia[i].total);
    				//console.log("total");
    			}
    		}
    	}else{
    		e["r"] = scale(d.trafic[hour]);
    	}
    	//console.log("d.trafic:"+d.trafic[hour]);
      return e;
    });
    return res;
  };
};

var sort_stations = function(d1, d2) {
  return parseInt(d1.trafic[hour]) < parseInt(d2.trafic[hour]);
};


/************ LINES ***************/
var line = d3.svg.line()
                 .interpolate("linear");


var draw_line = function(data, projection) {
  return function(d) {
    var points = d.paths.map(function(s) { 
      return projection([data.freq[s].latitude, data.freq[s].longitude]);
    });
    return line(points);
  };
};

var line_class = function(d) { 
  return "active line " + linenb_class(d.key);
}

var gen_branch = function(d) {
  return d.paths.map(function(p) { return {"key": d.key, "paths": p}; });
}

var branch_class = function(d) {
  return "active line_branch " + linenb_class(d.key);
}
