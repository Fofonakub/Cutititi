// final.js
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  const keys = ["pic1", "pic2", "pic3", "pic4"];
  const framePath = "Mymelodyypic/Polaroid4.png";

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  // โหลดรูปจาก localStorage ทั้งหมด
  Promise.all([
    ...keys.map(k => loadImage(localStorage.getItem(k))),
    loadImage(framePath)
  ]).then(results => {
    const images = results.slice(0, 4);
    const frameImg = results[4];

    // ถ้ารูปหายหมด ให้เตือนเลย จะได้รู้ว่า localStorage ไม่ได้เซฟ
    if (images.every(img => !img)) {
      alert("ไม่มีรูปใน localStorage เลย น่าจะยังไม่เลือกรูป หรือ upload.html ยังไม่เซฟ pic1–pic4");
    }

    // พื้นหลังขาว
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // วาดกรอบก่อน
    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, W, H);
    }

    // 🎀 ตำแหน่ง 4 ช่องให้พอดีกับกรอบ Polaroid4.png

    // ระยะขอบซ้าย–ขวา
    const leftX = 100;      // ลองปรับ 70–90 ได้ตามใจ
    const gapX  = 50;      // ช่องว่างตรงกลาง

    const slotW = (W - leftX * 2 - gapX) / 2;

    // ระยะบน–ล่าง (แบ่งเป็น 2 แถว เหนือ–ใต้แถบ so pretty!)
    const topY    = 120;   // แถวบนเริ่มตรงนี้
    const bottomY = 520;   // แถวล่างเริ่มตรงนี้
    const slotH   = 280;   // ความสูงรูปแต่ละช่อง

    const positions = [
      { x: leftX,              y: topY },    // รูป 1
      { x: leftX + slotW + gapX, y: topY },  // รูป 2
      { x: leftX,              y: bottomY }, // รูป 3
      { x: leftX + slotW + gapX, y: bottomY } // รูป 4
    ];

// พื้นหลังขาว
ctx.clearRect(0, 0, W, H);
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, W, H);

// 👉 คำนวณตำแหน่ง + วาด "รูป" ก่อน
// (ใช้ค่าที่เราเซ็ตไปแล้ว เช่น leftX, topY, bottomY, slotW, slotH)
images.forEach((img, i) => {
  if (!img) return;
  const { x, y } = positions[i];
  ctx.drawImage(img, x, y, slotW, slotH);
});

// ⭐ แล้วค่อยวาด "กรอบ" ทับทีหลัง ให้เป็นชั้นบนสุด
if (frameImg) {
  ctx.drawImage(frameImg, 0, 0, W, H);
}

  // ปุ่ม Download
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "cuteshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // ปุ่ม Restart
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", () => {
    localStorage.removeItem("pic1");
    localStorage.removeItem("pic2");
    localStorage.removeItem("pic3");
    localStorage.removeItem("pic4");
    window.location.href = "upload.html";
  });
});
