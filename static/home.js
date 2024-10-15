let isFolderSelected = false;
let folderFiles = [];

// Handle folder selection
document.getElementById('uploadbtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// Handle file input change
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

        // Show fileDisplay and update button text
        fileDisplay.style.display = 'block';

        uploadBtn.textContent = 'Change Folder';
        document.getElementById('summarizebtn').style.display = 'inline-block';
    } else {
        isFolderSelected = false;
        uploadBtn.textContent = 'Upload';
        document.getElementById('summarizebtn').style.display = 'none';
    }
});

// Handle summarize button click
document.getElementById('summarizebtn').addEventListener('click', function () {
    if (!isFolderSelected) {
        alert('Please upload a folder first.');
        return;
    }

    // Get the job description input
    const jobDescription = document.getElementById('jobDescription').value;
    if (!jobDescription) {
        alert('Please enter a job description.');
        return;
    }

    const formData = new FormData();
    formData.append('job_description', jobDescription); // Add job description to the formData
    folderFiles.forEach(file => {
        formData.append('files[]', file, file.webkitRelativePath);
    });

    // Show loading spinner, percentage, and dim background
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.querySelector('.content').classList.add('dimmed');

    // Send folder data and job description to backend for summarization
    fetch('/summarize', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Summarization complete:', data);
        alert('Summarization completed successfully!');

        // Hide spinner and remove dimmed background effect
        document.getElementById('loadingSpinner').style.display = 'none';
        document.querySelector('.content').classList.remove('dimmed');

        // Show download button
        document.getElementById('downloadbtn').style.display = 'inline-block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while summarizing the folder.');

        // Hide spinner and remove dimmed background effect in case of error
        document.getElementById('loadingSpinner').style.display = 'none';
        document.querySelector('.content').classList.remove('dimmed');
    });
});

// Handle download button click
document.getElementById('downloadbtn').addEventListener('click', function () {
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