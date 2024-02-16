import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search, Chat, CurrentUser } from "./index";
import { SidebarProps } from "../../types.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = ({
  handleChange,
  conversations,
  newContacts,
  searchTerm,
  handleSelectChat
}: SidebarProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} searchTerm={searchTerm} />
      {searchTerm === ""
        ? conversations.map((convo) => (
            <Chat
              key={`convo-${convo.id}`}
              user2={convo.with_user}
              id={`convo-${convo.id}`}
              handleSelectChat={handleSelectChat}
            ></Chat>
          ))
        : [
            ...conversations.map((convo) => ({ ...convo, id: `convo-${convo.id}` })),
            ...newContacts.map((contact) => ({ ...contact, id: `contact-${contact.id}` }))
          ].map((chat) => (
            <Chat
              key={chat.id}
              user2={chat.with_user}
              id={chat.id}
              handleSelectChat={handleSelectChat}
            ></Chat>
          ))}
    </Box>
  );
};

export default Sidebar;
