/**
* JavaScript object viewer light implementation.
* Browsers compatibility: all major browsers.
* Written by Igor Benikov.
*/
var objectTreeView = (function(){
    
    'use strict';
    
    var containerEl,
    treeEl = document.createElement("ul"),
    objectTemplate = '<a class="node closed">&#9655;</a><div class="label {{=class}}">{{=icon}}</div><span class="caption">{{=caption}}</span><div class="clearall"><ul></ul>',
    fieldTemplate = '<div class="label field {{=class}}">{{=icon}}</div><span class="key">{{=key}}</span> :<span class="value">{{=value}}</span>',
    templates = {"object" : objectTemplate,"field" : fieldTemplate},
    figures = {
	RIGHT_ARROW: "&#9655;",
	DOWN_ARROW:"&#9661;",
	RECTANGLE: "&#9635;",
	OBJECT: "{ }",
	ARRAY: "[ ]",
	FUNCTION: "F"
    },
    dataTypes = {
	"string":{"template":"field", "icon" : figures.RECTANGLE},
	"number":{"template":"field", "icon" : figures.RECTANGLE},
	"boolean":{"template":"field", "icon" : figures.RECTANGLE},
	"array":{"template":"object", "icon" : figures.ARRAY},
	"object":{"template":"object", "icon" : figures.OBJECT},
	"null":{"template":"field", "icon" : figures.RECTANGLE},
	"undefined":{"template":"field", "icon" : figures.RECTANGLE},
	"function":{"template":"field", "icon" : figures.FUNCTION}
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
	var t = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	console.log(t);
	return t;
    },

    /**
     * Loop in object and create tree nodes.
     * Calls recursive.
     */
    createNode = function(key, node, parent, objectParent){

	var nodeType = getType(node),
	el = document.createElement("li"),
	tmpl = templates[dataTypes[nodeType]["template"]],
	subParent, i;

	//add quotes to string
	if(nodeType == "string"){
	    node = "\"" + node + "\"";
	}

	if(nodeType == "function"){
	    node = objectParent[key].toString();
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
	//therein  and call to createNode function.
	if(nodeType == 'object'){
	    for(i in node){
		createNode(i, node[i], subParent, node);
	    }
	}else if(nodeType == "array"){
	    for(i = 0; i < node.length; i++){
		createNode(i, node[i], subParent, node);
	    }
	}
    },

    expand = function(key, value, container){
	
	if(!containerEl){

	    containerEl = container;
	    containerEl.appendChild(treeEl);
	}
	
	treeEl.innerHTML = "";
	createNode(key, value, treeEl);
    };

    treeEl.className = "json-tree";

    /**
     * Single "click" event listener for tree.
     * If clicked element is node -
     * toggle its.
     */
    treeEl.addEventListener('click', function(e){
	var el = e.target,  ul;

	if(el && el.className && ~el.className.indexOf("node")){
	    
	    if(el.parentNode === treeEl){//top level
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

    return {"expand": expand};
}());
