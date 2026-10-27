const firebaseConfig = {
  apiKey: "AIzaSyAaxBppqXghg8nhAnPLRdvl5hprGS1NQSw",
  authDomain: "saudi-redline-655ad.firebaseapp.com",
  projectId: "saudi-redline-655ad",
  storageBucket: "saudi-redline-655ad.firebasestorage.app",
  messagingSenderId: "601535027952",
  appId: "1:601535027952:web:43cb40cc0bc0ef3410c035",
  measurementId: "G-60YGDVBF4P"
};

// تهيئة Firebase مرة واحدة
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

const ADMIN_EMAIL = "so70.90p@gmail.com";

// التحقق من حساب المسؤولة والبريد الموثق
const isAdmin = () => {
  return !!auth.currentUser
    && auth.currentUser.email === ADMIN_EMAIL;
};

// عرض معلومات تشخيصية بعد تحميل الملف
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Admin email:", user.email);
    console.log("Email verified:", user.emailVerified);
    console.log("Is admin:", isAdmin());
  } else {
    console.log("No user signed in.");
  }
});
