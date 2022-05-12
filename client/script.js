const textarea = document.querySelector("#textarea");
const playBtn = document.querySelector("#run-btn");
const resultDiv = document.querySelector("#result");
const loader = document.querySelector("#loader");
const closeBtn = document.querySelector("#close-btn");
const editor = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  value: "function myScript(){return 100;}\n",
  mode: "javascript",
  theme: "material-palenight",
});
editor.setSize(null, "90vh");
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "i") {
    fetchData();
  }
  return;
});
playBtn.addEventListener("click", () => {
  fetchData();
});

function fetchData() {
  let cmd = editor.getValue();
  editor.setSize(null, "60vh");
  resultDiv.classList.add("active");
  loader.classList.add("active");
  fetch("/api/cmd", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cmd }),
  })
    .then((response) => {
      let text = "";
      var reader = response.body.getReader();
      var decoder = new TextDecoder();

      return readChunk();

      function readChunk() {
        return reader.read().then(appendChunks);
      }

      function appendChunks(result) {
        var chunk = decoder.decode(result.value || new Uint8Array(), {
          stream: !result.done,
        });
        text += chunk;
        if (result.done) {
          return text;
        } else {
          return readChunk();
        }
      }
    })
    .then((result) => {
      const pre = resultDiv.querySelector("pre");
      loader.classList.remove("active");
      pre.innerText = result;
    });
}
closeBtn.addEventListener("click", () => {
  editor.setSize(null, "90vh");
  resultDiv.classList.remove("active");
});
