// worker.js
var self = this;
const workercode = () => {
  self.onmessage = function (e) {
    const receivedBuffers = e.data;
    var workerResult = receivedBuffers.reduce((acc, arrayBuffer) => {
      const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
      tmp.set(new Uint8Array(acc), 0);
      tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
      return tmp;
    }, new Uint8Array());
    self.postMessage(workerResult);
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
