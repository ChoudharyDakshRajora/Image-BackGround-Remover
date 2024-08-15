document.getElementById('process').addEventListener('click', async() => {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        const imageUrl = event.target.result;

        // Perform background removal
        try {
            const processedImageUrl = await removeBackground(imageUrl);
            const outputImg = document.getElementById('output');
            const downloadLink = document.getElementById('download');

            outputImg.src = processedImageUrl;
            outputImg.style.display = 'block';
            downloadLink.href = processedImageUrl;
            downloadLink.style.display = 'block';
        } catch (error) {
            alert('Error processing the image.');
        }
    };
    reader.readAsDataURL(file);
});

async function removeBackground(imageUrl) {
    const apiKey = 'JYHAhMDPv4rnydvhToMnmvM3'; // Replace with your Remove.bg API key
    const apiUrl = 'https://api.remove.bg/v1.0/removebg';

    const formData = new FormData();
    formData.append('image_file', dataURLtoBlob(imageUrl));
    formData.append('size', 'auto');

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];

    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: mime });
}