let isFileUploaded = false;

document.getElementById('uploadbtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const fileList = event.target.files;
    let output = '';

    // Check if files are uploaded
    if (fileList.length > 0) {
        isFileUploaded = true;
        document.getElementById('uploadbtn').classList.add('bottom-left');
    } else {
        isFileUploaded = false;
        document.getElementById('uploadbtn').classList.remove('bottom-left');
    }

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileType = file.type.split('/')[0]; // Get file type (e.g., image, application)

        let fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.textContent = file.name;

        // Add an onclick listener to each file
        fileItem.onclick = function() {
            previewFileInNewTab(file);  // Call the preview function when clicked
        };

        fileDisplay.appendChild(fileItem);
    }
});

// Function to open the file in a new tab
function previewFileInNewTab(file) {
    const fileURL = URL.createObjectURL(file); // Create a blob URL for the file
    window.open(fileURL, '_blank'); // Open the file in a new tab
}
