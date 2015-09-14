(function (global) {
    /*var mobileSkin = "Native",*/
    app = global.app = global.app || {},
    os = kendo.support.mobileOS,
    statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";
    
    global.app.deviceWidth = 320;
    
    
    
    // #region notification-registration
    // Set these global variables to the settings for your
    // Azure Mobile Service. 
    global.app.MOBILE_SERVICE_URL = 'MOBILE_SERVICE_URL';
    global.app.MOBILE_SERVICE_APP_KEY = 'MOBILE_SERVICE_APP_KEY';

    // Numeric part of the project ID assigned by the Google API console.
    global.app.GCM_SENDER_ID = 'GCM_SENDER_ID';

    // Define the MobileServiceClient as a global variable. 
    global.app.mobileClient;
    
    
    global.app.Register = function () {
        
        try {
            app.mobileClient = new WindowsAzure.MobileServiceClient(app.MOBILE_SERVICE_URL, app.MOBILE_SERVICE_APP_KEY);
    	    			
            // Define the PushPlugin.
    		var pushNotification = window.plugins.pushNotification;
            
            //var device = windows.plugins
    		
    		// Platform-specific registrations.
            if ( device.platform === 'android' || device.platform === 'Android' ){
                //alert();
    			// Register with GCM for Android apps.
                pushNotification.register(
                   app.successHandler, app.errorHandler,
                   { 
    				"senderID": app.GCM_SENDER_ID, 
    				"ecb": "app.onNotificationGCM" 
    				});
            } else if (device.platform === 'iOS') {
                // Register with APNS for iOS apps.			
                pushNotification.register(
                    app.tokenHandler,
                    app.errorHandler, { 
    					"badge":"true",
    					"sound":"true",
    					"alert":"true",
                        "ecb": "app.onNotificationAPN"
                    });
            }
    		else if(device.platform === "Win32NT"){
    			// Register with MPNS for WP8 apps.
    			pushNotification.register(
    				app.channelHandler,
    				app.errorHandler,
    				{
    					"channelName": "MyPushChannel",
    					"ecb": "app.onNotificationWP8",
    					"uccb": "app.channelHandler",
    					"errcb": "app.ErrorHandler"
    			});
    		}
        }catch (err) {
            alert((err.message)?err.message:"Error 222");
        }
    }
    
    

    // #endregion notifications-registration
    
    
    document.addEventListener('deviceready', function () {
       
        try {
            if (typeof (window.innerWidth) === 'number') {
                windowHeight = window.innerHeight;
                windowWidth = window.innerWidth;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                windowHeight = document.documentElement.clientHeight;
                windowWidth = document.documentElement.clientWidth;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                windowHeight = document.body.clientHeight;
                windowWidth = document.body.clientWidth;
            }
            app.deviceWidth = windowWidth;
        }catch (err) {
        }
        
    }
    , false);
    
    // #region notification-callbacks
    // Callbacks from PushPlugin
    global.app.onNotificationGCM = function (e) {
        switch (e.event) {
            case 'registered':
                // Handle the registration.
                if (e.regid.length > 0) {
                    console.log("gcm id " + e.regid);

                    if (app.mobileClient) {

                        // Create the integrated Notification Hub client.
                        var hub = new NotificationHub(app.mobileClient);

                        // Template registration.
                        var template = "{ \"data\" : {\"message\":\"$(message)\"}}";

						// Register for notifications.
                        // (gcmRegId, ["tag1","tag2"], templateName, templateBody)
                        hub.gcm.register(e.regid, null, "myTemplate", template).done(function () {
                            alert("Registered with hub!");
                        }).fail(function (error) {
                            alert("Failed registering with hub: " + error);
                        });
                    }
                }
                break;

            case 'message':
			
				if (e.foreground)
				{
					// Handle the received notification when the app is running
					// and display the alert message. 
					alert(e.payload.message);
					
					// Reload the items list.
					//refreshTodoItems();
				}
                break;

            case 'error':
                alert('GCM error: ' + e.message);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    }

    // Handle the token from APNS and create a new hub registration.
    global.app.tokenHandler = function (result) {
        //alert(result);
        if (app.mobileClient) {

            // Create the integrated Notification Hub client.
			var hub = new NotificationHub(app.mobileClient);
            //alert(hub);
            // This is a template registration.
            var template = "{\"aps\":{\"alert\":\"$(message)\"}}";

			// Register for notifications.
            // (deviceId, ["tag1","tag2"], templateName, templateBody, expiration)
            hub.apns.register(result, null, "myTemplate", template, null).done(function () {
                alert("Registered with hub!");
            }).fail(function (error) {
                alert("Failed registering with hub : " + error);
            });
        }
    }

    // Handle the notification when the iOS app is running.
    global.app.onNotificationAPN = function (event) {
 
		if (event.alert){
			 // Display the alert message in an alert.
			alert(event.alert);
			
		}


    }
		
    // Handle the channel URI from MPNS and create a new hub registration. 
    global.app.channelHandler = function(result) {
        if (result.uri !== "")
        {
            if (app.mobileClient) {

                // Create the integrated Notification Hub client.
                var hub = new NotificationHub(app.mobileClient);

                // This is a template registration.
                var template = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<wp:Notification xmlns:wp=\"WPNotification\">" +
                        "<wp:Toast>" +
                            "<wp:Text1>$(message)</wp:Text1>" +
                        "</wp:Toast>" +
                    "</wp:Notification>";
               
				// Register for notifications.
                // (channelUri, ["tag1","tag2"] , templateName, templateBody)
                hub.mpns.register(result.uri, null, "myTemplate", template).done(function () {
                    alert("Registered with hub!");
                }).fail(function (error) {
                    alert("Failed registering with hub: " + error);
                });
            }
        }
        else{
            console.log('channel URI could not be obtained!');
        }
    }
		
    // Handle the notification when the WP8 app is running.
    global.app.onNotificationWP8 = function(event){
        if (event.jsonContent)
        {
            // Display the alert message in an alert.
            alert(event.jsonContent['wp:Text1']);
			
			// Reload the items list.
			//refreshTodoItems();
        }
    }
    
    
    global.app.successHandler = function(result) {
        console.log('successHandler: ' + result);
    }
    
    global.app.errorHandler = function(error) {
        console.log("errorHandler: " + error);
    }
    
    app.application = new kendo.mobile.Application(document.body, {
                                                       layout: "tabstrip-layout", 
                                                       statusBarStyle: statusBarStyle, 
                                                       skin: "flat" , 
                                                       initial: "#tabstrip-home"
                                                   });
    
    global.app.home = function(e) {
               
        
    }
    
    // reset global drawer instance, for demo purposes
    kendo.mobile.ui.Drawer.current = null;
})(window);
