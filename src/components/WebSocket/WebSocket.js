import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useEffect, useState } from "react";
import auth from "../../auth";
import { signalingServer } from "../../signalingServer";
import {
  sendCandidateToSignalingServer,
  sendOfferToRemotePeer,
  sendAnswerToSignalingServer,
  ping,
} from "./sendingFunctions";
export const WebSocket = ({
  connect,
  emitMyId,
  emitRemotePeers,
  remotePeerIdToConnect,
  myId,
  emitInititingMessage,
  candidate,
  offerToRemote,
  emitOffer,
  answerToRemote,
  emitAnswer,
  emitCandidate,
}) => {
  //let server = null;
  const [server, setServer] = useState(null);
  const initiateCall = (toId) => {
    server.send(
      JSON.stringify({
        type: "initiating",
        initiatorId: myId,
        toId: toId ? toId : undefined,
      })
    );
  };

  useEffect(() => {
    if (connect && server == null) {
      const signalinServer = new W3CWebSocket(
        signalingServer + localStorage.getItem("token")
      );
      setServer(signalinServer);
    }
    return () => {
      const closingConnection = async () => {
        const authenticated = await auth.isAuthenticated();

        if (server && !authenticated) {
          server.close();
          setServer(null);
        }
      };
      closingConnection();
    };
  }, [connect]);
  useEffect(() => {
    if (server) {
      server.onopen = () => {
        const firstname = localStorage.getItem("firstname");
        const lastname = localStorage.getItem("lastname");
        const email = localStorage.getItem("email");
        const id = localStorage.getItem("id");
        const user = { firstname, lastname, email, id };
        server.send(
          JSON.stringify({
            type: "identify-user",
            user,
          })
        );
        const interval = setInterval(() => {
          ping(server);
        }, 60000);
        console.log("Connection established");
      };
      server.onmessage = (message) => {
        try {
          const parsedMessage = JSON.parse(message.data);

          if (parsedMessage.type === "myId") {
            console.log("My Id ", parsedMessage.id);
            emitMyId(parsedMessage.id);
          } else if (parsedMessage.type === "peers") {
            emitRemotePeers(parsedMessage.peers);
          } else if (parsedMessage.type === "initiating") {
            // console.log(
            //   "Peer got initiating message from another client ",
            //   parsedMessage.initiatorId
            // );
            emitInititingMessage(parsedMessage.initiatorId);
          } else if (parsedMessage.type === "offer") {
            // console.log("got offer");
            emitOffer(parsedMessage);
            // const createdPeer = createPeer(parsedMessage.remoteId);
            // const peer = {
            //   peer: createdPeer.peer,
            //   remoteId: parsedMessage.remoteId,
            //   dataChannel: createdPeer.dataChannel,
            // };
            // peers.push(peer);

            // await addOfferFromRemotePeer(peer, parsedMessage.offer);
            // await createAnswerOnRemoteDescription(peer);
          } else if (parsedMessage.type === "answer") {
            // console.log("got answer");
            emitAnswer(parsedMessage);
            // const peer = peers.find((peer) => {
            //   return peer.remoteId == parsedMessage.remoteId;
            // });
            // await addAnswerToLocalPeer(peer, parsedMessage.answer);
          } else if (parsedMessage.type === "new-ice-candidate") {
            // console.log("Got new candidate");
            emitCandidate(parsedMessage);
            // try {
            //   const peer = peers.find((peer) => {
            //     return peer.remoteId == parsedMessage.remoteId;
            //   });
            //   await peer.peer.addIceCandidate(parsedMessage.candidate);
            //   console.log("Add candidate success");
            // } catch (err) {
            //   console.log("Cannot add Ice Candidate");
            // }
          }
        } catch (err) {
          console.log(err);
        }
      };
    }
  });
  useEffect(() => {
    if (remotePeerIdToConnect) {
      if (remotePeerIdToConnect == -1) {
        initiateCall();
      } else {
        initiateCall(remotePeerIdToConnect);
      }
    }
  }, [remotePeerIdToConnect]);
  useEffect(() => {
    if (candidate) {
      const { event, toId } = candidate;
      sendCandidateToSignalingServer(event, toId, server, myId);
    }
  }, [candidate]);

  useEffect(() => {
    if (offerToRemote) {
      const { peer, createdOffer } = offerToRemote;
      sendOfferToRemotePeer(peer, createdOffer, server, myId);
    }
  }, [offerToRemote]);
  useEffect(() => {
    if (answerToRemote) {
      const { peer, answer } = answerToRemote;
      sendAnswerToSignalingServer(peer, answer, server, myId);
    }
  }, [answerToRemote]);
  return <div></div>;
};
