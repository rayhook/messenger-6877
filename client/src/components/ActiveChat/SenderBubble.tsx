import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
  imageGridContainer: {
    height: theme.spacing(48)
  },

  multiImageContainer: {
    height: theme.spacing(30)
  },

  image: {
    height: "100%",
    width: "100"
  }
}));

const SenderBubble = ({ time, text }: { time: string; text: string }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" alignItems="flex-end" className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Grid className={classes.bubble}>
        {text.length !== 0 && <Typography className={classes.text}>{text}</Typography>}
      </Grid>
    </Grid>
  );
};

export default SenderBubble;
