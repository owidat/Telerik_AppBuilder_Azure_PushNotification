# Telerik AppBuilder Azure PushNotification

This is a Telerik AppBuilder project example, shows how to connect with Azure Notification hub and Azure mobile services to send Push Notifications.


  - Create Windows Azure Mobile service
  - Enable push from Azure Notification Hub
  - Setup Apple APNS from (https://developer.apple.com/account/ios/certificate/)
  - Setup Google GCM from (https://console.developers.google.com/project/) 
  - Setup Microsoft MPNS from (https://dev.windows.com/)
  - Setup AppBuilder with Apple and google https://www.youtube.com/watch?v=Idp4CDZiD_Q
  - Change Azure MOBILE_SERVICE_URL, MOBILE_SERVICE_APP_KEY and Google GCM_SENDER_ID in the app.js
  - Make sure you setup the correct Application Identifier and Windows Publisher name and ID from AppBuilder > Properties > General and AppBuilder > Properties > Windows Phone
  - Enable PushPlugin from AppBuilder > Properties > Plugins > Other Plugins
  - Build and Deploy (on Debug build) to test devices (this dose not work simulator or emulator)
  - Make sure you see the "Registered with hub!" alert.
  - (Currently I'm having an issue till this point) Send test push notifications from https://manage.windowsazure.com/ > service bus > NOTIFICATION HUBS > click on the instance of NOTIFICATION HUB you are using > DEBUG > Then test each PLATFORM
