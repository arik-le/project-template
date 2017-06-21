var login=function()
{
	var usersAndKeys = [2]; 
	var correntUser=[2];	
	var correntClub=[1];

	var deviceType;
	var database;

	var connectionPage = {
		inputSection:
			"<div class = '+deviceType+'>"+
			"<div class='login-page'>"+

				"<div class='form'>"+
					"<div class='login-form'>"+
						"<img src ='images/pictureLogo.jpg' width='200' height='110'/>"+
						"<input  id='username' type='text' value='g@g.com' placeholder='הכנס שם משתמש'/>"+
						"<input  id='password' type='password' value='123123' placeholder='הכנס סיסמה'/>"+

						"<h5 id ='forgotPass'>שכחתי סיסמה</h5>"+
						"<button id = 'cmdLogin' >כניסה</button>"+
						"<img id='loader' src='images/homepreloader.gif'/ width ='40%'>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>"
	};
		
	var stateMap = {$container : null };
		
//---------------------------------------------------------------------------------------------------//

	var loginClick = function(e)
	{
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		if(username === "" || password === "")
		{
			alert("אנא הכנס שם משתמש וסיסמה");
			return;
		}
		// validateAndPushUser(username,password);

		var auth = firebase.auth();
		
	
		var promise = auth.signInWithEmailAndPassword(username,password);
		promise.then(function(user){
			var ref = firebase.database().ref("users");
				ref.once("value")
				.then(function(data)		
				{
					var allUsers = data.val();   // get the whole tree of clubhouses
					var keys = Object.keys(allUsers);	// get all keys
					
					usersAndKeys[0]= allUsers;
					usersAndKeys[1] = keys;
					correntUser[1] = user.uid; 
					correntUser[0] = allUsers[user.uid];
					correntClub[0] = allUsers[user.uid].clubhouseKey;
					$("#loader").css("display", "inline-block");
					mainPage.openMainPage(correntUser[1]); 
				});

				
		});
		promise.catch(function(err)
		{
			if(err.message == 'the email address is badly formatted.')
				alert("שם המשתמש שהוזן אינו כתובת מייל חוקית");
			if(err.message == 'There is no user record corresponding to this identifier. The user may have been deleted.')
				alert('שם משתמש או סיסמא אינם נכונים');
		});
	}

//-------------------------------------------------------------------------------------------
	
	var rejectUser = function(data)			// in case password or username are not exist
	{
		alert("שם משתמש או סיסמה אינם נכונים");
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	}

//---------------------------------------------------------------------------------------------------//

	var allreadyOnline = function()
	{
		alert("המשתמש כבר נמצא במערכת - במידה ונתקלת בבעיה פנה למנהל המורשה");
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
	};

//---------------------------------------------------------------------------------------------------
	
	var getObj=function(key)
	{
		return usersAndKeys[0][key];	
	}

//---------------------------------------------------------------------------------------------------//	
   	
	var sendPassByEmail = function()
	{
		var txt;
		var email = document.getElementById("username").value;
		var fillEmail = prompt("נא להזין כתובת מייל תקינה:",email );

		var auth = firebase.auth();
		auth.sendPasswordResetEmail(fillEmail).then(function() {
			alert("פעולה הושלמה - בעוד מספר דקות ישלח אליך מייל לשחזור הסיסמה");
		}, function(error) {
			console.log(error);	
			alert("מייל זה לא נמצא במערכת");
		});
			
	}
	var initModule = function($container) 
	{
		database = firebase.database();			// A reference for the database
		stateMap.$container = $container;
		$("body").html(connectionPage.inputSection);
		$("#cmdLogin").click(loginClick);
		$("#forgotPass").click(sendPassByEmail);
	};

return { initModule : initModule,
		 usersAndKeys:usersAndKeys,
		 correntUser:correntUser,
		 correntClub:correntClub,
		 getObj:getObj};
}();

$(document).ready(function() {login.initModule($("#login")) ; });