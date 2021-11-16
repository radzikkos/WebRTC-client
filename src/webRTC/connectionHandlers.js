import worker_script from "./worker";
import {
  showIceStateChange,
  onCreateSessionDescriptionError,
  onSetSessionDescriptionError,
} from "./infoFunctions";
const offerConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};
const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export async function beginWebRTCTransaction(
  initiatorId,
  localStream,
  onaddStreamHandler,
  onIceCandidateHandler,
  sendOfferToRemotePeer,
  gettingFile,
  onDowloadHandler
) {
  try {
    const createdPeer = createPeer(
      initiatorId,
      localStream,
      onaddStreamHandler,
      onIceCandidateHandler,
      gettingFile,
      onDowloadHandler
    );
    const peer = {
      peer: createdPeer.peer,
      remoteId: initiatorId,
      dataChannel: createdPeer.dataChannel,
    };
    // peers.push(peer);
    const createdOffer = await peer.peer.createOffer(offerConstraints);
    await addOfferToLocalPeer(peer, createdOffer);
    sendOfferToRemotePeer(peer, createdOffer);
    return peer;
  } catch (err) {
    console.log("Create offer error. ", err.name);
  }
}

const MAXIMUM_MESSAGE_SIZE = 65535;
const MAXIMUM_BUFFER_SIZE = 14500000;

const END_OF_FILE_MESSAGE = "EOF";
const DATA_TYPE = {
  txt: "txt",
  png: "png",
  jpg: "jpg",
  js: "js",
  videoMp4: "mp4",
  zip: "zip",
  pdf: "pdf",
};
function getProperDataType(dataType) {
  switch (dataType) {
    case DATA_TYPE.jpg:
      return { type: "image/jpg" };
    case DATA_TYPE.png:
      return { type: "image/png" };
    case DATA_TYPE.txt:
      return { type: "text/plain" };
    case DATA_TYPE.js:
      return { type: "text/javascript" };
    case DATA_TYPE.videoMp4:
      return { type: "video/mp4" };
    case DATA_TYPE.zip:
      return { type: "application/zip" };
    case DATA_TYPE.pdf:
      return { type: "application/pdf" };
    default:
      return false;
  }
}

