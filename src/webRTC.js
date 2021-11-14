const a;
/*
async function beginWebRTCTransaction(initiatorId) {
  try {
    const createdPeer = createPeer(initiatorId);
    const peer = {
      peer: createdPeer.peer,
      remoteId: initiatorId,
      dataChannel: createdPeer.dataChannel,
    };
    //   peers.push(peer);
    const createdOffer = await peer.peer.createOffer(offerConstraints);
    await addOfferToLocalPeer(peer, createdOffer);
    sendOfferToRemotePeer(peer, createdOffer);
    return peer;
  } catch (err) {
    console.log("Create offer error. ", err.name);
  }
}

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};
export function createPeer(toId) {
  const peer = new RTCPeerConnection(servers);
  console.log("Created local peer connection");
  peer.onicecandidate = function (event) {
    console.log("Suppose to send candidate");
    //   sendCandidateToSignalingServer(event, toId);
  };
  // peer.oniceconnectionstatechange = function (event) {
  //   showIceStateChange(peer, event);
  // };
  peer.onaddstream = (event) => {
    console.log("Suppose to emit this strream to parent");
    //   remoteContainer.createRemoteContainer(toId);
    //   document.getElementById("remoteVideo-" + toId).srcObject = event.stream;
    //   // remoteVideo.srcObject = event.stream;
    //   remoteStream.push({ remoteId: toId, stream: event.stream });
  };
  //peer.addEventListener("addstream", addRemoteStream.bind(event, toId));
  peer.addStream(localStream);
  console.log("Added local stream to peer");

  // let receivedBuffers = [];
  // let dataType = { type: "text/plain" };
  // peer.ondatachannel = (event) => {
  //   const { channel } = event;
  //   channel.binaryType = "arraybuffer";
  //   console.log("GOT REMOTE CHANNEL");
  //   channel.onmessage = (event) => {
  //     const { data } = event;
  //     console.log(data);
  //     try {
  //       const result = getProperDataType(data);
  //       if (result) {
  //         dataType = result;
  //       } else if (data !== END_OF_FILE_MESSAGE) {
  //         receivedBuffers.push(data);
  //       } else {
  //         const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
  //           const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
  //           tmp.set(new Uint8Array(acc), 0);
  //           tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
  //           return tmp;
  //         }, new Uint8Array());
  //         const blob = new Blob([arrayBuffer], dataType);
  //         downloadFile(blob, channel.label);
  //         receivedBuffers.length = 0;

  //         // channel.close();
  //       }

  //       // const blob = new Blob([data]);
  //       // downloadFile(blob, channel.label);
  //       // channel.close();
  //     } catch (err) {
  //       console.log("File transfer failed");
  //     }
  //   };
  // };

  // const dataChannel = peer.createDataChannel(myId);
  // dataChannel.binaryType = "arraybuffer";
  // dataChannel.onopen = function (event) {
  //   console.log("Opened channel");
  // };

  return { peer, dataChannel };
}
*/
