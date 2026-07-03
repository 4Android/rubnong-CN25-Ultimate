// ==========================================
// 📡 ส่วนที่ 1: นำเข้า Firebase และตั้งค่าเริ่มต้น
// ==========================================
// 🚨 นำเข้าเครื่องมือให้ตรงกับที่ export มาจาก config
import { db, doc, getDoc, setDoc, arrayUnion } from './firebase-config.js';

const maxOpenLimit = 1; 
const studentId = localStorage.getItem("loggedInUser"); 
const allCards = document.querySelectorAll(".hint-box");

let openedCards = []; 
let isProcessing = false; 

// ==========================================
// ⚙️ ส่วนที่ 2: ระบบดึงข้อมูลและล็อกการ์ด
// ==========================================
async function initHintSystem() {
    if (!studentId) {
        alert("ไม่พบรหัสนักศึกษา กรุณาล็อกอินใหม่");
        window.location.href = "index.html";
        return;
    }

    try {
        const docRef = doc(db, "hints", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            document.getElementById("hint-text-1").innerText = data.hint1 || "ยังไม่มีคำใบ้";
            document.getElementById("hint-text-2").innerText = data.hint2 || "ยังไม่มีคำใบ้";
            document.getElementById("hint-text-3").innerText = data.hint3 || "ยังไม่มีคำใบ้";

            openedCards = data.openedCards || []; 

            allCards.forEach(card => {
                const cardId = card.getAttribute("data-id");
                if (openedCards.includes(cardId)) {
                    card.classList.add("flipped");
                    card.style.pointerEvents = "none";
                    card.style.cursor = "default";
                }
            });

            if (openedCards.length >= maxOpenLimit) {
                lockAllCards();
            }
        } else {
            document.getElementById("hint-text-1").innerText = "พี่ยังไม่ส่งคำใบ้มาเลย 😢";
            document.getElementById("hint-text-2").innerText = "พี่ยังไม่ส่งคำใบ้มาเลย 😢";
            document.getElementById("hint-text-3").innerText = "พี่ยังไม่ส่งคำใบ้มาเลย 😢";
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
}

function lockAllCards() {
    allCards.forEach(card => {
        card.style.pointerEvents = "none";
        card.style.cursor = "default";
    });
}

// ==========================================
// 🖱️ ส่วนที่ 3: ระบบพลิกการ์ดและบันทึกขึ้น Firebase
// ==========================================
allCards.forEach(card => {
    card.addEventListener("click", async function () {
        
        if (isProcessing) return; 
        if (openedCards.length >= maxOpenLimit) return;

        const cardId = this.getAttribute("data-id");

        if (!openedCards.includes(cardId)) {
            isProcessing = true; 

            try {
                const docRef = doc(db, "hints", studentId);
                
                // 🚨 บันทึกสถานะขึ้น Firebase อย่างปลอดภัย
                await setDoc(docRef, {
                    openedCards: arrayUnion(cardId)
                }, { merge: true });

                // เมื่อเซฟลงฐานข้อมูลผ่านแล้ว ค่อยแสดงผลบนหน้าจอ
                this.classList.add("flipped");
                openedCards.push(cardId);

                if (openedCards.length >= maxOpenLimit) {
                    lockAllCards(); 
                } else {
                    this.style.pointerEvents = "none";
                    this.style.cursor = "default";
                }

            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการบันทึกไพ่:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้งครับ");
            } finally {
                isProcessing = false; 
            }
        }
    });
});

// ==========================================
// 🔙 ส่วนที่ 4: ระบบปุ่มย้อนกลับ
// ==========================================
const backBtn = document.getElementById("back-btn");
if (backBtn) {
    backBtn.addEventListener("click", function() {
        window.history.back();
    });
}

// ==========================================
// 🔄 ระบบรีเซ็ตไพ่ (สำหรับปุ่มแอดมิน)
// ==========================================
const resetBtn = document.getElementById("reset-game-btn");

if (resetBtn) {
    resetBtn.addEventListener("click", async function() {
        if (!confirm("แน่ใจนะว่าจะรีเซ็ตไพ่ใหม่ทั้งหมด?")) return;

        try {
            const docRef = doc(db, "hints", studentId);
            
            // 🚨 สั่งเขียนทับ array ให้กลายเป็นค่าว่าง (เหมือนเอาไพ่ที่หงายอยู่ออกให้หมด)
            await setDoc(docRef, {
                openedCards: [] 
            }, { merge: true });

            window.location.reload(); // รีเฟรชหน้าเว็บอัตโนมัติ

        } catch (error) {
            console.error("รีเซ็ตไม่สำเร็จ:", error);
            alert("❌ เกิดข้อผิดพลาดในการรีเซ็ต");
        }
    });
}

initHintSystem();