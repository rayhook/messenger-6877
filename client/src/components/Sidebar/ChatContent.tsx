import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17
  }
}));

const ChatContent = ({ username }: { username: string }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography>{username}</Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
