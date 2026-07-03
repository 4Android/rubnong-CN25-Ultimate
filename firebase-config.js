// 1. นำเข้าเครื่องมือจาก Firebase (ผ่าน CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// 🚨 เพิ่ม arrayUnion ตรงบรรทัดนี้ เพื่อให้ระบบเพิ่มข้อมูลลง Array ได้
import { getFirestore, doc, setDoc, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. 🔑 Config ของบอส
const firebaseConfig = {
  apiKey: "AIzaSyAZU934F6ItDEXdaZawMAjRKSsL4Ip4hiE",
  authDomain: "rubnong-cn25-d62d5.firebaseapp.com",
  projectId: "rubnong-cn25-d62d5",
  storageBucket: "rubnong-cn25-d62d5.firebasestorage.app",
  messagingSenderId: "342754145104",
  appId: "1:342754145104:web:6eafa4c63eb6df9750f255"
};

// 3. สั่งเปิดใช้งาน Firebase และ Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. 🚨 ส่งออกเครื่องมือไปให้ไฟล์อื่นเรียกใช้ (ต้องมี arrayUnion ด้วย!)
export { db, doc, setDoc, getDoc, arrayUnion };