import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const DownloadMessage = ({
  show,
  user,
  availibleRemotePeers,
  download,
}) => {
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  React.useEffect(() => {
    if (show) {
      setOpen(true);
      const peer = availibleRemotePeers.find((peer) => {
        return peer.id == user;
      });

      peer
        ? setUserName(peer.firstname + " " + peer.lastname)
        : setUserName("");
    }
  }, [show]);

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const handleUpButton = () => {
    download();
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="success" size="small" onClick={handleUpButton}>
        Download
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="error"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={30000}
        onClose={handleClose}
        message={`Would you like to download this file`}
        action={action}
      />
    </div>
  );
};
