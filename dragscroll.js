/**
 * 元素内鼠标移动滚动条 JQUERY PLUGIN
 * 
 * [code]
 * $("elem").YHDragScroll()
 * [/code]
 *
 * @date 2015-10/16
 * @copyright by WadeYu
 */
(function($){
	//最近一次鼠标位置
	var lastX = 0, lastY = 0;
	/**
	 * 判断鼠标移动方向
	 * 向上,向左上,向右上,向下,向左下,向右下,向左,向右
	 */
	var getDirection = function(x,y){
		if( (lastX == 0) && (lastY == 0) ){
			lastX = x;
			lastY = y;
			return '';
		}
		if((lastX == x) && (lastY == y)){
			return '';
		}
		var direction = '';
		if((lastX == x) && (lastY > y)){
			direction = "up"; //向上
		} else if((lastX == x) && (lastY < y)){
			direction = "down"; //向下
		} else if((lastY == y) && (lastX > x)){
			direction = "left";//向左
		} else if((lastY == y) && (lastX < x)){
			direction = "right";//向右
		} else if((lastY > y) && (lastX > x)){
			direction = "leftup"; //左上
		} else if((lastY > y) && (lastX < x)){
			direction = "rightup";//右上
		} else if((lastY < y) && (lastX > x)){
			direction = "leftdown"; //左下
		} else if((lastY < y) && (lastX < x)){
			direction = "rightdown"; //右下
		}
		lastX = x;
		lastY = y;
		return direction;
	};
	/**
	 * 鼠标移动事件回调
	 */
	var scrollCb = function(evnt){
		var offsetX = evnt.pageX - lastX; offsetY = evnt.pageY - lastY;
		var direction = getDirection(evnt.pageX,evnt.pageY);
		if(!direction){
			return ;
		}
		this.scrollLeft( this.scrollLeft() + offsetX * 1.2 );
		this.scrollTop( this.scrollTop() + offsetY * 1.2 );
	};
	$.fn.YHDragScroll = function(){
		this.each(function(i){
			var $elem = $(this);
			var cb = function(evnt){
				scrollCb.call($elem,evnt);
			};
			$elem.bind("mousedown",function(evnt){
				lastX = 0;
				lastY = 0;
				$elem.bind("mousemove",cb);
			});
			$elem.bind("mouseup",function(evnt){
				lastX = 0;
				lastY = 0;
				$elem.unbind("mousemove",cb);
			});
		});
		this.bind("mousedown",scrollCb);
		this.bind
	};
})(jQuery);

