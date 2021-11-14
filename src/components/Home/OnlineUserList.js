import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FolderIcon from "@mui/icons-material/Folder";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import ListItemText from '@mui/material/ListItemText';

export const OnlineUserList = ({
  onlineUsers,
  connectWithAllAction,
  connectWithPeerAction,
}) => {
  const [users, setUsers] = useState([]);
  const connectWithAll = (
    <ListItem
      selected={true}
      key={0}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="connect"
          onClick={() => {
            connectWithAllAction();
          }}
        >
          <AddIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <FiberManualRecordIcon style={{ fill: "green" }} />
        </Avatar>
      </ListItemAvatar>
      Connect With All
    </ListItem>
  );
  useEffect(() => {
    const mappedUsers = onlineUsers.map((user) => (
      <ListItem
        selected={true}
        key={user.id}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="connect"
            onClick={() => {
              connectWithPeerAction(user.id);
            }}
          >
            <AddIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <FiberManualRecordIcon style={{ fill: "green" }} />
          </Avatar>
        </ListItemAvatar>
        {user.firstname + " " + user.lastname}
      </ListItem>
    ));
    setUsers(mappedUsers);
  }, [onlineUsers]);
  return (
    <>
      <Card>
        <CardHeader title="Online users"></CardHeader>
        <CardContent>
          <List dense={true}>
            {" "}
            {connectWithAll}
            {users}{" "}
          </List>
        </CardContent>
      </Card>
    </>
  );
};
