import React, { useState, useContext, SVGProps } from "react";
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
  Grid,
  Theme
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import axios from "axios";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { axiosInstance } from "../../API/axiosConfig";
import { getErrorMessage, reportError } from "../../utils/catchError";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

const Input = (props: SVGProps<SVGSVGElement>) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [imageText, setImageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { activeChat, setActiveChat } = useContext(ActiveChatContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(true);
    setImageURL([]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleChangeImageText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const reqBody = {
      conversation: activeChat.conversationId,
      text: form.text.value``
    };

    try {
      const response = await axiosInstance.post("/messages/", reqBody);
      setActiveChat((prevState) => ({
        ...prevState,
        messages: response.data.messages,
        lastMessageId: response.data.last_message_id
      }));
      setText("");
    } catch (error) {
      reportError({ customMessage: "Failed to send message", message: getErrorMessage(error) });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imageURLs = Array.from(event.target.files).map((URL) => URL);
      const fileURLs = imageURLs.map(async (imageURL) => {
        if (
          process.env.REACT_APP_UPLOAD_PRESET &&
          process.env.REACT_APP_CLOUD_NAME &&
          process.env.REACT_APP_CLOUD_URI
        )
          try {
            const data = new FormData();
            data.append("file", imageURL);
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
            data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
            const instance = axios.create();
            const result = await instance.post(process.env.REACT_APP_CLOUD_URI, data);
            setImageURL((prevArray) => [...prevArray, result.data.url]);
          } catch (err) {
            console.error(err);
          }
      });
      await Promise.all(fileURLs);
      setLoading(false);
    }
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
                    <IconButton onClick={handleClickOpen}>
                      <SvgIcon>
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
          <Grid container alignItems="center" justifyContent="space-between">
            {loading ? "Select Image" : "Images loaded"} <Button onClick={handleClose}>X</Button>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <Grid container direction="column" spacing={4} alignItems="center">
              {loading && <input multiple type="file" onChange={handleUpload} />}
              {!loading && (
                <Grid container direction="column" alignItems="center">
                  <Grid
                    container
                    direction="column"
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

export default Input;
