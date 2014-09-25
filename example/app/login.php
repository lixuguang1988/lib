<style type="text/css">
.dialog-login{padding:40px 20px 20px;font-family:"microsoft yahei";}
.dialog-login .info{margin-left:100px;color:#fe2617;margin-bottom:10px;font-size:12px}
.dialog-login .form-group{margin-bottom:20px;}
.dialog-login .form-label{float:left;width:85px;text-align:right;color:#464646;padding-top:3px;font-size:16px;}
.dialog-login .form-control{margin-left:100px;}
.dialog-login .form-control .text{border:1px solid #dadada;padding:6px 5px;height:20px;line-height:20px;width:220px;
	-webkit-transition: all linear .2s;
	   -moz-transition: all linear .2s;
	     -o-transition: all linear .2s;
	        transition: all linear .2s;
}
.dialog-login .form-control .text:focus{
	border-color: rgb(82, 168, 236);
	border-color: rgba(82, 168, 236, 0.8);
	outline: 0;
	-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
	   -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
	        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
}
.dialog-login .submit{background:#039ce2;width:100px;height:40px;font-size:18px;color:#fff;border:none;text-align:center;}
</style>
<form class="dialog-login" name="login" action="./app/loginexec.php" method="post">
	<div class="info"></div>
    <div class="form-group">
        <label class="form-label" for="username">用户名</label>
        <div class="form-control"><input class="text" type="text" id="username" value="" autocomplete="off" name="username"></div>
    </div>
    <div class="form-group">
        <label class="form-label" for="password">密码</label>
        <div class="form-control"><input class="text" type="password" id="password" value="" autocomplete="off" name="password"></div>
    </div>
    <div class="form-group">
        <label class="form-label">&nbsp;</label>
        <div class="form-control"><input type="submit" value="登录" class="submit"></div>
    </div>
 </form>
 
 <script>
 		//登录check验证
		$(".dialog-login").on("submit",function(){
		    var _ = $(this);
			var _name= _.find("input[name=username]").val();
			var _password=_.find("input[name=password]").val();
			var _tip = _.find(".info");
			_tip.html("");
			if($.trim(_name)==""){
				_tip.html("请输入用户名！");
				return false;
			}
			else if($.trim(_password)==""){
				_tip.html("请输入密码！");
				return false;
			}
			
			//登录
			$.ajax({
			    type:'POST',
				url:_.attr('post'),
				data:{loginName:_name,passwd:_password},
				dataType:"json",
				success:function(data)
				{
				    alert(data);
				
				}
			});
			return false;
		});

 </script>