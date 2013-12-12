var hours = ["5:30",
             "6:00",
             "6:30",
             "7:00",
             "7:30",
             "8:00",
             "8:30",
             "9:00",
             "9:30",
             "10:00",
             "10:30",
             "11:00",
             "11:30",
             "12:00",
             "12:30",
             "13:00",
             "13:30",
             "14:00",
             "14:30",
             "15:00",
             "15:30",
             "16:00",
             "16:30",
             "17:00",
             "17:30",
             "18:00",
             "18:30",
             "19:00",
             "19:30",
             "20:00",
             "20:30",
             "21:00",
             "21:30",
             "22:00",
             "22:30",
             "23:00",
             "23:30",
             "00:00"];
var hour=0;

var slider_val = 0;

$(document).ready(function(){

	//console.log("main.js");
	
	$('#hour_slider').slider({
		"min":0,
		"max":36,
		"step":1,
		"value":[0],
		"formater":function(v){
			return hours[v]+" - "+hours[v+1]+" hrs.";
		},
	}).on('slide',function(ev){
		if(slider_val!=ev.value){ //|| slider[1]!=ev.value[1]){
			slider_val=ev.value;
			//console.log(slider_val+","+ev.value);
			//slider[1]=ev.value[1];
			hour = ev.value;
			$("#interval").html(hours[hour]+" - "+hours[hour+1]+" hrs.");
			morning = false;
			afternoon = false;
			total = false;
			draw();
			
			//console.log("morning"+morning);
			//console.log("afternoon"+afternoon);
		}
	})
	.on('slideStop',function(ev){
		////console.log(ev.value[0]+","+ev.value[1]);
		hour = ev.value;
		$("#interval").html(hours[hour]+" - "+hours[hour+1]+" hrs.");
		morning = false;
		afternoon = false;
		total = false;
		draw();
		//console.log("morning"+morning);
		//console.log("afternoon"+afternoon);
	});
	
	$('#morning').on('click',function(){
		$("#interval").html("6:00 - 10:00 hrs.");
		morning = true;
		afternoon = false;
		total = false;
		draw();
		//console.log("morning"+morning);
		//console.log("afternoon"+afternoon);
	});
	$('#afternoon').on('click',function(){
		$("#interval").html("16:30 - 20:30 hrs.");
		morning = false;
		afternoon = true;
		total = false;
		draw();
		//console.log("morning"+morning);
		//console.log("afternoon"+afternoon);
	});
	$('#total').on('click',function(){
		$("#interval").html("5:30 - 00:00 hrs.");
		morning = false;
		afternoon = false;
		total = true;
		draw();
		//console.log("morning"+morning);
		//console.log("afternoon"+afternoon);
	});
	$('#morning').tooltip(
			{title:"6:00 - 10:00",}
	);
	$('#afternoon').tooltip({title:"16:30 - 20:30",});
	
	
	
	
	
});
