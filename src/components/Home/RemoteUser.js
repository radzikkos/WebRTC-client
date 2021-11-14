import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "react-bootstrap/Button";
import Grid from "@mui/material/Grid";
import { InputFile } from "./InputFile";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { CustomedButton } from "../CustomedButton";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import IconButton from "@mui/material/IconButton";

export const RemoteUser = ({
  peer,
  sendFileToParentWithPeerId,
  disconnectUserAction,
}) => {
  const remoteUserVideo = useRef(null);
  const [remoteUserStream, setRemoteStream] = useState(null);
  const [videoSize, setVideoSize] = useState({ width: 320, height: 240 });
  const [sliderValue, setSliderValue] = useState(0);
  const [hideMyVideo, setHideMyVideo] = useState(true);
  const [fileIsSendLabel, setFileIsSendLabel] = useState("");
  const handleHideButton = (e, hide) => {
    e.preventDefault();
    if (hide) {
      setHideMyVideo(true);
    } else {
      setHideMyVideo(false);
    }
  };

  const sendFileToParent = (file) => {
    sendFileToParentWithPeerId(file, peer.peerInfo.id);
  };

  const onDisconnectAction = () => {
    // console.log("Disconnect");
    disconnectUserAction(peer.peerInfo.id);
  };

  useEffect(() => {
    setRemoteStream(peer.stream);
  });
  useEffect(() => {
    if (!hideMyVideo) {
      remoteUserVideo.current.srcObject = remoteUserStream;
    }
  }, [hideMyVideo]);
  useEffect(() => {
    // console.log("ISFILESEND", peer.fileIsSend);

    if (peer.fileIsSend) {
      if (peer.fileIsSend.flag) {
        setFileIsSendLabel(<CircularProgress />);
      } else {
        setFileIsSendLabel(<CheckIcon />);
      }
    } else {
      setFileIsSendLabel("");
    }
  }, [peer]);
  return (
    <div>
      <Card
        sx={{
          maxWidth: sliderValue + videoSize.width + 50,
        }}
      >
        <CardHeader
          title={`${peer.peerInfo.firstname} ${peer.peerInfo.lastname}`}
          action={
            <IconButton
              aria-label="settings"
              onClick={(event) => onDisconnectAction()}
            >
              <DoDisturbIcon />
            </IconButton>
          }
        />
        {!hideMyVideo && (
          <CardContent>
            <Box width={videoSize.width + 120}>
              <video
                ref={remoteUserVideo}
                width={videoSize.width + sliderValue}
                height={videoSize.height + sliderValue}
                autoPlay
                playsInline
              ></video>

              <Slider
                value={sliderValue}
                onChange={(event, newValue) => setSliderValue(newValue)}
                onChangeCommitted={(event, newValue) =>
                  setSliderValue(newValue)
                }
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Box>
          </CardContent>
        )}
        <CardActions>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Button
                size="small"
                onClick={(e) => {
                  handleHideButton(e, !hideMyVideo);
                }}
              >
                {hideMyVideo ? `Show ` : `Hide `} {peer.peerInfo.firstname}
              </Button>
            </Grid>

            {!hideMyVideo && (
              <>
                <Grid item xs={12} md={6}>
                  <InputFile
                    sendFileToParent={(file) => sendFileToParent(file)}
                    fileIsSendLabel={fileIsSendLabel}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};
