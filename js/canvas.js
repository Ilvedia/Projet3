var Canvas = {

	init: function(){
		var that = this;
		this.paint = false;
		this.canvas = document.getElementById("canvas");
		this.context = this.canvas.getContext("2d");
		this.annulation = document.getElementById("hidePopup")
		this.validation = document.getElementById("validate")
		this.clickX = new Array();
		this.clickY = new Array();
		this.clickDrag = new Array();
		this.lastPt = null;

		this.canvas.addEventListener("mousedown", function(e) {
			that.mouseDown(e); 			
		});	

		this.canvas.addEventListener("mousemove", function(e) {
			that.mouseMove(e); 
		});

		this.canvas.addEventListener("mouseup", function(e) {
			that.mouseUp(e);
		});

		this.canvas.addEventListener("mouseleave", function(e) {
			that.mouseLeave(e);
		});

		this.annulation.addEventListener("click", function(e) {
			that.annuler();
		});

		this.canvas.addEventListener("touchmove", function(e) {
			e.preventDefault();
			that.touchMove(e);
		}, false);

		this.canvas.addEventListener("touchend", function(e) {
			e.preventDefault();
			that.end(e);
		}, false);

		this.canvas.addEventListener( "touchstart", function(e) {
			e.preventDefault();
			that.touchStart(e);
		}, false);
	},

	addClick: function(x, y, dragging){
		this.clickX.push(x);
		this.clickY.push(y);
		this.clickDrag.push(dragging);
	},

	redraw: function(){
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); //nettoie le canvas
		this.context.strokeStyle = "#000000";
		this.context.lineJoin = "round";
		this.context.lineWidth = 3;

		for (var i=0; i < this.clickX.length; i++) {
			this.context.beginPath();
			if (this.clickDrag[i] && i){
				this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
			}else{
				this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
			}
			this.context.lineTo(this.clickX[i], this.clickY[i]);
			this.context.closePath();
			this.context.stroke();
		}

		console.log(this.clickX,this.clickY);
	},

	annuler: function() {
		document.getElementById("signature").style.display = "none";
		document.getElementById('boutonReservation').style.display = "block";
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.beginPath();
	},

	reserver: function() {
		document.getElementById("signature").style.display = "block";
		document.getElementById('boutonReservation').style.display = "none";
	},

	mouseDown: function(e) {
		var mouseX = e.pageX - this.canvas.offsetLeft;
		var mouseY = e.pageY - this.canvas.offsetTop;
		this.paint = true;
		this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
		this.redraw();
		
	},

	mouseMove: function(e) {
		var mouseX = e.pageX - this.canvas.offsetLeft;
		var mouseY = e.pageY - this.canvas.offsetTop;
		if(this.paint){
		this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
		this.redraw();
		}
	},

	mouseUp: function(e) {
		this.paint = false;
	},

	mouseLeave: function(e) {
		this.paint = false;
	},

		// tactile
	mobilDraw: function(e) {
		e.preventDefault();
		console.log("this.lastPt", this.lastPt);
		var touchX = e.changedTouches[0].pageX - this.canvas.offsetLeft;
		var touchY = e.changedTouches[0].pageY - this.canvas.offsetTop;
        if (this.lastPt!=null) {
          	this.context.beginPath();
          	this.context.moveTo(this.lastPt.x, this.lastPt.y);
          	this.context.lineTo(touchX, touchY);
          	this.context.stroke();
		}
        this.lastPt = {
        	x: touchX,
        	y: touchY
        };
        console.log(e);
    },

    end: function(e) {
    	e.preventDefault();
		this.lastPt=null;
		this.paint = false;
    },

    touchMove: function(e) {
		this.mobilDraw(e);
	},

	touchStart: function(e) {
		this.mobilDraw(e);
	},

}


