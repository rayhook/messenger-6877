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
  Typography,
  SvgIcon,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: "flex",
    alignItems: "center",
    height: 70,
    minWidth: "100%",
    position: "fixed",
    zIndex: 1250,

    bottom: theme.spacing(10)
  },
  inputContainer: {
    width: "75%"
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    marginRight: theme.spacing(8),
    marginLeft: theme.spacing(8),
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
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center"
  },
  dialogInput: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    marginBottom: "2rem"
  },
  dialogInputButton: {
    marginTop: "1rem"
  },
  image: {
    width: "15rem",
    height: "14rem",
    objectFit: "contain"
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
    setImageURL([]);
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

  const handleUpload = async (event) => {
    setLoading(true);
    const filesSize = event.target.files.length;
    const files = [];
    for (let i = 0; i < filesSize; i++) {
      files.push(event.target.files[i]);
    }

    const fileURLs = files.map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
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
    await Promise.all(fileURLs);
    setLoading(false);
    setIsUploading(false);
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
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth hiddenLabel>
              <FilledInput
                classes={{ root: classes.input }}
                disableUnderline
                placeholder="Type something..."
                value={text}
                name="text"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton variant="text" onClick={handleClickOpen}>
                      <SvgIcon {...props}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </SvgIcon>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
        </Box>
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
                  <Box
                    className={classes.dialogInput}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      value={imageText}
                      onChange={handleChangeImageText}
                      id="standard-basic"
                      label="add text"
                      variant="standard"
                    />
                    <Button
                      className={classes.dialogInputButton}
                      variant="contained"
                      color="primary"
                      onClick={handleSendImage}
                    >
                      Send
                    </Button>
                  </Box>
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
