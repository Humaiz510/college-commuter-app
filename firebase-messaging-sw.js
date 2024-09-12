// This is the service worker that will handle background notifications
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCcPeF_1uLpuXByZCJOY_o5jRLALaQivBc",
    authDomain: "commuterapp-58155.firebaseapp.com",
    projectId: "commuterapp-58155",
    storageBucket: "commuterapp-58155.appspot.com",
    messagingSenderId: "311309977676",
    appId: "1:311309977676:web:6bdd631245649331ab8ce9",
    measurementId: "G-F4DRF0J0FE"
  };


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });