let isFolderSelected = false;
let folderFiles = [];

document.getElementById('uploadbtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileList = event.target.files;
    const fileDisplay = document.getElementById('fileDisplay');
    const uploadBtn = document.getElementById('uploadbtn');
    
    fileDisplay.innerHTML = '';  // ลบรายการไฟล์เก่าออก
    folderFiles = [];  // ล้างข้อมูลไฟล์เก่า

    // ตรวจสอบว่ามีการเลือกโฟลเดอร์
    if (fileList.length > 0) {
        isFolderSelected = true;

        // นำชื่อโฟลเดอร์จากไฟล์แรกในโฟลเดอร์มาแสดง
        const firstFile = fileList[0];
        const folderName = firstFile.webkitRelativePath.split('/')[0];  // ดึงชื่อโฟลเดอร์

        // แสดงชื่อโฟลเดอร์
        let folderItem = document.createElement('div');
        folderItem.classList.add('folder-item');
        folderItem.textContent = folderName;

        // เพิ่มไอคอนโฟลเดอร์จาก Font Awesome
        folderItem.innerHTML = `<i class="fas fa-folder"></i>${folderName}`;

        fileDisplay.appendChild(folderItem);

        // เก็บไฟล์ใน array สำหรับส่งไปยัง backend
        for (let i = 0; i < fileList.length; i++) {
            folderFiles.push(fileList[i]);
        }

        // เพิ่มคลาส 'bottom-left' เพื่อย้ายปุ่มไปมุมซ้ายล่าง
        uploadBtn.classList.add('bottom-left');
    } else {
        isFolderSelected = false;

        // เอาคลาส 'bottom-left' ออกหากไม่มีการเลือกโฟลเดอร์
        uploadBtn.classList.remove('bottom-left');
    }
});

// Summarize button click event to send the folder to backend
// document.getElementById('summarizebtn').addEventListener('click', function () {
//     if (!isFolderSelected) {
//         alert('Please upload a folder first.');
//         return;
//     }

//     const formData = new FormData();

//     // Append each file in the folder to FormData
//     folderFiles.forEach(file => {
//         formData.append('files', file, file.webkitRelativePath);
//     });

//     // Send folder data to backend via Fetch API
//     fetch('/upload-folder', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         alert('Folder summarized successfully!');

//         // Show download and share buttons
//         document.getElementById('downloadbtn').style.display = 'block';
//         document.getElementById('sharebtn').style.display = 'block';
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });
