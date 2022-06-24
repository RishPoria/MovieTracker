import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  img_500,
  unavailable,
  unavailableLandscape
} from "../../config/config";
import "./ContentModal.css";
import YouTubeIcon from "@material-ui/icons/YouTube";
import DoneIcon from "@material-ui/icons/Done";
import Carousel from "../Carousel/Carousel";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    width: "90%",
    height: "80%",
    backgroundColor: "#243642",
    border: "1px solid #282c34",
    borderRadius: 10,
    color: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3)
  }
}));

const api_host = "https://api.themoviedb.org";
const listID = "8175745";
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

export default function TransitionsModal({ children, media_type, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const [added, setAdded] = useState(0);

  const options = {
    headers: {
      "content-type": "application/json;charset=utf-8",
      authorization: `Bearer ${accessToken}`
    }
  };

  const handleOpen = () => {
    checkAdded();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkAdded = async () => {
    try {
      await axios.get(
        `${api_host}/4/list/${listID}/item_status?media_id=${id}&media_type=${media_type}`,
        options
      );
      setAdded(1);
    } catch (error) {
      setAdded(0);
    }
  };

  const addItem = async () => {
    try {
      await axios.post(
        `${api_host}/4/list/${listID}/items`,
        { items: [{ media_type, media_id: id }] },
        options
      );
      setAdded(1);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async () => {
    try {
      await axios.delete(`${api_host}/4/list/${listID}/items`, {
        headers: { Authorization: "Bearer " + accessToken },
        data: {
          items: [{ media_type, media_id: id }]
        }
      });
      setAdded(0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line
  }, [added]);

  return (
    <>
      <div
        className="media"
        style={{ cursor: "pointer" }}
        color="inherit"
        onClick={handleOpen}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          {content && (
            <div className={classes.paper}>
              <div className="ContentModal">
                <img
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                />

                <div className="ContentModal__about">
                  <span className="ContentModal__title">
                    {content.name || content.title} (
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "-----"
                    ).substring(0, 4)}
                    )
                  </span>

                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}

                  <span className="ContentModal__description">
                    {content.overview}
                  </span>

                  <div>
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginTop: "18px"
                    }}
                  >
                    <Fab
                      variant="extended"
                      color="secondary"
                      target="__blank"
                      href={`https://www.youtube.com/watch?v=${video}`}
                    >
                      <YouTubeIcon style={{ marginRight: "10px" }} />
                      <h5 style={{ margin: "2px 7px 0px 5px" }}>
                        Watch the Trailer
                      </h5>
                    </Fab>
                    <Fab
                      variant="extended"
                      color={added ? "secondary" : "primary"}
                      aria-label="add"
                      onClick={added ? deleteItem : addItem}
                    >
                      <h5 style={{ margin: "2px 7px 0px 5px" }}>
                        {added ? "Added" : "Add"}
                      </h5>
                      {added ? <DoneIcon /> : <AddIcon />}
                    </Fab>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </>
  );
}
