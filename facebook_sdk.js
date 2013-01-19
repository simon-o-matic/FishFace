// facebook api
var FacebookAPI = (function() {
	var token 			= null;

	var scope 			= "manage_notifications,email,read_stream";
	var url 			= "https://www.facebook.com/connect/login_success.html";
	var FB_LOGIN_URL 	= "https://www.facebook.com/dialog/oauth?client_id=484604011580868&redirect_uri=" + url + "&scope="+scope+"&response_type=token";	

	var API_URL 		= "https://graph.facebook.com/me";

	// optional callbacks
	var tokenExpiredCallback,
		apiErrorCallback;

	function processApiResponse(data, callback) {
		if (data.status == 400 ) {
			console.log("API: Token expire");
			if (tokenExpiredCallback) { 
				tokenExpiredCallback(data) 
			}
		} else if (data.status == 200 ) {
			console.log("API: all good");
			callback(JSON.parse(data.responseText));
		} else {
			console.log("API: major issue: " + JSON.stringify(data));
			if (apiErrorCallback) apiErrorCallback(data);
		}
	}

	function callApi (action, callback) {
		token = localStorage.fishbowl;

		$.ajax({
    		url: API_URL + "/" + action + "?access_token=" + token,
    		success: function(data) { 
    			console.log("Success calling API");
    			processApiResponse(data, callback); 
    		},
    		error: function(data)  { 
    			// Why are good requests handled by the error function, no idea!
    			console.log("Error calling API");
    			processApiResponse(data, callback); 
    		}
 		});
	}

	var me = {
		setTokenExpiredCallback: function(callback) {
			tokenExpiredCallback = callback;
		},

		setApiErrorCallback: function(callback) {
			apiErrorCallback = callback;
		},
		
		setToken: function(token) {
			this.token = token;
		},

		friends: function(callback) {
			callApi ("friends", callback);
		},

		me: function(callback) {
			callApi("", callback);
		},

		login: loginPopupToFaceBook
	}

	function loginPopupToFaceBook() {
		var wopts = {
			url: FB_LOGIN_URL,
			type: 'popup',
			width: 800,
			height: 500,
			top:100,
			left: 200,
			focused: true		
		}

		// tell the background page to listen for the success page
		chrome.extension.getBackgroundPage().listenForFacebookLogin();

		// open the login window
		chrome.windows.create(wopts);

		/*
		Supported scopes: ads_management create_event create_note email export_stream friends_about_me 
		friends_activities friends_birthday friends_checkins friends_education_history friends_events 
		friends_games_activity friends_groups friends_hometown friends_interests friends_likes 
		friends_location friends_notes friends_online_presence friends_photo_video_tags friends_photos 
		friends_questions friends_relationship_details friends_relationships friends_religion_politics 
		friends_status friends_subscriptions friends_videos friends_website friends_work_history 
		manage_friendlists manage_notifications manage_pages offline_access photo_upload 
		publish_actions publish_checkins publish_stream read_friendlists read_insights read_mailbox 
		read_page_mailboxes read_requests read_stream rsvp_event share_item sms status_update 
		user_about_me user_activities user_birthday user_checkins user_education_history user_events 
		user_games_activity user_groups user_hometown user_interests user_likes user_location 
		user_notes user_online_presence user_photo_video_tags user_photos user_questions 
		user_relationship_details user_relationships user_religion_politics user_status 
		user_subscriptions user_videos user_website user_work_history video_upload xmpp_login
		*/
	}

	return me;
})();