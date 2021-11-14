import React, { useEffect, useState } from "react";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import DownloadingIcon from "@mui/icons-material/Downloading";
export const InfoAboutFileDowloaded = ({ fileIsGet, availibleRemotePeers }) => {
  const [label, setLabel] = useState([]);
  useEffect(() => {
    // console.log(fileIsGet, availibleRemotePeers);

    const mappedFiles = fileIsGet.map((file, i) => {
      const user = availibleRemotePeers.find(
        (user) => user.id == file.remoteId
      );
      if (file.flag) {
        return (
          <div key={i}>
            <DownloadingIcon /> {user && user.firstname + " " + user.lastname}
          </div>
        );
      } else {
        return (
          <div key={i}>
            <FileDownloadDoneIcon />
            {user && user.firstname + " " + user.lastname}
          </div>
        );
      }
    });
    setLabel(mappedFiles);
  }, [fileIsGet]);
  return <>{label}</>;
};
