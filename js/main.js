var graph = []

// global initializations
var addingSucces = {state : false, action : 0};
var deleting = false;

function getStructure(graph){
    var i, j;
    var structure="";
    var indent="&nbsp;&nbsp;&nbsp;&nbsp;"; // initialisation de valeur pour la marge par défaut

    // définir les icons pour le TreeView
    var sicon, ssicon, gicon;
    gicon = "";
    sicon = "&rarr; ";
    ssicon = "&rarrap; ";
    
    structure+=gicon+"<h2 class='stt'>Structure de graphe</h2>";
    for(i=0; i<graph.length;i++){
        structure+=indent+sicon+"<font color='#5a88ca'><b>"+graph[i].name+"</b></font><font size='2' color='#234'> (Sommet ["+
        graph[i].successeurs.length+"])</font><br>";
        for(j=0;j<graph[i].successeurs.length;j++){
            structure+=indent+indent+ssicon+"<font size='2' color='#234'>"+graph[i].successeurs[j].name+" (successeur avec valeur "+
            graph[i].successeurs[j].value+")</font><br>";
        }
    }
    return structure;
}

function addSommet(graph, nom){ // ajout un sommet au graph
    var item = { // element de graph (sommet)
        name : nom,
        successeurs : []
    };
    if(! sommetExists(graph, nom)){
        graph[graph.length] = item;
        return true;
    }
    return false;
}
function getSommetID(graph, nom){ // renvoi l'indice de sommet donné
    for(var i=0; i<graph.length;i++){
        if(graph[i].name==nom) return i;
    } return -1;
}
function sommetExists(graph, sommet){ // tester si le  sommet est déja existé ou non
    for(var i=0; i<graph.length;i++){
        if(graph[i].name==sommet) return true;
    } return false;
}
function successeurExists(sommetActive, nom){ // tester si le successeur d'un sommet exist ou non
    for(var i=0; i<sommetActive.successeurs.length;i++){
        if(sommetActive.successeurs[i].name==nom) return true;
    } return false;
}
function addSuccesseurs(graph, sommet, success, valeur){ // ajouter un successeur à un sommet
    var item = {
        name : success,
        value : valeur
    };
    var sommetActive = graph[getSommetID(graph, sommet)].successeurs;
    if(sommetExists(graph, sommet) && sommetExists(graph, success) && ! sommetExists(sommetActive, success)){
        sommetActive[sommetActive.length] = item;
        return true;
    } return false;
}
function editSommet(graph, sommet, newName){ // changer le nom d'un sommet
    if(sommetExists(graph, sommet) && ! sommetExists(graph, newName)){
        graph[getSommetID(graph, sommet)].name = newName;
        return true;
    } return false;
}
function editSuccessurs(graph, sommet, success, newName, newVal){ // changer le nom et la valeur d'un successeur
    var item = { // element de graph (successeur)
        name : newName,
        value : newVal
    };
    var activeSommet = graph[getSommetID(graph, sommet)].successeurs;
    if(sommetExists(graph, sommet) && sommetExists(graph, success) 
    && sommetExists(graph, newName) && ! successeurExists(activeSommet, newName)){
        activeSommet[getSommetID(activeSommet, success)] = item;
        return true;
    } return false;
}
function exists(nom, list){ // recherche d'une valeur dans un tableau (array)
    for(var i=0; i<list.length;i++){
        if(list[i]==nom) return i;
    } return -1;
}

function deletSommet(graph,sommet) { // supprimer un sommet et ses successeurs
    for (var i = 0; i < graph.length; i++) {
        if (graph[i].name==sommet) {
            graph.splice(i, 1);
        }
    }

    for (var i = 0; i < graph.length; i++) {
        for (var j = 0; j < graph[i].successeurs.length; j++) {
            if (graph[i].successeurs[j].name==sommet) {
                graph[i].successeurs.splice(j, 1);
            }   
        } 
    }
}

