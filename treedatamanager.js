/**
 * 无限父子关联关系管理
 *
 * @author WadeYu
 * @date 2015/9/10
 * @version 0.0.1
 * @copyright by WadeYu
 */
/**
 * @param idName 子ID名
 * @param parentIdName 父ID名
 * @param 原始数据二维数组 [{id:xx,fid:xx,name:xx,...},...]
 * @param fid 顶级分类所属父节点ID
 */
var TreeDataManager = function(idName,parentIdName,data,fid){
	this.idName = idName || "id";
	this.parentIdName = parentIdName || "fid";
	this.data = data || [];
	this.fid = fid || 0;
	this.idToDataMap = {}; 
	this.idToChildrenDataMap = {}; //直接孩子列表
	this.levelNodeData = []; //层级数据[[{},...],...] 0顶级 1第二层 2第三层 ...
	this.init();
};
TreeDataManager.prototype.init = function(){
	var sId = this.idName;
	var sFid = this.parentIdName;
	for(var i = 0; i < this.data.length; i++){
		var oTmp = this.data[i];
		this.idToDataMap[oTmp[sId]] = oTmp;
		if(oTmp[sFid] == this.fid){
			if(typeof this.levelNodeData[0] == "undefined"){
				this.levelNodeData[0] = [];
			}
			this.levelNodeData[0].push(oTmp);
		}
		if(typeof this.idToChildrenDataMap[oTmp[sFid]] == "undefined"){
			this.idToChildrenDataMap[oTmp[sFid]] = [];
		}
		this.idToChildrenDataMap[oTmp[sFid]].push(oTmp);
	}
};
TreeDataManager.prototype.getChildNodesById = function(id,bAll){
	var id = parseInt(id);
	if(isNaN(id) || !this.idToChildrenDataMap[id]){
		return [];
	}
	var aChildren = this.idToChildrenDataMap[id];
	if(!bAll || (aChildren.length == 0)){
		return aChildren;
	}
	//返回所有子节点
	var self = this;
	var aTmp = [];
	var fn = function(nodes){
		for(var i = 0; i < nodes.length; i++){
			aTmp.push(nodes[i]);
			var tmpId = nodes[i][self.idName];
			if(self.idToChildrenDataMap[tmpId]){
				fn(self.idToChildrenDataMap[tmpId]);
			}
		}
	};
	for(var i = 0; i < aChildren.length; i++){
		aTmp.push(aChildren[i]);
	}
	fn(aChildren);
	return aTmp;
};
TreeDataManager.prototype.getNodesByLevel = function(lvl){
	var lvl = parseInt(lvl);
	if(isNaN(lvl) || (lvl < 0)){
		lvl = 0;
	}
	if(this.levelNodeData[lvl]){
		return this.levelNodeData[lvl];
	}
	if(lvl > 50){ //很少有超过50层的数据
		return [];
	}
	if(this.levelNodeData.length == 0){ //必须包含顶层节点列表
		return [];
	}
	for(var i = this.levelNodeData.length - 1; i < lvl; i++){
		var aTmpId = [];
		this.levelNodeData[i+1] = [];
		for(var j = 0; j < this.levelNodeData[i].length; j++){
			aTmpId.push(this.levelNodeData[i][j][this.idName]);
		}
		if(aTmpId.length > 0){
			for(var k = 0; k < this.data.length; k++){
				if(aTmpId.indexOf(this.data[k][this.parentIdName]) > -1){
					this.levelNodeData[i+1].push(this.data[k]);
				}
			}
		}
	}
	return this.levelNodeData[lvl];
};
TreeDataManager.prototype.getNodeById = function(id){
	return this.idToDataMap[id];
};