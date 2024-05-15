import "./styles.css";
import { useState } from "react";
import { Box, Alert, IconButton, Collapse } from "@mui/material";
import { Close } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";

interface GHUser {
  name: string;
  login: string;
  public_repos: string;
  avatar_url: string;
}

interface GHRepo {
  id: number;
  name: string;
  full_name: string;
}

function Home() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [repos, setRepos] = useState("");
  const [avatar, setAvatar] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [noUserFound, setNoUserFound] = useState(false);

  async function search() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${inputValue}`
      );
      if (response.ok) {
        const data = (await response.json()) as GHUser;
        setLogin(data.login);
        setName(data.name);
        setRepos(data.public_repos);
        setAvatar(data.avatar_url);
        setFailed(false);
        setNoUserFound(false);
      } else {
        setFailed(true);
        setNoUserFound(true);
        setOpen(true);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
    setInputValue("");
  }

  const openModal = async () => {
    setOpen(true);
    try {
      const response = await fetch(
        `https://api.github.com/users/${login}/repos`
      );
      if (response.ok) {
        const data = (await response.json()) as GHRepo[];
        console.log(data);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>GH PROFILE FINDER</h1>

        {name && (
          <div className="user" onClick={openModal}>
            <img src={avatar} alt={name + " profile avatar"} />
            <span>{name}</span>
            <span>Repositórios: {repos}</span>
          </div>
        )}

        {(failed || noUserFound) && (
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
                {noUserFound
                  ? "Nenhum usuário encontrado!"
                  : "Erro ao buscar o usuário!"}
              </Alert>
            </Collapse>
          </Box>
        )}

        <div className="search">
          <input
            type="text"
            placeholder="Enter user"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={search}>Search</button>
        </div>
      </div>
    </>
  );
}

export default Home;
