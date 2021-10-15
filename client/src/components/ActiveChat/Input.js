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
  SvgIcon,
  InputAdornment,
  IconButton,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import axios from "axios";

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
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center"
  },
  dialogImage: {
    width: "80%"
  },
  dialogInput: {
    marginBottom: theme.spacing(5)
  },
  targetInput: {
    "& .MuiInputBase-input": {
      width: "100%",
      height: theme.spacing(5),
      fontSize: "2rem",
      marginBottom: theme.spacing(2)
    }
  },
  dialogInputButton: {
    marginTop: theme.spacing(5)
  },
  image: {
    width: "15rem",
    height: "14rem",
    objectFit: "contain"
  },
  inputFile: {
    margin: theme.spacing(5)
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { postMessage, otherUser, conversationId, user } = props;
  const [imageURL, setImageURL] = useState([]);
  const [imageText, setImageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(true);
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
    const imageURLs = Object.values(event.target.files).map((URL) => URL);
    const fileURLs = imageURLs.map(async (imageURL) => {
      try {
        const data = new FormData();
        data.append("file", imageURL);
        data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
        data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
        const result = await axios({
          method: "post",
          url: "https://api.cloudinary.com/v1_1/rayhookchris/image/upload",
          headers: {
            "Access-Control-Allow-Origin": "*",

            mode: "no-cors"
          },
          data: {
            body: data
          }
        });
        setImageURL((prevArray) => [...prevArray, result.url]);
      } catch (err) {
        console.error(err);
      }
    });
    await Promise.all(fileURLs);
    setLoading(false);
  };

  const handleSendImage = async (event) => {
    const reqBody = {
      text: imageText,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
      attachments: imageURL
    };

    await postMessage(reqBody);
    setImageText("");
    setLoading(true);
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
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className={classes.dialogTitle}
          >
            {loading ? "Select Image" : "Images loaded"} <Button onClick={handleClose}>X</Button>
          </Grid>
        </DialogTitle>
        <DialogContent className={classes.dialogContianer}>
          <DialogActions>
            <Grid container direction="column" spacing={4} alignItems="center">
              {loading && <input multiple type="file" onChange={handleUpload} />}
              {!loading && (
                <Grid container direction="column" alignItems="center">
                  <Grid
                    container
                    flexDirection="column"
                    className={classes.dialogInput}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <Grid container item justifyContent="center">
                      <img
                        className={classes.dialogImage}
                        src={imageURL[0]}
                        alt="preview attachment before sending"
                      />
                    </Grid>

                    <TextField
                      className={classes.targetInput}
                      value={imageText}
                      name="imageText"
                      onChange={handleChangeImageText}
                      id="standard-basic"
                      label="Type image caption"
                      variant="standard"
                    />
                    <Button
                      className={classes.dialogInputButton}
                      variant="contained"
                      color="primary"
                      onClick={handleSendImage}
                      fullWidth
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
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
