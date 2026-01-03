importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC_QssqhfkPNyQhYE6PTLfNyRe0UTC5c1A",
  authDomain: "mood-tracker-ac8d8.firebaseapp.com",
  projectId: "mood-tracker-ac8d8",
  storageBucket: "mood-tracker-ac8d8.firebasestorage.app",
  messagingSenderId: "141697910058",
  appId: "1:141697910058:web:769969fdcf83738725ca53"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Daily Mood';
  const notificationOptions = {
    body: payload.notification?.body || "N'oubliez pas de noter votre journée !",
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    tag: 'daily-reminder',
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/dashboard')
  );
});
