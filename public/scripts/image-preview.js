const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

document.getElementById("image").addEventListener("change", function () {
  if (this.files[0] && this.files[0].size > 2 * 1024 * 1024) { // 2MB limit
    alert("File is too big! Max size is 2MB.");
    this.value = ""; // Clear file input
  }
});

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