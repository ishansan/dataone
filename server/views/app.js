(function($){
		  $(function(){

		    $('.button-collapse').sideNav();
		    $('.parallax').parallax();
			 $('.datepicker').pickadate({
			    selectMonths: true,
			    selectYears: 40
			  });
		});

		})(jQuery);

		//new record
		$(".dropdown dt a").on('click', function() {
		$(".dropdown dd ul").slideToggle('fast');
		});

		$(".dropdown dd ul li a").on('click', function() {
		$(".dropdown dd ul").hide();
		});

		function getSelectedValue(id) {
		return $("#" + id).find("dt a span.value").html();
		}

		$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
		});

		$(document).on('click','.mutliSelect input[type="checkbox"]',function() {

		var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').attr("data-text"),
		title = $(this).attr("data-text") + ",";
		var id = $(this).attr("data-id");
		if ($(this).is(':checked')) {
		var html = '<span title="' + title + '" data-id="'+id+'" data-text="'+title+'" class="main-font cblack capitalize collect_info_span">' + title + '</span>';
		$('.multiSel').append(html);
		$(".hida").hide();
		} else {
		$('span[title="' + title + '"]').remove();
		var ret = $(".hida");
		$('.dropdown dt a').append(ret);
		}
		});

		//update record
		$(document).on("click",".icon-block",function()
		{
			var get_loki = $(this).attr("data-id");
			$("#update_box").attr("data-id",get_loki);
			//get data with Id
			$.post("/ops/getmovieId",{loki:get_loki},function(data)
			{
				$("#input_updatemoviename").val(data.data[0].name);
				$("#input_updateimageurl").val(data.data[0].coverimage);
				$("#input_updatereleasedate").val(data.data[0].release_date);
				$("#input_updategenre").val(data.data[0].genre.toLowerCase());
				$("#updatedirector_ctrl").val(data.data[0].director.toLowerCase());
			});
			$("#update_movie_dialog").removeClass("hide");
			$("html,body").animate({scrollTop:$("#update_movie_dialog").offset().top},'slow');
		});
		$(document).ready(function(){
			$.get("/ops/getmoviesnumber",function(data)
			{
				var number = Math.ceil((data.number)/10); //TODO
				for(var i=0;i<number;i++)
				{
					$("#pagination_numbers").append('<li class="waves-effect pagination_lis" data-id="'+(i+1)+'"><a href="/'+(i+1)+'">'+(i+1)+'</a></li>');
				}
			});
		});