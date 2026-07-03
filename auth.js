// 🔌 1. นำเข้า Firebase และ Firestore (Database) ผ่าน CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔑 2. กุญแจเชื่อมต่อโปรเจกต์ของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyAMzb-xwfm2C2blsZZnM-DWUeFRGZHjxAY",
    authDomain: "rubnong-8c7cc.firebaseapp.com",
    projectId: "rubnong-8c7cc",
    storageBucket: "rubnong-8c7cc.firebasestorage.app",
    messagingSenderId: "66154801636",
    appId: "1:66154801636:web:848e5f4d5ecee5af817ff1",
    measurementId: "G-5C9Y9K4JXN"
};

// 🚀 3. สั่งเดินเครื่อง Firebase และ Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// โค้ดสลับหน้า Login/Register 
// ==========================================
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const goToRegisterBtn = document.getElementById('go-to-register');
const goToLoginBtn = document.getElementById('go-to-login');

goToRegisterBtn.addEventListener('click', function(e) {
    e.preventDefault(); 
    loginSection.style.display = 'none';      
    registerSection.style.display = 'block';  
});

goToLoginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    registerSection.style.display = 'none';   
    loginSection.style.display = 'block';     
});

// ==========================================
// 🚀 ระบบลงทะเบียน (ส่งข้อมูลขึ้น Firebase)
// ==========================================
const registerForm = document.getElementById('register-form');

// 🌟 สร้างกล่องข้อความแจ้งเตือนสีแดง สำหรับหน้าลงทะเบียน
const regErrorMsg = document.createElement("p");
regErrorMsg.style.color = "#ff4d4d";
regErrorMsg.style.fontSize = "0.9rem";
regErrorMsg.style.marginTop = "10px";
regErrorMsg.style.marginBottom = "0px";
regErrorMsg.style.display = "none"; 
regErrorMsg.style.textAlign = "center";
registerForm.appendChild(regErrorMsg); 

registerForm.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    // 🌟 ซ่อนข้อความแจ้งเตือนเวลาเริ่มกดปุ่มสร้างบัญชีใหม่
    regErrorMsg.style.display = "none";

    const studentIdInput = document.getElementById('reg-student-id').value;
    const nicknameInput = document.getElementById('reg-name').value;
    const passwordInput = document.getElementById('reg-password').value;
    const confirmPasswordInput = document.getElementById('reg-confirm-password').value;

    // 🌟 เช็กว่ารหัสผ่านทั้ง 2 ช่องตรงกันไหม
    if (passwordInput !== confirmPasswordInput) {
        regErrorMsg.innerText = "❌ รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้งครับ!";
        regErrorMsg.style.display = "block"; // โชว์ข้อความสีแดงแทน alert
        return; // หยุดการทำงาน ไม่ส่งข้อมูลขึ้น Firebase
    }

    try {
        await addDoc(collection(db, "freshmen"), {
            student_id: studentIdInput,
            nickname: nicknameInput,
            password: passwordInput,
            senior_id: null, 
            timestamp: new Date() 
        });

        // ส่วนที่สำเร็จแล้วยังคงใช้ alert ไว้ เพื่อให้เด่นชัดก่อนเด้งสลับหน้า
        alert("🎉 ลงทะเบียนสำเร็จ! เข้าสู่ระบบสายรหัสได้เลย");
        
        registerForm.reset(); 
        registerSection.style.display = 'none';   
        loginSection.style.display = 'block';     

    } catch (error) {
        console.error("พังซะแล้ว: ", error);
        regErrorMsg.innerText = "❌ เกิดข้อผิดพลาดในการลงทะเบียน ลองใหม่อีกครั้งนะ";
        regErrorMsg.style.display = "block"; // โชว์ข้อความสีแดงแทน alert
    }
});

// ==========================================
// 🔐 ระบบเข้าสู่ระบบ (Login)
// ==========================================
const loginForm = document.getElementById('login-form');

// 🌟 สร้างกล่องข้อความแจ้งเตือนสีแดง (หน้า Login)
const errorMsg = document.createElement("p");
errorMsg.style.color = "#ff4d4d";
errorMsg.style.fontSize = "0.9rem";
errorMsg.style.marginTop = "10px";
errorMsg.style.marginBottom = "0px";
errorMsg.style.display = "none"; 
errorMsg.style.textAlign = "center";
loginForm.appendChild(errorMsg); 

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const loginStudentId = document.getElementById('student-id').value;
    const loginPassword = document.getElementById('password').value;

    // ซ่อนข้อความแจ้งเตือนเวลาเริ่มกดล็อกอินใหม่
    errorMsg.style.display = "none";

    try {
        const freshmenRef = collection(db, "freshmen");
        const q = query(freshmenRef, where("student_id", "==", loginStudentId), where("password", "==", loginPassword));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // 🎉 ล็อกอินสำเร็จ 
            localStorage.setItem("loggedInUser", loginStudentId);
            
            // 🚀 วาร์ปไปหน้าเมนูทันที ไม่มี Alert กวนใจ
            window.location.href = "menu-card.html";
            
        } else {
            // ❌ ล็อกอินไม่สำเร็จ โชว์ข้อความสีแดง
            errorMsg.innerText = "❌ รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
            errorMsg.style.display = "block";
        }
    } catch (error) {
        console.error("ระบบล็อกอินมีปัญหา: ", error);
        errorMsg.innerText = "❌ เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูลครับ";
        errorMsg.style.display = "block";
    }
});

// ==========================================
// ระบบปุ่มย้อนกลับ
// ==========================================
const currentPage = window.location.pathname.split("/").pop();
const excludedPages = ["index.html", "menu-card.html", ""];

if (!excludedPages.includes(currentPage)) {
    const backBtnContainer = document.createElement("div");
    backBtnContainer.className = "back-btn-container";
    backBtnContainer.innerHTML = '<button id="back-btn">⬅ ย้อนกลับ</button>';
    
    document.body.appendChild(backBtnContainer);

    document.getElementById("back-btn").addEventListener("click", function() {
        window.history.back();
    });
}