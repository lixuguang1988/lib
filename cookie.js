//base on  Professional JavaScript for Web(1)
//cookie设置的格式
//cookie_name=cookie_value; expires=expiration_time; path=domain_pah; domain=domain_name; secure
//同时支持
//cookie_name=cookie_value; max-age=expiresseconds; path=domain_pah; domain=domain_name; secure
var Cookie = Cookie || {};

/**
 * 设置cookie的值
 * @param {string} sName cookie的名字
 * @param {string} sValue cookie的值
 * @param {date} oExpires cookie的过期日期 || cookie保留的天数
 * @param {string} sPath  cookie的路径
 * @param {string} sDomain cookie的域名 
 * @param {boolean} bSecure cookie是否是安全连接https||ssl
 */
Cookie.set =  function(sName, sValue, oExpires, sPath, sDomain, bSecure){
	var sCookie = sName + "=" + encodeURIComponent(sValue);
	if(typeof oExpires === "object"){
		sCookie +="; expires=" + oExpires.toGMTString();
	}
    if(typeof oExpires === "number"){
        sCookie +="; max-age=" + oExpires * 24 * 60 * 60;
    }
	sPath = sPath || "/";
	sCookie +="; path=" +sPath ;
	if(sDomain){
		sCookie +="; domain=" + sDomain;
	}
	if(bSecure){
		sCookie +="; secure";
	}
	document.cookie = sCookie;
};
/**
 * 获取指定的cookie
 * @param {string} sName 要取cookie的名字
 */
Cookie.get = function(sName){
	var sRe = "(?:; )?" + sName + "=([^;]*);?";
	var oRe = new RegExp(sRe);
	if(oRe.test(document.cookie)){
		return decodeURIComponent(RegExp["$1"]);
	}else{
		return null;
	}
};

/**
 * 删除指定的cookie
 * @param {string} sName 待删除cookie的名字
 * @param {string} sPath 待删除cookie的路径  (删除指定的cookie sPath,sDomain要和设置的时候一致才可删除成功)
 * @param {string} sDomain 待删除cookie的域名
 * @param {boolean} bSecure cookie是否是安全连接https||ssl
 */
Cookie.clear =  function(sName, sPath, sDomain, bSecure){
	this.set(sName, "", new Date(0), sPath, sDomain, bSecure);
};

