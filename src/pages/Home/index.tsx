import "./styles.css";
import { useState } from "react";
import api from "../../requests";

import { Box, Alert, IconButton, Collapse } from "@mui/material";
import { Close } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";

import Modal from "@mui/material/Modal";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vh",
  height: "60vh",
  bgcolor: "#242424",
  border: "0",
  boxShadow: 24,
  p: 4,
};

type GHResponse = {
  name: string;
  login: string;
  public_repos: string;
  avatar_url: string;
  html_url: string;
  repos_url: string;
};

function Home() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [repos, setRepos] = useState("");
  const [avatar, setAvatar] = useState("");

  const [reposList, setReposList] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [failed, setFailed] = useState(false);

  async function search() {
    // if (inputValue == "") {
    //   setName("");
    //   console.log("inputvalue null!");
    //   console.log(inputValue)
    //   return;
    // }
    api
      .get<GHResponse>(`${inputValue}`)
      .then((response) => {
        setLogin(response.data.login);
        setName(response.data.name);
        setRepos(response.data.public_repos);
        setAvatar(response.data.avatar_url);
        setFailed(false);
      })
      .catch((error) => {
        setName("");
        setOpen(true);
        setFailed(true);
        console.error("request failed", error);
      });
    setInputValue("");
  }

  const openModal = async () => {
    setOpen(true);
    try {
      const res = await axios.get(
        `https://api.github.com/users/${login}/repos`
      );
      if (res.status == 200) {
        const reposData = res.data;
        // setReposName(reposData.map((name) => name.name));
        setReposList(reposData)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="container">
        <h1>GH PROFILE FINDER</h1>

        {name && (
          <div className="user" onClick={openModal}>
            <img src={avatar} alt={name + "profile avatar"} />
            <span>{name}</span>
            <span>Repositórios: {repos}</span>
          </div>
        )}

        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* <div>
              {reposList.map((repos) => (
                <div>
                  <h1>{repos.name}</h1>
                  <span>{repos.full_name}</span>
                </div>
              ))}
            </div> */}
          </Box>
        </Modal>

        {failed && (
          <Box sx={{ width: "80%" }}>
            <Collapse in={open}>
              <Alert
                style={{ backgroundColor: "#fefefe" }}
                icon={<ErrorIcon style={{ color: "#000" }} />}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Nenhum Usuário Encontrado!
              </Alert>
            </Collapse>
          </Box>
        )}

        <div className="search">
          <input
            type="text"
            placeholder="Enter user"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button onClick={search}>Search</button>
        </div>
      </div>
    </>
  );
}

export default Home;