export const downloadFile = (blob, fileName) => {
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

const concatenateChunks = new Worker(worker_script);
let isFileSendingFlag = null;
export function createPeer(
  toId,
  localStream,
  onaddStreamHandler,
  onIceCandidateHandler,
  onGettingFile,
  onDowloadHandler
) {
  const peer = new RTCPeerConnection(servers);
  // console.log("Created local peer connection");
  peer.onicecandidate = function (event) {
    //   sendCandidateToSignalingServer(event, toId);
    onIceCandidateHandler(event, toId);
  };
  peer.oniceconnectionstatechange = function (event) {
    showIceStateChange(peer, event);
  };
  peer.onaddstream = (event) => {
    //   remoteContainer.createRemoteContainer(toId);
    //   document.getElementById("remoteVideo-" + toId).srcObject = event.stream;
    //   // remoteVideo.srcObject = event.stream;
    //   remoteStream.push({ remoteId: toId, stream: event.stream });
    onaddStreamHandler(toId, event);
  };
  //peer.addEventListener("addstream", addRemoteStream.bind(event, toId));
  peer.addStream(localStream);
  // console.log("Added local stream to peer");
  const onGettingFileHandler = onGettingFile;
  // const dataChannel = {};
  let receivedBuffers = [];
  let dataType = { type: "text/plain" };
  peer.ondatachannel = (event) => {
    const { channel } = event;
    channel.binaryType = "arraybuffer";
    console.log("GOT REMOTE CHANNEL");
    channel.onmessage = async (event) => {
      onGettingFileHandler(true, toId);
      const { data } = event;
      console.log(data);
      try {
        const result = getProperDataType(data);
        if (result) {
          dataType = result;
        } else if (data !== END_OF_FILE_MESSAGE) {
          receivedBuffers.push(data);
        } else {
          if (window.Worker) {
            concatenateChunks.postMessage(receivedBuffers);
            concatenateChunks.onmessage = (m) => {
              const arrayBuffer = m.data;
              const blob = new Blob([arrayBuffer], dataType);
              onDowloadHandler(blob, channel.label);
              // downloadFile(blob, channel.label);
              receivedBuffers.length = 0;
              onGettingFileHandler(false, toId);
            };
          }
          // const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
          //   const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
          //   tmp.set(new Uint8Array(acc), 0);
          //   tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
          //   return tmp;
          // }, new Uint8Array());

          // channel.close();
        }

        // const blob = new Blob([data]);
        // downloadFile(blob, channel.label);
        // channel.close();
      } catch (err) {
        console.log("File transfer failed");
      }
      // onGettingFileHandler(false, toId);
    };
  };

  const dataChannel = peer.createDataChannel(toId);
  dataChannel.binaryType = "arraybuffer";
  dataChannel.onopen = function (event) {
    console.log("Opened channel");
  };
  dataChannel.onclose = function () {
    if (isFileSendingFlag)
      alert("Sending file error, please reconnect your connections");
    console.log("Channel closed");
  };

  return { peer, dataChannel };
}

async function addOfferToLocalPeer(peer, desc) {
  // console.log("Setting local description");
  try {
    await peer.peer.setLocalDescription(desc);
    // console.log("setLocalDescription complete");
  } catch (err) {
    onSetSessionDescriptionError(err);
  }
}

export async function addOfferFromRemotePeer(peer, offer) {
  // console.log("setRemoteDescription start");
  try {
    await peer.peer.setRemoteDescription(offer);
    // console.log("Setting remote description success");
  } catch (err) {
    onSetSessionDescriptionError(err);
  }
}

export async function createAnswerOnRemoteDescription(peer) {
  // console.log("CreateAnswer start");
  try {
    const answer = await peer.peer.createAnswer();
    await addAnswerToPeer(peer, answer);
    //   sendAnswerToSignalingServer(peer, answer);
    return answer;
  } catch (err) {
    onCreateSessionDescriptionError(err);
  }
}

async function addAnswerToPeer(peer, desc) {
  // console.log("SetLocalDescription start");
  try {
    await peer.peer.setLocalDescription(desc);
    // console.log("Answer to peer added succesfully");
  } catch (err) {
    onSetSessionDescriptionError(err);
  }
}

export async function addAnswerToLocalPeer(peer, desc) {
  // console.log("SetRemoteDescription start");

  try {
    await peer.peer.setRemoteDescription(desc);
    // console.log("Set remote answer success");
  } catch (err) {
    onSetSessionDescriptionError(err);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const shareFile = async (peer, file, isFileSending) => {
  if (file) {
    console.log(file.name);
    let amountInBuffer = 0;
    const arr = file.name.split(".");
    const dataType = arr[arr.length - 1];
    try {
      // const promises = [];
      const arrayBuffer = await file.arrayBuffer();
      isFileSending(true);
      isFileSendingFlag = true;
      peer.dataChannel.send(dataType);
      for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
        if (amountInBuffer >= MAXIMUM_BUFFER_SIZE) {
          amountInBuffer = 0;
          console.log("Sleeep ", peer.dataChannel.bufferedAmount);
          await sleep(30000);
          console.log("Sleeep ", peer.dataChannel.bufferedAmount);
        }
        amountInBuffer += MAXIMUM_MESSAGE_SIZE;

        // console.log("sending ", i);
        peer.dataChannel.send(arrayBuffer.slice(i, i + MAXIMUM_MESSAGE_SIZE));
      }
      peer.dataChannel.send(END_OF_FILE_MESSAGE);
      isFileSending(false);
      isFileSendingFlag = false;
      // const arrayBuffer = await file.arrayBuffer();
      // promises.push(peer.dataChannel.send(arrayBuffer));

      // await Promise.all(promises);

      console.log("sending array !");
    } catch (err) {
      console.log(err);
    }
  }
};
