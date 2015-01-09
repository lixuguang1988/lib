// 用 /lib/cookie.js来代替
var Cookie = {
  set: function(c, e, d, f, a, b) {
    document.cookie = c + "=" + (b ? e : escape(e)) + ((a) ? "; expires=" + a.toGMTString() : "") + ((f) ? "; path=" + f : "; path=/") + ((d) ? "; domain=" + d : "")
  },
  get: function(c, b) {
    var a = document.cookie.match(new RegExp("(^| )" + c + "=([^;]*)(;|$)"));
    if (a != null) {
      return unescape(a[2])
    }
    return b
  },
  clear: function(a, c, b) {
    if (this.get(a)) {
      document.cookie = a + "=" + ((c) ? "; path=" + c : "; path=/") + ((b) ? "; domain=" + b : "") + ";expires=Fri, 02-Jan-1970 00:00:00 GMT"
    }
  }
};
