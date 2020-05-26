var markers = []
var donneesSessionName = sessionStorage.getItem("titre");
var donneesSessionAddress = sessionStorage.getItem("adresse");
// Exécute un appel AJAX GET
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
var ajax = {
    ajaxGet: function(url, callback) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                // Appelle la fonction callback en lui passant la réponse de la requête
                callback(req.responseText);
            } else {
            console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function () {
            console.error("Erreur réseau avec l'URL " + url);
        });
        req.send(null);
    }
}
var appel = Object.create(ajax);
//appel.ajaxGet()

													// API Google Map
//initialisation de la carte
var mapObj = {
    
    initMap: function() {

        var lyon = {lat: 45.761939, lng: 4.858108};
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 13,
            center: lyon
        });

        appel.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=2a896b71ab11abad7dcac1badd9bc142b1c1938d", function(reponse) {
    // Transforme la réponse en tableau d'objets JavaScript
        var stations = JSON.parse(reponse);
    // Récupère la position des stations de Lyon
        stations.forEach(function (station) {
        //console.log(station.address, station.name, station.banking, station.status, station.available_bikes);
        var marker = new google.maps.Marker({
            position: station.position,
            map: map,
            number: station.number
        });

        marker.addListener("click", function() {
            console.log(this.number);
            appel.ajaxGet("https://api.jcdecaux.com/vls/v1/stations/"+this.number+"?contract=lyon&apiKey=2a896b71ab11abad7dcac1badd9bc142b1c1938d", function(reponse) {
                var infoStation = JSON.parse(reponse);
                console.log(infoStation);
                // Suppression du contenu HTML de la liste
                document.getElementById("titre").innerHTML = "";
                document.getElementById("adresse").innerHTML = "";
                document.getElementById("disponible").innerHTML = "";
                document.getElementById("place").innerHTML = "";
                // Ajout des données de la station sélectionnée
                document.getElementById("titre").textContent = marker.number;
                document.getElementById("adresse").textContent = infoStation.address;
                document.getElementById("disponible").textContent = infoStation.available_bikes;
                document.getElementById("place").textContent = infoStation.available_bike_stands;

                //affichage du bouton réservation si vélo disponible
                if (infoStation.available_bikes > 0 ){
                    boutonReservation.style.display = "block";
                }else {
                    boutonReservation.style.display = "none";
                }

                // Stockage des données dans le session storage
            sessionStorage.setItem("titre", marker.number); //Stockage des données "marker.number" dans le sessionStorage
            sessionStorage.setItem("adresse", infoStation.address); //Stockage des données "infoStation.address" dans le sessionStorage
            donneesSessionName = sessionStorage.getItem("titre");
            donneesSessionAddress = sessionStorage.getItem("adresse");
            console.log(donneesSessionName);
            console.log(donneesSessionAddress);
            }) 

            var aside = document.getElementById("info_station");
            var boutonReservation = document.getElementById('boutonReservation');
                //Affichage du aside
            aside.style.display = "block";

                           
                //fermeture du Aside au click
            var span = document.getElementById("close");
            span.addEventListener("click", function() {
            aside.style.display = "none";
            });
    });
        //placement des markers dans le tableau
        markers.push(marker);    


    })
            //regroupement de marker
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: './img/icons/icons'
        });
    });

    },

    // Storage
    reservation: function(marker, infoStation){
        //si une reservation est en cours obligation d'annuler la précédente pour en faire une nouvelle
        if (sessionStorage.length != 0){
            var buttonAnnul = document.getElementById("buttonAnnul");
            document.getElementById("ligneStation").textContent = "Vous avez réservé un vélo à la station : " + donneesSessionName;
            document.getElementById("ligneAdresse").textContent = "située à l'adresse : " + donneesSessionAddress;
            Chrono.resetTimer(); // On réinitialise le timer
            Chrono.duree = Chrono.diffTime(); // On affecte la durée restante à la propriété durée
            Chrono.initChrono(); //On lance le timer
            compteur.style.display="block";
            buttonAnnul.style.display = "block";
        } else {
            document.getElementById("ligneStation").textContent = "Aucune réservation en cours";
            document.getElementById("ligneAdresse").textContent = "Sélectionnez une station afin de réserver un vélo";
        }

        var heureReservation = new Date().getTime();
        document.getElementById("validation").addEventListener('click', function () {
        console.log("validation");
        sessionStorage.setItem("heure", heureReservation); //récupère l'heure de la réservation
        document.getElementById("ligneStation").textContent = "Vous avez réservé un vélo à la station : " + donneesSessionName;
        document.getElementById("ligneAdresse").textContent = "située à l'adresse : " + donneesSessionAddress;
        var buttonAnnul = document.getElementById("buttonAnnul");
        buttonAnnul.style.display = "block";
        Chrono.resetTimer(); //On reset le timer()
        Chrono.initChrono(); //démarrage du compte à rebour
        //affichage de la div compteur
        compteur.style.display="block";

        });
        
    },

    clear: function (){
        document.getElementById("buttonAnnul").addEventListener("click", function () {
            //On vide le sessionStorage
            sessionStorage.clear();
            location.reload();
        });
    },

    annulation: function(){
        sessionStorage.clear();
        location.reload();
    }

    
}
var map = Object.create(mapObj);

var storage = Object.create(mapObj);
storage.reservation();
console.log(storage);

var annulation = Object.create(mapObj);
annulation.clear();
