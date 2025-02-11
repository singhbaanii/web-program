const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');
const imageElement = document.getElementById("image");


function checkImageSize(){
  const files = imageElement.files;

  if (files[0] && files[0].size > 2 * 1024 * 1024) { // 2MB size limit
    imagePreviewElement.style.display = 'none';
    alert("File is too big! Max size is 2MB.");
    imageElement.value = ""; // Clear file input
  }
}

image.addEventListener("change", checkImageSize);

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile); //URL is a built in frontend js class
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);