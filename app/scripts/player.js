function Player(wrapper){
	var self = this;
	
	_create();
	
	function _create(){
		
		var video = $(wrapper);
		//toggleFullScreen();		
		_handleEvent();
	};
	
	self.setMedia = function(src){
		
	};
	
	self.play = function(){
		video.play();
	};
	
	self.pause = function(){
		video.pause();
	};
	
	self.stop = function(){
		video.currentTime = 0;
		video.pause();
	};
	
	function toggleFullScreen() {
	  if (!document.fullscreenElement &&    // alternative standard method
	      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
	    if (document.documentElement.requestFullscreen) {
	      document.documentElement.requestFullscreen();
	    } else if (document.documentElement.msRequestFullscreen) {
	      document.documentElement.msRequestFullscreen();
	    } else if (document.documentElement.mozRequestFullScreen) {
	      document.documentElement.mozRequestFullScreen();
	    } else if (document.documentElement.webkitRequestFullscreen) {
	      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	    
	  } else {
	  	
	    if (document.exitFullscreen) {
	      document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	      document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      document.webkitExitFullscreen();
	    }
	  }
	}

	function progressbar()
	{
		$("#progress-bar").slider({
			orientation : "horizontal",
			range : "min",
			min : 0,
			max : 100,
			value : 0,
			slide : function(event, ui) {
				var seek = video.duration * (ui.value / 100);
				video.currentTime = seek;
			}
		});
	}
	
	function formatTime(s, m) {
	    s = Math.floor( s );    
	    m = Math.floor( s / 60 );
	    m = m >= 10 ? m : '0' + m;    
	    s = Math.floor( s % 60 );
	    s = s >= 10 ? s : '0' + s;    
	    return m + ':' + s;
	}
	
	function _handleEvent()
	{
		$(".ctrl-btn").on("click", function(){
			var id= $(this).attr("id");
			switch(id)
			{
				case "play":
					self.play();
				break;
				case "pause":
					self.pause();
				break;
				case "stop":
					self.stop();
				break;
				case "fullscreen":
					toggleFullScreen();
				break;
			}
		});
		
		$("#icon").on("click", function(){
			if($(this).hasClass("active"))
			{
				self.pause();				
			}else
			{
				self.play();
			}
		});
		
		$(video).on("ended", function(){
			$("#play").removeClass("invisible");
			$("#pause").addClass("invisible");
			$("#icon").removeClass("active");
			$("#poster").show();
			self.stop();
		});
		
		$(video).on("play", function(){
			$("#play").addClass("invisible");
            $("#pause").removeClass("invisible");
            $("#icon").addClass("active");
            $("#poster").hide();
		});
		
		$(video).on("pause", function(){
			$("#play").removeClass("invisible");
            $("#pause").addClass("invisible");
            $("#icon").removeClass("active");
		});
		
		$(video).on("canplaythrough", function(){
			//console.log("canplay");
			this.ready = true;
			progressbar();
		});
		
		$(video).on("timeupdate", function(){
			if(this.ready)
			{
				var percent = Math.floor((100 / this.duration) * this.currentTime);
				$(".ui-slider-range").css("width",percent+"%");
				$(".ui-slider-handle").css("left",percent+"%");
				$("#currenttime").text(formatTime(this.currentTime));
				$("#duration").text(formatTime(this.duration));
			}
		});
		
		$(window).on("orientationchange", function(){
			//console.log("orientation");
		});
	}
}