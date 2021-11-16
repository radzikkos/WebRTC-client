import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "react-bootstrap/Button";

const mediaStreamConstraints = {
  video: true,
  audio: true,
};
export const UserVideo = ({ startApp, userVideoIsReady, emitMyStream }) => {
  const [userStream, setUserStream] = useState(null);
  const [videoSize, setVideoSize] = useState({ width: 220, height: 140 });
  const [sliderValue, setSliderValue] = useState(50);
  const [hideMyVideo, setHideMyVideo] = useState(false);
  const userVideo = useRef(null);

  const handleHideButton = (e, hide) => {
    e.preventDefault();
    if (hide) {
      setHideMyVideo(true);
    } else {
      setHideMyVideo(false);
    }
  };
  useEffect(() => {
    const getUserVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          mediaStreamConstraints
        );
        console.log("STREAM IS TAKEN");
        setUserStream(stream);
        userVideo.current.srcObject = userStream;
        emitMyStream(userStream);
        userVideoIsReady();
      } catch (err) {
        console.log(err);
        alert("Cannot take user video");
      }
    };

    if (startApp) {
      getUserVideo();
    }
  });

  useEffect(() => {
    if (!hideMyVideo) {
      userVideo.current.srcObject = userStream;
      userVideo.current.volume = 0.05;
    }
  }, [hideMyVideo]);

  return (
    <Card
      sx={{
        maxWidth: sliderValue + videoSize.width + 50,
      }}
    >
      <CardHeader title="My video" />
      {!hideMyVideo && (
        <CardContent>
          <Box width={videoSize.width + 50}>
            <video
              ref={userVideo}
              width={videoSize.width + sliderValue}
              height={videoSize.height + sliderValue}
              autoPlay
              playsInline
            ></video>

            <Slider
              value={sliderValue}
              onChange={(event, newValue) => setSliderValue(newValue)}
              onChangeCommitted={(event, newValue) => setSliderValue(newValue)}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </Box>
        </CardContent>
      )}
      <CardActions>
        <Button
          size="small"
          onClick={(e) => {
            handleHideButton(e, !hideMyVideo);
          }}
        >
          {hideMyVideo ? "Show me" : "Hide me"}
        </Button>
      </CardActions>
    </Card>
  );
};
