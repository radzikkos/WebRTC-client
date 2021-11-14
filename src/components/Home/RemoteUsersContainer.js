import { useState, useEffect } from "react";
import { RemoteUser } from "./RemoteUser";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

export const RemoteUsersContainer = ({
  remotePeers,
  remoteStreams,
  availibleRemotePeers,
  sendFileToWithPeerId,
  fileIsSend,
  disconnectUserAction,
}) => {
  const [remotePeersMapped, setRemotePeersMapped] = useState([]);
  const sendFileToParentWithPeerId = (file, remoteId) => {
    sendFileToWithPeerId(file, remoteId);
  };
  useEffect(() => {
    // console.log(fileIsSend);
    const matchedPeers = remoteStreams.map((remoteStream) => {
      return {
        peer: remotePeers.find(
          (remotePeer) => remotePeer.remoteId == remoteStream.remoteId
        ),
        stream: remoteStream.stream,
        peerInfo: availibleRemotePeers.find(
          (remotePeer) => remotePeer.id == remoteStream.remoteId
        ),
        fileIsSend: fileIsSend.find(
          (remotePeer) => remotePeer.remoteId == remoteStream.remoteId
        ),
      };
    });
    const mappedPeers = matchedPeers.map((matchedPeer) => {
      return (
        <Grid item xs={12} md={6} key={matchedPeer.peer.remoteId}>
          <RemoteUser
            sendFileToParentWithPeerId={(file, remoteId) =>
              sendFileToParentWithPeerId(file, remoteId)
            }
            peer={matchedPeer}
            disconnectUserAction={(remoteId) => disconnectUserAction(remoteId)}
          />
        </Grid>
      );
    });
    setRemotePeersMapped(mappedPeers);
  }, [remoteStreams, fileIsSend]);
  return (
    <div>
      <Card style={{ backgroundColor: "grey" }}>
        <CardHeader title="Remote Users"></CardHeader>
        <CardContent>
          <Grid container>{remotePeersMapped}</Grid>
        </CardContent>
      </Card>
    </div>
  );
};
