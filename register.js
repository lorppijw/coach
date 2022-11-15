window.addEventListener("load", pageFullyLoaded, false);
let golf
let violin
let football

let selection = "";

function pageFullyLoaded(e) {
    golf = document.getElementById("golf")
    violin = document.getElementById("violin")
    football = document.getElementById("football")
    golf.addEventListener("click", setGolf);
    violin.addEventListener("click", setViolin);
    football.addEventListener("click", setFootball);
}

function setGolf(){
    resetAll();
    golf.style.border = "2px solid white"
    golf.style.borderRadius = "5px"
    selection = "golf"
}

function setViolin(){
    resetAll();
    violin.style.border = "2px solid white"
    violin.style.borderRadius = "10px"
    selection = "violin"
}

function setFootball(){
    resetAll();
    football.style.border = "2px solid white"
    football.style.borderRadius = "10px"
    selection = "football"
}

function resetAll(){
    selection = "";
    golf.style.border = "0px solid white"
    violin.style.border = "0px solid white"
    football.style.border = "0px solid white"
}