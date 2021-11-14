import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "react-bootstrap/Button";
import { CustomedButton } from "../CustomedButton";

export const InputFile = ({ sendFileToParent, fileIsSendLabel }) => {
  const [file, setFile] = useState(null);
  const onFileChange = (event) => {
    // Update the state
    setFile(event.target.files[0]);
    // console.log("File changed");
  };
  const onSendFile = () => {
    // console.log("Send file", file);
    sendFileToParent(file);
  };
  return (
    <div>
      <Grid item xs={12} md={12} className="mb-2">
        <input type="file" id="select-file-input" onChange={onFileChange} />
      </Grid>
      {file && (
        <>
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <CustomedButton
                  text={"Send file"}
                  action={onSendFile}
                  color={"success"}
                />
              </Grid>
              <Grid item xs={12} md={4} className="mt-2">
                {fileIsSendLabel}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};
