import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../auth";

import { CustomedButton } from "../components/CustomedButton";
import { UserVideo } from "../components/Home/UserVideo";
import { WebSocket } from "../components/WebSocket/WebSocket";

import Grid from "@mui/material/Grid";
import { OnlineUserList } from "../components/Home/OnlineUserList";
import { OfferConnectionInfo } from "../components/Home/OfferConnectionInfo";
import { RemoteUsersContainer } from "../components/Home/RemoteUsersContainer";
import {
  beginWebRTCTransaction,
  createPeer,
  addOfferFromRemotePeer,
  createAnswerOnRemoteDescription,
  addAnswerToLocalPeer,
  shareFile,
} from "../webRTC/connectionHandlers";
import { InfoAboutFileDowloaded } from "../components/Home/InfoAboutFileDowloaded";

export const Home = ({ emitOnlineStatus }) => {
  const [startApp, setStartApp] = useState(false);
  const [appIsWorking, setAppIsWorking] = useState(false);
  const [connectToServer, setConnectToServer] = useState(false);
  const [availibleRemotePeers, setAvailibleRemotePeers] = useState([]);
  const [remotePeerIdToConnect, setRemotePeerIdToConnect] = useState(null);
  const [myId, setMyId] = useState(null);
  const [initiatorId, setInitiatorId] = useState(null);
  const [showInitiateInfo, setShowInitiateInfo] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [streams, setStreams] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [offerToRemote, setOfferToRemote] = useState(null);
  const [answerToRemote, setAnswerToRemote] = useState(null);
  const [fileIsSend, setFileIsSend] = useState([]);
  const [fileIsGet, setFileIsGet] = useState([]);
  const navigate = useNavigate();
  const isUserLogged = async () => {
    const result = await auth.isAuthenticated();
    if (result && result.authenticated) {
    } else {
      navigate("/");
    }
  };
  const emitMyStream = (stream) => {
    setMyStream(stream);
  };
  const handleMyIdFromServer = (id) => {
    // console.log("ID ", id);
    setMyId(id);

    emitOnlineStatus(true);
  };
  const getRemotePeers = (remotePeers) => {
    // console.log(remotePeers, myId);
    setAvailibleRemotePeers(
      remotePeers.filter((peer) => {
        return peer.id != myId;
      })
    );
  };
  useEffect(() => {
    setAvailibleRemotePeers(
      availibleRemotePeers.filter((peer) => {
        return peer.id != myId;
      })
    );
  }, [myId]);
  const connectWithAllAction = () => {
    setRemotePeerIdToConnect(-1);
    setTimeout(() => {
      setRemotePeerIdToConnect(null);
    }, 10);
  };
  const connectWithPeerAction = (id) => {
    setRemotePeerIdToConnect(id);
    setTimeout(() => {
      setRemotePeerIdToConnect(null);
    }, 10);
  };
  const emitInititingMessage = (initiatorId) => {
    setInitiatorId(initiatorId);
    setShowInitiateInfo(true);
    setTimeout(() => {
      setShowInitiateInfo(false);
    }, 10);
  };
  const emitUserToConnect = async (initiatorId) => {
    // console.log("Open connection with ", initiatorId);
    const remotePeer = await beginWebRTCTransaction(
      initiatorId,
      myStream,
      onaddStreamHandler,
      onIceCandidateHandler,
      onSendOfferToRemotePeer,
      gettingFile
    );
    setPeers([...peers, remotePeer]);
  };
  const onaddStreamHandler = (toId, event) => {
    // const newRemotePeers = { remoteId: toId, stream: event.stream };
    // let copiedPeers = [...peers];
    // console.log(peers);
    setStreams((streams) => [
      ...streams,
      { remoteId: toId, stream: event.stream },
    ]);
    // const peer = peers.find((peer) => {
    //   return peer.remoteId == toId;
    // });
    // console.log(peers, "Stream handler");
    // setPeers((peers) => [...peers, event]);
    // if (peer) {
    //   console.log("STREAM HANDLER");
    //   peer.stream = event.stream;
    //   setPeers(copiedPeers);
    // }

    // setPeers([...peers, newRemotePeers]);
  };

  const onIceCandidateHandler = (event, toId) => {
    // sendCandidateToSignalingServer(event, toId);
    setCandidate({ event, toId });
  };
  const onSendOfferToRemotePeer = (peer, createdOffer) => {
    setOfferToRemote({ peer, createdOffer });
  };
  const handleOfferFromRemote = async (parsedMessage) => {
    try {
      const newRemotePeer = createPeer(
        parsedMessage.remoteId,
        myStream,
        onaddStreamHandler,
        onIceCandidateHandler,
        gettingFile
      );

      const peer = {
        peer: newRemotePeer.peer,
        remoteId: parsedMessage.remoteId,
        dataChannel: newRemotePeer.dataChannel,
      };
      setPeers([...peers, peer]);
      // console.log(peers, peer);
      await addOfferFromRemotePeer(peer, parsedMessage.offer);
      const answer = await createAnswerOnRemoteDescription(peer);
      setAnswerToRemote({ peer, answer });
    } catch (err) {
      console.log(err);
    }
  };
  const handleAnswerFromRemote = async (parsedMessage) => {
    const peer = peers.find((peer) => peer.remoteId == parsedMessage.remoteId);
    // console.log(peers, parsedMessage);
    if (peer) {
      await addAnswerToLocalPeer(peer, parsedMessage.answer);
    } else {
      console.log("Not found peer to match answer");
    }
  };
  const handleCandidateFromRemote = async (parsedMessage) => {
    try {
      const peer = peers.find(
        (peer) => peer.remoteId == parsedMessage.remoteId
      );
      if (peer) {
        await peer.peer.addIceCandidate(parsedMessage.candidate);
        // console.log("Added candidate");
      } else {
        console.log("Not fount peer to match candidates");
      }
    } catch (err) {
      console.log("Cannot add ICE Candidate");
    }
  };

  useEffect(() => {
    isUserLogged();
    // setConnectToServer(true);
  });

  const inAvailiblePeers = (remoteId) => {
    for (const availiblePeer of availibleRemotePeers) {
      if (availiblePeer.id == remoteId) return true;
    }
    return false;
  };
  useEffect(() => {
    const newRemotePeers = peers.filter((remotePeer) =>
      inAvailiblePeers(remotePeer.remoteId)
    );
    const newStreams = streams.filter((stream) =>
      inAvailiblePeers(stream.remoteId)
    );
    setPeers(newRemotePeers);
    setStreams(newStreams);
    // console.log(availibleRemotePeers);
  }, [availibleRemotePeers]);

  const isFileSending = (flag, remoteId) => {
    const copiedFileIsSend = [...fileIsSend].filter(
      (peer) => peer.remoteId !== remoteId
    );
    copiedFileIsSend.push({ flag, remoteId });

    setFileIsSend(copiedFileIsSend);
    // console.log("CHANGED FLAG,", flag);
  };
  const sendFile = (file, remoteId) => {
    // console.log("SENDING ", file, remoteId);
    // console.log(peers);
    const peer = peers.find((peer) => peer.remoteId == remoteId);
    if (peer) {
      shareFile(peer, file, (flag) => isFileSending(flag, peer.remoteId));
    } else {
      console.log("Cannot find peer to send");
    }
  };

  const gettingFile = (flag, remoteId) => {
    const copiedFileIsGet = [...fileIsGet].filter(
      (peer) => peer.remoteId !== remoteId
    );
    copiedFileIsGet.push({ flag, remoteId });
    // console.log(copiedFileIsGet);
    setFileIsGet(copiedFileIsGet);
  };

  const disconnectUserAction = (remoteId) => {
    const peerToDisconnect = peers.find((peer) => peer.remoteId == remoteId);
    peerToDisconnect.peer.close();
    const newPeers = [...peers].filter((peer) => peer.remoteId != remoteId);
    const newStreams = [...streams].filter((peer) => peer.remoteId != remoteId);
    setPeers(newPeers);
    setStreams(newStreams);
  };
  return (
    <div className="container-fluid">
      <WebSocket
        connect={connectToServer}
        emitMyId={handleMyIdFromServer}
        emitRemotePeers={(peers) => getRemotePeers(peers)}
        remotePeerIdToConnect={remotePeerIdToConnect}
        emitInititingMessage={(initiatorId) =>
          emitInititingMessage(initiatorId)
        }
        candidate={candidate}
        myId={myId}
        offerToRemote={offerToRemote}
        emitOffer={(parsedMessage) => {
          handleOfferFromRemote(parsedMessage);
        }}
        answerToRemote={answerToRemote}
        emitAnswer={(parsedMessage) => {
          handleAnswerFromRemote(parsedMessage);
        }}
        emitCandidate={(parsedMessage) => {
          handleCandidateFromRemote(parsedMessage);
        }}
      />
      {!appIsWorking && (
        <div className="col-md-12 text-center">
          <CustomedButton
            text={"Start application"}
            color={"success"}
            action={(e) => {
              setStartApp(true);
              setAppIsWorking(true);
              setConnectToServer(true);
            }}
          />
        </div>
      )}
      {appIsWorking && (
        <>
          <Grid container spacing={0}>
            <Grid item xs={12} md={3}>
              <UserVideo
                startApp={startApp}
                userVideoIsReady={() => {
                  setStartApp(false);
                }}
                emitMyStream={(stream) => {
                  emitMyStream(stream);
                }}
              />
              <InfoAboutFileDowloaded
                fileIsGet={fileIsGet}
                availibleRemotePeers={availibleRemotePeers}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RemoteUsersContainer
                remotePeers={peers}
                remoteStreams={streams}
                availibleRemotePeers={availibleRemotePeers}
                sendFileToWithPeerId={(file, remoteId) =>
                  sendFile(file, remoteId)
                }
                fileIsSend={fileIsSend}
                disconnectUserAction={(remoteId) => {
                  disconnectUserAction(remoteId);
                }}
              />
            </Grid>
            <Grid item xs={1} md={1}></Grid>
            <Grid item xs={12} md={2}>
              <OnlineUserList
                onlineUsers={availibleRemotePeers}
                connectWithAllAction={connectWithAllAction}
                connectWithPeerAction={(id) => connectWithPeerAction(id)}
              />
            </Grid>
          </Grid>
          <OfferConnectionInfo
            show={showInitiateInfo}
            user={initiatorId}
            emitUserToConnect={emitUserToConnect}
            availibleRemotePeers={availibleRemotePeers}
          />
        </>
      )}
    </div>
  );
};
