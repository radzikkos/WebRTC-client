export function sendCandidateToSignalingServer(event, toId, server, myId) {
  const { candidate } = event;
  if (candidate) {
    // console.log("Sending candidate");
    server.send(
      JSON.stringify({
        type: "new-ice-candidate",
        candidate: candidate,
        toId: toId,
        remoteId: myId,
      })
    );
  }
}

export function sendOfferToRemotePeer(peer, offer, server, myId) {
  // console.log("Sending offer to remote peer");
  if (offer) {
    server.send(
      JSON.stringify({
        type: "offer",
        offer: offer,
        peerType: "peer",
        remoteId: myId,
        toId: peer.remoteId,
      })
    );
  }
}

export function sendAnswerToSignalingServer(peer, answer, server, myId) {
  // console.log("Sending answer to another peer");
  if (answer) {
    server.send(
      JSON.stringify({
        type: "answer",
        answer: answer,
        remoteId: myId,
        toId: peer.remoteId,
      })
    );
  }
}
