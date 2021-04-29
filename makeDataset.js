const saveButton = document.getElementById('save-canvas');
const filename = document.getElementById('filename');

function save() {
    console.log();
    download(JSON.stringify(predictions), `${filename.value}.json`, 'application/json');

    // saveCanvas(canvas, 'myCanvas', 'jpg');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function init() {
    saveButton.addEventListener("click", save)
}

if (saveButton && filename) {
    init();
}