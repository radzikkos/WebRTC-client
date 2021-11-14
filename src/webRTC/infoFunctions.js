export function showIceStateChange(peer, event) {
  if (peer) {
    // console.log(" ICE state: " + peer.iceConnectionState);
    // console.log("ICE state change event: ", event);
  }
}

export function onCreateSessionDescriptionError(error) {
  console.log("Failed to create session description: " + error.toString());
}

export function onSetSessionDescriptionError(err) {
  console.log("Failed to set session description: " + err.toString());
}
