window.addEventListener("load", pageFullyLoaded, false);
let bull
let pt
let tate

let selection = "";

function pageFullyLoaded(e) {
    bull = document.getElementById("bull")
    pt = document.getElementById("pt")
    tate = document.getElementById("tate")
    bull.addEventListener("click", setGolf);
    pt.addEventListener("click", setViolin);
    tate.addEventListener("click", setFootball);
}

function setGolf(){
    resetAll();
    bull.style.border = "2px solid white"
    bull.style.borderRadius = "5px"
    selection = "golf"
}

function setViolin(){
    resetAll();
    pt.style.border = "2px solid white"
    pt.style.borderRadius = "10px"
    selection = "violin"
}

function setFootball(){
    resetAll();
    tate.style.border = "2px solid white"
    tate.style.borderRadius = "10px"
    selection = "football"
}

function resetAll(){
    selection = "";
    bull.style.border = "0px solid white"
    pt.style.border = "0px solid white"
    tate.style.border = "0px solid white"
}