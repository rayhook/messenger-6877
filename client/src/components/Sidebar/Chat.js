import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = ({ id, user2, handleSelectChat }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} onClick={() => handleSelectChat(id, user2)}>
      <BadgeAvatar username={user2} online="true" sidebar={true} />
      <ChatContent username={user2} />
    </Box>
  );
};

export default Chat;
