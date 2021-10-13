import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  },
  imageRow: {
    display: "flex"
  },
  imageContainerMulti: {
    width: "100%",
    marginLeft: theme.spacing(1)
  },
  imageContainerSingle: {
    width: theme.spacing(60)
  },
  image: {
    borderRadius: theme.spacing(4),
    margin: theme.spacing(5),
    width: theme.spacing(22),
    minWidth: "100%",
    verticalAlign: "top"
  }
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, attachments } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        {text.length !== 0 && (
          <>
            {attachments && attachments[0] && (
              <Box className={classes.imageRow}>
                <MutipleImages classes={classes} attachments={attachments} />
              </Box>
            )}

            <Typography className={classes.text}>{text}</Typography>
          </>
        )}
      </Box>
      {text.length === 0 && attachments && attachments[0] && (
        <Box className={classes.imageRow}>
          <MutipleImages classes={classes} attachments={attachments} />
        </Box>
      )}
    </Box>
  );
};

export default SenderBubble;

const MutipleImages = ({ attachments, classes }) => {
  return attachments.map((URL) => (
    <Box
      className={
        attachments.length > 1 ? classes.imageContainerMulti : classes.imageContainerSingle
      }
    >
      <img src={URL} className={classes.image} alt="Sender attachments" />
    </Box>
  ));
};
