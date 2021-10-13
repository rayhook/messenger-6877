import React, { useState } from "react";
import {
  FormControl,
  Button,
  FilledInput,
  Dialog,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import { AttachIcon } from "../../resources/AttachIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  dashboard: {
    display: "flex",
    alignItems: "center",
    height: 70,
    position: "fixed",
    zIndex: 1250,
    width: "78%",
    bottom: theme.spacing(10)
  },
  attachIcon: {
    maxheight: 70,
    flex: "1"
  },

  inputContainer: {
    flex: "7"
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  },

  button: {
    backgroundColor: theme.palette.primary.main
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dialogContianer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: theme.spacing(120),
    width: theme.spacing(90)
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "30%",
    maxHeight: "40%"
  },
  imageText: {
    width: "40%",
    marginBottom: "2rem"
  },
  image: {
    width: "15rem",
    height: "14rem",
    objectFit: "contain"
  },

  dialogContent: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  inputFile: {
    margin: "1rem"
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { postMessage, otherUser, conversationId, user } = props;
  const [imageURL, setImageURL] = useState([]);
  const [imageText, setImageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setIsUploading(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleChangeImageText = (event) => {
    setImageText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user
    };
    await postMessage(reqBody);
    setText("");
  };

  const handleUpload = (event) => {
    setLoading(true);

    const filesSize = event.target.files.length;
    const files = [];
    for (let i = 0; i < filesSize; i++) {
      files.push(event.target.files[i]);
    }

    const fileURLs = files.map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "messenger-app");
      data.append("cloud_name", "rayhookchris");
      return fetch("https://api.cloudinary.com/v1_1/rayhookchris/image/upload", {
        method: "post",
        body: data
      })
        .then((response) => response.json())
        .then((result) => {
          setImageURL((prevArray) => [...prevArray, result.url]);
        })
        .catch((err) => console.error(err));
    });

    Promise.all(fileURLs).then(() => {
      setLoading(false);
      setIsUploading(false);
    });
  };

  const handleSendImage = async () => {
    const reqBody = {
      text: imageText,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
      attachments: imageURL
    };

    await postMessage(reqBody);
    setImageText("");
    setIsUploading(false);
    setImageURL("");
    setText("");
    setOpen(false);
  };

  return (
    <>
      <Box className={classes.dashboard}>
        <Box className={classes.inputContainer}>
          <form className={classes.root} onSubmit={handleSubmit}>
            <FormControl fullWidth hiddenLabel>
              <FilledInput
                classes={{ root: classes.input }}
                disableUnderline
                placeholder="Type something..."
                value={text}
                name="text"
                onChange={handleChange}
              />
            </FormControl>
          </form>
        </Box>
        <Button className={classes.attachIcon} variant="text" onClick={handleClickOpen}>
          <AttachIcon />
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="image-dialog-title"
        aria-describedby="image-dialog-description"
      >
        <DialogTitle id="image-dialog-title">
          <Box className={classes.dialogTitle}>
            {"Select Image"} {<Button onClick={handleClose}>X</Button>}
          </Box>
        </DialogTitle>
        <DialogContent className={classes.dialogContianer}>
          <DialogActions>
            {!isUploading ? (
              <Box className={classes.dialogContent}>
                <>
                  <Typography>
                    {imageURL.length > 1
                      ? `${imageURL.length} images loaded`
                      : `${imageURL.length} image loaded`}
                  </Typography>
                  <Box className={classes.imageContainer}>
                    <img className={classes.image} src={imageURL[0]} alt="attachment preview" />
                  </Box>
                  <TextField
                    className={classes.imageText}
                    value={imageText}
                    onChange={handleChangeImageText}
                    id="standard-basic"
                    label="add text"
                    variant="standard"
                  />
                  <Button variant="contained" color="primary" onClick={handleSendImage}>
                    Send
                  </Button>
                </>
              </Box>
            ) : loading ? (
              <Typography>Uploading...</Typography>
            ) : (
              <input multiple type="file" onChange={handleUpload} />
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);
