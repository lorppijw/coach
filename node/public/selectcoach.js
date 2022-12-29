window.addEventListener("load", pageFullyLoaded, false);
let bull
let pt
let tate

let selection = "";

function pageFullyLoaded(e) {
    bull = document.getElementById("bull")
    pt = document.getElementById("pt")
    tate = document.getElementById("tate")
    bull.addEventListener("click", setBull);
    pt.addEventListener("click", setVatanen);
    tate.addEventListener("click", setTate);
}

function setBull(){
    resetAll();
    bull.style.border = "2px solid white"
    bull.style.borderRadius = "5px"
    selection = "golf"
    document.getElementById("coachName").textContent = "Bull Mentula"
    // document.getElementById("coachDescription").textContent = "Varma valinta kokeneemmille harrastajille erityisesti ekspressionistiseen taidemaalaukseen ja itämaiseen huilunsoittoon."

}

function setVatanen(){
    resetAll();
    pt.style.border = "2px solid white"
    pt.style.borderRadius = "5px"
    selection = "violin"
    document.getElementById("coachName").textContent = "PT Vatanen"
    document.getElementById("coachDescription").textContent = "Kova äijä bodaa. Lambo löytyy."
    
}

function setTate(){
    resetAll();
    tate.style.border = "2px solid white"
    tate.style.borderRadius = "5px"
    selection = "football"
    document.getElementById("coachName").textContent = "Andrew Tate"
    document.getElementById("coachDescription").textContent = "Top G"
}

function resetAll(){
    selection = "";
    bull.style.border = "0px solid white"
    pt.style.border = "0px solid white"
    tate.style.border = "0px solid white"
}