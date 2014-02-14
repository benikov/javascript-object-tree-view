/**
* JavaScript object viewer simple implementation.
* Browsers compatibility: written in chrome, tested in safari,
* i hope, this works in other browsers also.
* Written by me.
*/
var objectTreeView = (function(){
    
    'use strict';
    
    var treeEl,
    objectTemplate = document.getElementById("otv_object").innerHTML,
    fieldTemplate = document.getElementById("otv_field").innerHTML,
    templates = {"object" : objectTemplate,"field" : fieldTemplate},
    figures = {
	RIGHT_ARROW: "&#9655;",
	DOWN_ARROW:"&#9661;",
	RECTANGLE: "&#9635;",
	OBJECT: "{ }",
	ARRAY: '[ ]'
    },
    dataTypes = {
	"string":{"template":"field", "icon" : figures.RECTANGLE},
	"number":{"template":"field", "icon" : figures.RECTANGLE},
	"boolean":{"template":"field", "icon" : figures.RECTANGLE},
	"array":{"template":"object", "icon" : figures.ARRAY},
	"object":{"template":"object", "icon" : figures.OBJECT},
	"null":{"template":"field", "icon" : figures.RECTANGLE},
	"undefined":{"template":"field", "icon" : figures.RECTANGLE}
    },

    template = function(s, params){
	
	var i, r;
	
	for(i in params){

	    r = new RegExp('{{=' + i + '}}', 'g');
	    s = s.replace(r, params[i]);
	}

	return s;
    },

    getType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    },

    /**
     * Loop in json object and create tree nodes.
     * Calls recursive.
     */
    createNode = function(key, node, parent){

	var nodeType = getType(node),
	el = document.createElement("li"),
	tmpl = templates[dataTypes[nodeType]["template"]],
	subParent, i;

	//add quotes to string showing
	if(nodeType == "string"){
	    node = "\"" + node + "\"";
	}

	//create node and append to parent
	if(nodeType == "object" || nodeType == "array"){

	    el.innerHTML = template(tmpl,{
		"icon": dataTypes[nodeType]["icon"],
		"caption":key,
		"class":nodeType});

	    //using in createNode recursive calls.
	    subParent = el.querySelector("ul");

	}else{

	    el.innerHTML = template(tmpl,{
		"icon": dataTypes[nodeType]["icon"],
		"key":key,
		"value": node,
		"class":nodeType
	    });
	}

	parent.appendChild(el);

	//if node is object or array - loop
	//in node and call createNode function.
	if(nodeType == 'object'){
	    for(i in node){
		createNode(i, node[i], subParent);
	    }
	}else if(nodeType == "array"){
	    for(i = 0; i < node.length; i++){
		createNode(i, node[i], subParent);
	    }
	}
    },

    /**
     * Single "click" event listener for tree.
     * If clicked element is node -
     * toggle node.
     */
    initEvents = function(){

	treeEl.addEventListener('click', function(e){
	    var el = e.target,  ul;

	    if(el && el.className && ~el.className.indexOf("node")){
		
		if(el.parentNode.className == "json-tree"){//top level
		    ul = el.parentNode;
		}else{
		    ul = el.parentNode.querySelector("ul");
		}
		
		if(~el.className.indexOf("opened")){
		    ul.style.height = 0;
		    el.className = "node closed";
		    el.innerHTML = figures.RIGHT_ARROW;
		}else{
		    ul.style.height = "auto";
		    el.className = "node opened";
		    el.innerHTML = figures.DOWN_ARROW;
		}
	    }
	});
    },

    expand = function(key, value, el){
	treeEl = el;
	el.innerHTML = "";
	initEvents();
	createNode(key, value, el);
    };

    return {"expand": expand};
}());
