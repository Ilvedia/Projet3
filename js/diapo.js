var Slide = {
	initSlide: function(img, texte){
		this.img = img;
		this.texte = texte;
	}
};

var slides = [];

var Diaporama = {
	initDiapo: function(tableau){
		this.i = 0;
		this.tableau = tableau;
	},
	
	changeImageSuivante: function(e){
		this.i++; // on incrémente le compteur
		if (this.i > this.tableau.length -1) {
		this.i = 0;
		}
		document.getElementById('diapo').src = this.tableau[this.i].img ; // Modification de l'image du diaporama
		document.getElementById('texte_diapo').innerHTML = this.tableau[this.i].texte; // Modification du texte du diaporama
	},

	changeImagePrecedente: function(e){
		this.i--; // on décrémente le compteur
		if (this.i < 0){
		this.i = this.tableau.length -1;
		}
		document.getElementById('diapo').src = this.tableau[this.i].img ; // Modification de l'image du diaporama
		document.getElementById('texte_diapo').innerHTML = this.tableau[this.i].texte; // Modification du texte du diaporama
	}
};

var right = document.getElementById("right"); //déclaration du bouton droit
var left = document.getElementById("left"); // déclaration du bouton gauche

right.addEventListener("click", function () {diapo1.changeImageSuivante()}); //changement d'image au clic sur flèche droite
left.addEventListener("click", function () {diapo1.changeImagePrecedente()}); //changement d'image au clic sur flèche gauche

document.addEventListener("keydown", function(e){ // changement de l'image avec touche du clavier
	if(e.keyCode === 37){
        diapo1.changeImagePrecedente();
    }
    else if(e.keyCode === 39){
    	diapo1.changeImageSuivante()
    }
});



