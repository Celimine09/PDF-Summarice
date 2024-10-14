let isFolderSelected = false;
let folderFiles = [];

document.getElementById('uploadbtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileList = event.target.files;
    const fileDisplay = document.getElementById('fileDisplay');
    const uploadBtn = document.getElementById('uploadbtn');
    
    fileDisplay.innerHTML = '';
    folderFiles = [];

    if (fileList.length > 0) {
        isFolderSelected = true;
        const firstFile = fileList[0];
        const folderName = firstFile.webkitRelativePath.split('/')[0];

        let folderItem = document.createElement('div');
        folderItem.classList.add('folder-item');
        folderItem.innerHTML = `<i class="fas fa-folder"></i>${folderName}`;
        fileDisplay.appendChild(folderItem);

        for (let i = 0; i < fileList.length; i++) {
            folderFiles.push(fileList[i]);
        }

        uploadBtn.textContent = 'Change Folder';
        document.getElementById('summarizebtn').style.display = 'inline-block';
    } else {
        isFolderSelected = false;
        uploadBtn.textContent = 'Upload';
        document.getElementById('summarizebtn').style.display = 'none';
    }
});

document.getElementById('summarizebtn').addEventListener('click', function () {
    if (!isFolderSelected) {
        alert('Please upload a folder first.');
        return;
    }

    const formData = new FormData();
    folderFiles.forEach(file => {
        formData.append('files[]', file, file.webkitRelativePath);
    });

    // Show progress bar
    document.getElementById('progressContainer').style.display = 'block';
    const progressBar = document.getElementById('progressBar');
    progressBar.value = 0;

    // Start EventSource for progress tracking
    const evtSource = new EventSource('/progress');
    evtSource.onmessage = function (event) {
        const progressValue = event.data;
        progressBar.value = progressValue;

        if (progressValue == 100) {
            evtSource.close();
        }
    };

    // Send folder data to backend for summarization
    fetch('/summarize', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Summarization complete:', data);
        alert('Summarization completed successfully!');

        // Show download and share buttons
        document.getElementById('downloadbtn').style.display = 'inline-block';
        document.getElementById('sharebtn').style.display = 'inline-block';

        // Reset summarize button
        document.getElementById('summarizebtn').textContent = 'Summarize';
        document.getElementById('summarizebtn').disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while summarizing the folder.');

        // Reset summarize button
        document.getElementById('summarizebtn').textContent = 'Summarize';
        document.getElementById('summarizebtn').disabled = false;
    });
});



document.getElementById('downloadbtn').addEventListener('click', function() {
    fetch('/download-summary')
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'summary.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('sharebtn').addEventListener('click', function() {
    alert('Share functionality not implemented yet.');
});