function deletSuccesseurs(graph,sommet,succesdelet) { // supprimer un arc/successeur
    for (var i = 0; i < graph.length; i++) {
        for (var j = 0; j < graph[i].successeurs.length; j++) {
            if (graph[i].name==sommet && graph[i].successeurs[j].name==succesdelet) {
                graph[i].successeurs.splice(j, 1);
            }   
        } 
    }
}

function deletAll(graph){ // supprimer tout le graph (démarrer une nouvelle session)
    for (var i = 0; i < graph.length; i++) {
            graph.splice(i, 1);
    }
}

// DEBUT : Méthode de dijkstra
// chercher le minimum des valeur pour un sommet donné
function getMinimium(result, S){
    var min ;
    var premier=0;
    for(var i=0;i<result.length;i++){
        if(exists(result[i].name, S)!=-1){ 
            continue;
        }
        else { 
        premier++;
        }
        if (premier==1) {
            min=result[i];
            continue;
        }
        else{
            if (min.value>result[i].value) {
                min=result[i];
            }
        } 
    }
    return min;
}

// algorithme de dijkstra permet de retourner un tableau des sommets
// successives de plus cours chemin depuis un sommet initiale donné.
function dijkstra(graph, sommet){
    var iterations = graph.length;
    var result = [], S = []; // un objet 
    var target = null;
    var activeSommet = null;
    var succes ;
    var k=1;
    var item = {
        name : sommet,
        proced : null,
        value : 0
    };

    result[0] = item;
    for(var i=1;i<iterations;i++){
        activeSommet=getMinimium(result, S);
        S[S.length] = activeSommet.name;
        succes = [];
        succes = graph[getSommetID(graph,activeSommet.name)].successeurs;
        for(var j=0;j<succes.length;j++){
            if(exists(succes[j].name, S)!=-1) continue;

            if(sommetExists(result,succes[j].name)){
                target=result[getSommetID(result,succes[j].name)];
                if (target.value > (succes[j].value+activeSommet.value)) {
                    result[getSommetID(result,succes[j].name)].value = (succes[j].value + activeSommet.value) ;
                    result[getSommetID(result,succes[j].name)].proced=activeSommet.name;
                }else{
                    continue;
                }
            }
            else {
            item = {name : succes[j].name, proced : activeSommet.name, value : (succes[j].value+activeSommet.value) };
            result[k] = item;k++;
            item = {name : null,  proced : null, value : 0};
            }
        }
    }
    return result;
}
function resultsConceptor(startNode){
    var str = "";
    var viewer = document.getElementById('resultViewer');
    result = dijkstra(graph, startNode);
    var dataRep = []

    for(var i=1;i<result.length;i++){
        str = "";
        j=i; 
        lenPath=result[i].value;
        while(result[j].proced != null){
            str+="<div class='node light'>"+result[j].name+"</div> &larr; ";
            j=getSommetID(result, result[j].proced);
        } str += "<div class='node light'>"+result[0].name+"</div>";
        dataRep[dataRep.length] = {
            nodes : str,
            length : lenPath
        }
    }
    return dataRep;
}

// FIN : Méthode de dijkstra

function visualiseGraph(startNode){// retourne le résultat de la méthode dijkstra dans le popup
    var str = "";
    var viewer = document.getElementById('resultViewer');
    result = dijkstra(graph, startNode); // renvoi le résultat de dijkstra d'après le neud de départ startNode
    var dataRep = resultsConceptor(startNode); // représentation graphique de résultat avec la fonction resultsConceptor()

    for(var i=0;i<dataRep.length;i++){
        str += "<div class='rowMe'>"+dataRep[i].nodes+" &nbsp;Avec un longeur de : <span class='label-st'>"+dataRep[i].length+"</span></div><br>";
    }
    
    viewer.innerHTML = str;
    setTimeout(function(){ // affichage de fenêtte de résultat
        var elem = document.getElementsByClassName('result')[0];
        elem.style.marginTop = 140;
        addingSucces = {state : false, action : 0};
        deleting = false;
    }, 300);
}

function dropPopup(){ // cacher la fenêttre de résultat
    setTimeout(function(){document.getElementsByClassName('result')[0].style.marginTop = -2000;}, 300);
}

// Controllers  : main action

function setupEnvironment(){ // initialise les elements de l'environement de travail
    var welcomeScreen = document.getElementById('welcome');
    var header = document.getElementById('tooler').style.height="45px";
    var tools = document.getElementById('tooler_tools').style;
    tools.display = "block";
    welcomeScreen.style.opacity=0;
    setTimeout(function(){welcomeScreen.style.display="none";
                          tools.opacity=1;}, 500);
    setTimeout("updateStructure()", 1000);
}
function updateStructure(){ // mettre a jour la section structure de graph
    var elem = document.getElementById('structure');
    elem.innerHTML = getStructure(graph);
    elem.style.display="block";
}


// partie dessin de graph
successEdges = [null, null];
selectedEdge = null;
function getDrawName(elem){ // listener pour les opération sur les sommets
    if(deleting){
        deletSommet(graph, elem.innerText);
        elem.remove(); // supprimer le sommet dans la scène
        updateStructure(); // mettre a jour la structure
        reArrangeElements(); // actualiser la scène
    }
    if(! addingSucces.state) return 0;
    if(successEdges[0]==null){
        // en cas de premier sommet selectionné
        successEdges[0] = elem.innerText;
        selectedEdge = elem;
        selectedEdge.style.opacity=.4;
        logger("Selectionner un autre ordinateur pour lier");
    }else{
        // si on a selectionné les 2 sommets
        if(elem.innerText==successEdges[0]){
            successEdges = [null, null];
            elem.style.opacity = 1;
            return 0;
        }
        successEdges[1] = elem.innerText;
        var val = prompt("Donner la valeur :"); // communiquer la valeur d'arret/arc
        if(val=='' || val==null || isNaN(val)) return 0;
        document.getElementById('edtS').style.backgroundColor='#ecf0f1';
        document.getElementById('edtS1').style.backgroundColor='#ecf0f1';
        
        if(addingSucces.action){ // l'action ajouter une arret entre deux sommets
            addingSucces={state : false, action : 1};
            if(! addSuccesseurs(graph, successEdges[0], successEdges[1], parseInt(val))
            || ! addSuccesseurs(graph, successEdges[1], successEdges[0], parseInt(val))){
                alert("L\'arc/arret de "+successEdges[0]+" vers "+successEdges[1]+" est déjà existé !");
                successEdges = [null, null];
                selectedEdge.style.opacity = 1;
                return 0;
            } 
        }else { // action ajouter un arc entre deux sommets
            addingSucces={state : false, action : 0};
            if(! addSuccesseurs(graph, successEdges[0], successEdges[1], parseInt(val))){
                alert("L\'arc/arret de "+successEdges[0]+" vers "+successEdges[1]+" est déjà existé !");
                successEdges = [null, null];
                selectedEdge.style.opacity = 1;
                return 0;
            } 
        }
        
        successEdges = [null, null];
        selectedEdge.style.opacity = 1;
        if(addingSucces.action) processSucces(document.getElementById('edtS1'), 2);
        else processSucces(document.getElementById('edtS'), 0);
        
        logger(""); // afficher le message par défaut dans la barre status
        updateStructure(); // actualiser la structure de graphe
        reArrangeElements(); // actualiser les sommets et les arcs dans l'espace de travail
    }
}

