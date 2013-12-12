function numberWithCommas(x) {
  //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

var select_station = function(station) {
	//console.log(station);
  svg.selectAll(".line_branch, .station").classed("active", false);
  
  $(station.lines).each(function(i, e) {
    svg.selectAll(".line_branch.line_" + e + ", .station.line_" + e )
    .classed("active", true);
  });
  //$(".help").hide();
  //$(".infos_station").show();
  //$(".infos_station h3 span").html(station.name);
  //$(".infos_station .trafic").html(numberWithCommas(station.trafic_avg));
  //$(".infos_station .trafic").html(numberWithCommas(station.trafic[hour]));
  //$(".infos_station .latitude").html(station.latitude);
  //$(".infos_station .longitude").html(station.longitude);
  //$(".infos_station .rank").html(station.rank);
  
  $("#tooltip").css("display","block");
  $("#tooltip").css("top",(d3.event.pageY-100)+"px");
  $("#tooltip").css("left",(d3.event.pageX+40)+"px");
  $("#station_name").html(station.name);
  
  
  $("#station_trafic").html(numberWithCommas(station.trafic[hour]));
  
  
  if(morning){
	  var avg = 0;
		for(var i=0;i<morning_media.length;i++){
			if(morning_media[i].key==station.key){
				avg = morning_media[i].morning_media;
				//console.log("morning_media[i].key:"+morning_media[i].key+" avg:"+avg);
			}
		}
		$("#station_trafic").html(numberWithCommas(parseInt(avg)));
		
  }
  
  if(afternoon){
	  var avg = 0;
		for(var i=0;i<afternoon_media.length;i++){
			if(afternoon_media[i].key==station.key){
				avg = afternoon_media[i].afternoon_media;
				//console.log("afternoon_media[i].key:"+afternoon_media[i].key+" avg:"+avg);
			}
		}
		$("#station_trafic").html(numberWithCommas(parseInt(avg)));
  }
  if(total){
	  var aux = 0;
	  for(var i=0;i<total_dia.length;i++){
			if(total_dia[i].key==station.key){
				aux = total_dia[i].total;
				//console.log("afternoon_media[i].key:"+afternoon_media[i].key+" avg:"+avg);
			}
		}
		$("#station_trafic").html(numberWithCommas(parseInt(aux)));
  }
  
    
  
  
  
  $("#station_lat").html(station.latitude);
  $("#station_lon").html(station.longitude);
  $("#station_rank").html(station.rank-1);
  
  //console.log("mouseenter");
  
};

var deselect_station = function(station) {
  svg.selectAll(".line_branch, .station")
     .classed("active", true);
  //$(".help").show();
  //$(".infos_station").hide();
  $("#tooltip").css("display","none");
  //console.log("mouseout");
};

var select_line = function(line) {
  svg.selectAll(".line_branch, .station")
     .classed("active", false);
  svg.selectAll(".line_branch.line_" + line.key + ", .station.line_" + line.key )
    .classed("active", true);
  //$(".help").hide();
  //$(".infos_line").show();
  //$(".infos_line h3 span").html("Ligne <span class='sign line_" + line.key + "'>" + line.key + "</line>");
  var sum = 0;
  var ul = $(".infos_line ul");
  ul.empty();
  //$(svg.selectAll(".station.line_" + line.key).sort(function(x1, x2) { return x1.trafic_avg < x2.trafic_avg }).data()).each(function(i, e) {
  $(svg.selectAll(".station.line_" + line.key).sort(function(x1, x2) { return x1.trafic[hour] < x2.trafic[hour] }).data()).each(function(i, e) {
    //ul.append('<li>' + e.name + "&nbsp;: " + '' + numberWithCommas(e.trafic_avg) + "</li>");
	  ul.append('<li>' + e.name + "&nbsp;: " + '' + numberWithCommas(e.trafic[hour]) + "</li>");
	  //sum += e.trafic_avg;
	  sum += e.trafic[hour];
  });
  //$(".infos_line .trafic").html(numberWithCommas(sum));
};

var deselect_line = function(line) {
  svg.selectAll(".line_branch, .station")
     .classed("active", true);
  //$(".help").show();
  //$(".infos_line").hide();
}
