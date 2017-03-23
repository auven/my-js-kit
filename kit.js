(function(){window.kit = {
	trim: function(s){
		return s.toString().replace(/^\s+|\s+$/g, '');
	} 
	, indexOfList: function(str,mark,list,index){
	  var list = list || [];
	  var begin = index == null ? 0 : (index + 1) 
	  var index1 = str.indexOf(mark,begin) > -1 ? str.indexOf(mark,begin) : null;
	  if(index1 || index1 == 0){list.push(index1);this.indexOfList(str,mark,list,index1)};
	  return list;
	}
    , stringToXml: function(xmlstring) {
        // for IE
        if (window.ActiveXObject) {
            var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
            xmlobject.async = "false";
            xmlobject.loadXML(xmlstring);
            return xmlobject;
        }
        // for other browsers
        else {
            var parser = new DOMParser();
            var xmlobject = parser.parseFromString(xmlstring, "text/xml");
            return xmlobject;
        }
	}
    , getTextLen: function(text, fontSize){
		var total = 0
		;
		text = (text == null ? '' : text).toString();
		for(var i=0; i<text.length; i++){
			var len = text.charCodeAt(i)<255 ? 1 : 2
			total += len
		}
		if(fontSize!=null){
			total = this.getTextWidth(text, fontSize);
		}
		return total;
	}
	, getTextWidth :function(text, fontSize){
		var total = 0
		, i
		;
		
		for(i = 0; i < text.length; i++){
			total += this.getCharWidth(text.charAt(i), fontSize);
		}
		
		return total;
	}
	, getCharWidth: function(c, fontSize){
		var len = c.charCodeAt(0) < 255 ? 1 : 2
		, charWidth
		;
		
		fontSize = fontSize == null ? 12 : fontSize;
		charWidth = [fontSize * 1.201 / 2, fontSize * 1.002];
		
		switch(fontSize){
			case 12:
				charWidth[0] = fontSize * 1.17 / 2
			break; case 13:
				charWidth[0] = fontSize * 1.232 / 2
			break; case 14:
				charWidth[0] = fontSize * 1.146 / 2
			break; case 15:
				charWidth[0] = fontSize * 1.201 / 2
		}
		
		return charWidth[len - 1];
	}
	, getLabel: function(html){
		var rex = /<\/?[^>]*>/g
		, tLength = 0
		html = html || ''
		var list = html.match(rex) || [];
		if(list.length == 0) return tLength;
		list.forEach(function(v,i){
			var len = v.length;
			tLength += len;
		})
		return tLength
	}
	, isUin: function(uid){
		return new RegExp('^\\d+$').test(uid) ? true : false
	}
	, clearRepeat: function(list){
		var l = [];
		list.forEach(function(v,i){
			if(l.indexOf(v) < 0){
				l.push(v)
			}
		})
		return l;
	}
	, clearRepeatMap: function(list,id){
		var l = []
		, idList = [];
		list.forEach(function(v,i){
			var uin = v[id];
			if(idList.indexOf(uin) < 0){
				idList.push(uin);
				l.push(v);
			}
		})
		return l;
	}
	, getSize: function(size){
		var str = ''
		, self = this
		, list1 = []
		, list2 = ['B','KB','MB','GB','TB','PB','EB','ZB','YB','DB','NB'];

		for(var i=0;i<12;i++){
			list1.push(Math.pow(1024,i))
		}

		list1.forEach(function(v,i){
			if(list1[i+1] && size >= list1[i] && size < list1[i+1]){
				str = i == 0 ? (size + list2[i]) : self.pInt(size / Math.pow(1024,i)) + list2[i]
			}
		})
		return str;
	}
	, pInt: function(size){
		return parseInt(size * 100) / 100
	}
	, changeTitle: function(text){
		document.getElementsByTagName('title')[0].innerHTML = text
	}
	, compare_proto: function(key){
		return function(map1,map2){
			return map1[key].toLowerCase() > map2[key].toLowerCase() ? 1 : -1
		}
	}
	, hiddenProperty: function(obj,callback){
		var hiddenProperty = 'hidden' in document ? 'hidden' :    
	    'webkitHidden' in document ? 'webkitHidden' :    
	    'mozHidden' in document ? 'mozHidden' : null;
		var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
		var onVisibilityChange = function(){
			if(typeof callback == 'function'){
		    	callback.call(null)
		    } 

		    if (!document[hiddenProperty]) {   
		    	obj.hidden = 'current'
		        // return 'current';
		    }else{
		    	obj.hidden = 'non-current'
		        // return 'non-current';
		    }
		}
		onVisibilityChange();
		document.addEventListener(visibilityChangeEvent, onVisibilityChange);
		window.onblur = function() {
        	obj.hidden = 'non-current'
		}
		window.onfocus = function() {
        	obj.hidden = 'current'
		}
	}
	, decode: function(val){
		try{
			return decodeURIComponent(
			    val.replace(/\+/g,'%20')
			    .replace(/\%21/g,'!')
			    .replace(/\%27/g,"'")
			    .replace(/\%28/g,"(")
			    .replace(/\%29/g,")")
			    .replace(/\%7E/g,"~")
		     	.replace(/\%0D/g,"\n")
		    ).replace(/</g,"&lt;")
		     .replace(/>/g,"&gt;")
		     .replace(/\n/g,"<br>")
		     .replace(/\s\s/g,"&nbsp;")
	    }catch(err){
			return '';
		} 
	}
	, reverse: function(srcString) {
	    var temp = [];
	    for(var i=srcString.length-1; i>-1; i--) {
	        temp.push(srcString.charAt(i));
	    }  
	    return temp.join("").toString();
	}
	, isTest: function(){
		var regexp = new RegExp(/test|localhost|XXX.XXX.XXX.XXX|127.0.0.1/)
		return regexp.test(location.href)
	}
	, getUrlParam: function(key){
		var m = location.href.match(new RegExp('(?:\\&|\\?)'+ key +'=([^&]+)'))
		, m = !m ? null : decodeURIComponent(m[1])
		;
		return m;
	}
	, parseUrl: function(url){
		url = url || location.href;
		var map = {url:url, host:'', hash:'', path:'/', query:''}
		url = url.replace(/^(https?):\/\//, function(t, m){
			map.protocol = m;
			return ''
		});
		console.log(url)
		var i0 = url.indexOf('/')
		if(i0>-1){
			map.host = url.substr(0, i0)
			url = url.substr(i0);
		}else{
			map.path = url;
		}
		console.log(url)
		var i1 = url.indexOf('#')
		if(i1>-1){
			map.hash = url.substr(i1+1);
			url = url.substr(0, i1)
		}
		var i2 = url.indexOf('?')
		if(i2>-1){
			map.query = url.substr(i2+1)
			map.path = url.substr(0, i2)
		}else{
			map.path = url
		}
		return map;
	}
	, split: function(str, a, b){
		var a = a || '&'
		, b = b || '='
		, tList = str.split(a)
		, map = {}
		;
		for(var i=0, l=tList.length; i<l; i++){
			var s = tList[i]
			var index = s.indexOf(b)
			if(index>-1){
				var k = s.substr(0, index)
				var v = s.substr(index+b.length)
				map[k] = v;
			}
		}
		return map;
	}
	, join: function(o, a, b){
		var tList = []
		, a = a || '&'
		, b = b || '='
		;
		for(var k in o){
			tList.push(k+''+b+o[k]);
		}
		return tList.join(a);
	}
	, pager: function(op){
		var pageTotal = op.pageTotal	//总页码数
		, count = op.count	//总条数
		, pageSize = op.pageSize	//每页条数
		, page = op.page<1 ? 1 : op.page*1	//当前页码
		, url = op.url || ''	//链接模版 eg: /?page={page} or /(?page={page})
		, pageTotal = pageTotal==null ? Math.ceil(count/pageSize) : pageTotal
		, page = page>pageTotal ? pageTotal: page
		, showNum = op.showNum || 10
		, display = {
			next: true
			, prev: true
			, first: true
			, last: true
		}
		, titleMap = {
			next: '下一页'
			, prev: '上一页'
			, first: '首页'
			, last: '尾页'
		}
		, valueMap = {
			next: page+1>pageTotal ? pageTotal :  page+1
			, prev: page-1<1 ? 1 :  page-1
			, first: 1
			, last: pageTotal
		}
		, methodMap = {
			next: 'push'
			, last: 'push'
			, prev: 'unshift'
			, first: 'unshift'
		}
		, pageList = []
		, getPageUrl = function(i, mode){
			var pageUrl;
			if((['prev', 'next'].indexOf(mode)>-1 && (i==1 || i==pageTotal) && i==page) || (mode==null && i==page)){
				return 'javascript:;';
			}
			if(i==1 && /\(/.test(url)){
				pageUrl = url.replace(/\([^\)]+\)/g, '');
			}else{
				pageUrl = url.replace(/\{page\}/g, i);
			}
			return pageUrl;
		}
		, createPage = function(f, t){
			for(var i=f; i<=t; i++){//给被选中的页码加.current
				var pageUrl = getPageUrl(i)
				, current = page==i ? ' current' : ''
				;
				pageList.push('<a class="page-nav-item'+ current +'" href="'+ pageUrl +'" data-page="'+ i +'">'+ i +'</a>')
			}
		}
		;
		op.display = op.display || {};
		op.titleMap = op.titleMap || {};
		
		for(var k in op.display){//获取出display属性
			display[k] = op.display[k];
		}
		for(var k in op.titleMap){//获取出titleMap属性
			titleMap[k] = op.titleMap[k];
		}
		if(pageTotal>showNum){
			var dot = '<a class="page-nav-item" href="javascript:;">...</a>'
			if(page<showNum-3){
				createPage(1, showNum-3);
				pageList.push(dot)
				createPage(pageTotal, pageTotal);
			}else if(page>pageTotal-showNum+4){
				createPage(1, 1);
				pageList.push(dot)
				createPage(pageTotal-showNum+4, pageTotal);
			}else{
				var t = Math.floor((showNum-5)/2);
				createPage(1, 1);
				pageList.push(dot)
				createPage(page-t, page+t);
				pageList.push(dot)
				createPage(pageTotal, pageTotal);
			}
		}else{
			createPage(1, pageTotal);
		}
		
		for(var type in display){
			if(!display[type]) continue ;
			var i = valueMap[type]
			, method = methodMap[type]
			, title = titleMap[type]
			, pageUrl = getPageUrl(i, type)
			;
			pageList[method]('<a class="page-nav-item page-nav-'+ type +'" href="'+ pageUrl +'" data-page="'+ i +'">'+ title +'</a>')
		}
		return '<div class="page-nav">'+ pageList.join('') +'</div>';
	}
	, userAgent:  function(){
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 'ios'
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return 'android'
        } else {
            return 'pc'
        };
    }
}})();