function drawSommet(){
    // cette fonction permet d'ajouter un sommet dans l'espace de travail
    var colors = ['danger', 'info', 'warning', 'info-light', 'dark light', 'primary', 'default', 'info', 'danger', 'danger'];
    var sommet = "<div class='sommet bg-"+(colors[parseInt(Math.random()*10)])
    +"' onclick='getDrawName(this)'>";
    var sName = prompt("Donner un nom pour le sommet :");
    if(sName=='' || sName==null) return 0;
   
    if(! addSommet(graph, sName)){ // ajout de sommet au graphe
        alert("ce sommet ("+sName+") est déja existé !");
        return 0;
    } sommet+=sName+"</div>";
    
    workflow(sommet); // ajouter le sommet au scène
    reArrangeElements(); // actualiser la scène
    updateStructure(); // actualiser la structure de graphe
}

function processSucces(elem, action){ // les effet/actions des boutons d'outils
    if(addingSucces.state || deleting){
        elem.style.backgroundColor='#ecf0f1';
        if(action==0 || action==2){
            if(action == 0) addingSucces={state : false, action : 0};
            else addingSucces={state : false, action : 1};
        }
        else deleting=false;
    }else{
        elem.style.backgroundColor='#2980b9';
        if(action==0 || action==2){
            if(action == 0) addingSucces={state : true, action : 0};
            else addingSucces={state : true, action : 1};
        }
        else deleting=true;
    }
}

// mettre a jour le contenu d'espace de travail
function workflow(append){document.getElementById('workflow').innerHTML+=append;}

function stackTrace(){
    var elem = document.getElementById("workflow");
    elem.innerHTML = getStructure(graph);
}

var startPOS = [370, 300]; // position initial de dessin

// ordonner et positionner les objets dans l'espace de travail
function reArrangeElements(){  
    // reset tools
    var btn1, btn2;
    btn1 = document.getElementById('edtS');
    btn2 = document.getElementById('edtD');
    btn3 = document.getElementById('edtS1');
    if(graph.length<=0){
        btn1.setAttribute("disabled", "true");
        btn2.setAttribute("disabled", "true");
        btn3.setAttribute("disabled", "true");
        btn1.style.backgroundColor='#ecf0f1';
        btn2.style.backgroundColor='#ecf0f1';
        btn3.style.backgroundColor='#ecf0f1';
        addingSucces={state : false, action : 0};
        deleting=false;
    }else{
        btn1.removeAttribute("disabled");
        btn2.removeAttribute("disabled");
        btn3.removeAttribute("disabled");
    }
    // redraw all graph elements


    var sommets = document.getElementsByClassName("sommet");
    var xpos, ypos, indent = 140;
    xpos = startPOS[0]
    ypos = startPOS[1]
    oldSommet = [] // les sommets déjâ ajoutés
    var tmp_s;

    // positionner les sommets dans l'espace de travail
    for(var i=0;i<graph.length-oldSommet.length+i;i++){
        if(exists(sommets[i].innerText, oldSommet) == -1){ // sommet n'est pas déjà traité
            xpos += indent;
            oldSommet[oldSommet.length] = sommets[i].innerText;
            sommets[i].style.top = ypos;
            sommets[i].style.left = xpos;
            
            if(graph[i].successeurs.length>0){
                xpos += indent;
                for(var j=0;j<graph[i].successeurs.length;j++){
                    tmp_s = graph[i].successeurs[j].name;
                    if(exists(tmp_s, oldSommet) == -1){
                        
                        if(j%2==0) ypos += indent;
                        else ypos -= indent*2;
                        
                        sommets[getSommetID(graph, tmp_s)].style.left = xpos;
                        sommets[getSommetID(graph, tmp_s)].style.top = ypos;
                        
                        oldSommet[oldSommet.length] = tmp_s;
                    }
                }
            }
        }
    }
}

var cprt = "Copyrights 2019 ©, All rights reserved to ENSET-M (By Zakaria HBA)";
function logger(instruction){
    var loggr = document.getElementById('logger');
    if(instruction=='') loggr.innerText = cprt;
    else loggr.innerHTML = instruction; 
} setTimeout("logger('')", 10);
