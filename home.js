let isFileUploaded = false; // กำหนดค่าเริ่มต้นเป็น false

document.getElementById('uploadbtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileList = event.target.files;
    let output = '';

    // เช็คว่ามีไฟล์ถูกอัพโหลดเข้ามาหรือยัง
    if (fileList.length > 0) {
        isFileUploaded = true; // ตั้งเป็น true เมื่อมีไฟล์เพิ่ม
    } else {
        isFileUploaded = false; // ตั้งเป็น false เมื่อไม่มีไฟล์
    }

    for (let i = 0; i < fileList.length; i++) {
        output += fileList[i].name + '<br>';
    }

    // อัพเดตเนื้อหาภายใน div fileDisplay เพื่อแสดงชื่อไฟล์
    document.getElementById('fileDisplay').innerHTML = output;
});

// สามารถเช็คค่า isFileUploaded ได้ในโค้ดส่วนอื่นๆ เช่น
console.log(isFileUploaded); // จะบอกสถานะว่าอัพโหลดไฟล์หรือยัง
