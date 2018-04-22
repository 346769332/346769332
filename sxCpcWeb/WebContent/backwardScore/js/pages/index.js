
var Index =  new Function();
Index.prototype = {
	
	mainIfm : null,
	
	currNode : null,
	
    parentNode : null,
    
    init : function(mainIfm){
    	this.mainIfm = mainIfm;
    },
	createNode : function(url,data){
		var param = {
				"url" : url,
				"data": data,
				"node": null
		};
		return param;
	},
	putNode : function(parentNodeSet,currNode,newNode){
		if(this.currNode == null){
			this.parentNode = this.createNode("index.html",{});
			return this.parentNode;
		}
		if(typeof(parentNodeSet.node) == "undeined" || null == parentNodeSet.node){
			parentNodeSet.node = currNode;
			return parentNodeSet.node;
		}
		//递归
		return this.putNode(parentNodeSet.node,currNode,newNode);
	},
	getZNodeDel : function(pNode,node){
		if(typeof(node.node) == "undeined" || null == node.node){
			var nodeC = common.utils.clone(node);
			pNode.node = null;
			return nodeC;
		}
		//递归
		return this.getZNodeDel(node,node.node);
	},
	next : function(url,data){
		debugger;
		var newNode = this.createNode(url,data);		
		this.putNode(this.parentNode,this.currNode,newNode);
		this.currNode = newNode;
		
		this.mainIfm.src = this.currNode.url;
	},
	back : function(){
		debugger;
		var zNode = this.getZNodeDel(null,this.parentNode);
		this.currNode = common.utils.clone(zNode);
		this.mainIfm.src = this.currNode.url;
	}
};


var index = null;
window.onload=function(){ 
	var mainIfm = document.getElementById("mainIframe");
	mainIfm.style.height=document.body.scrollHeight; 
	mainIfm.style.width=document.body.scrollWidth; 
	index = new Index();
	index.init(mainIfm);
	index.next("home.html",{
		"hasSession":common.utils.getHtmlUrlParam("hasSession"),
		"helpTel" 	:common.utils.getHtmlUrlParam("helpTel")
	});
};
