import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import auth from "../auth";
import { CustomedButton } from "./CustomedButton";
import SvgIcon from "@mui/material/SvgIcon";
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
export const Navbar = (props) => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const checkIfUserIsLogged = localStorage.getItem("token") ? true : false;
  const handleSignUp = (e) => {
    e.preventDefault();

    navigate("/register");
  };
  const handleSignIn = (e) => {
    e.preventDefault();

    navigate("/");
  };
  const handleLogout = (e) => {
    e.preventDefault();
    auth.logout(() => {
      navigate("/");
    });
  };
  useEffect(() => {
    localStorage.getItem("firstname")
      ? setUser(
          localStorage.getItem("firstname") +
            " " +
            localStorage.getItem("lastname")
        )
      : setUser("");
  });
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-right">
        <HomeIcon
          color={props.isOnline && checkIfUserIsLogged ? "success" : "action"}
          fontSize="large"
        />
        {user}
        {checkIfUserIsLogged && (
          <ul className="navbar-nav ml-auto">
            <CustomedButton
              text={"Logout"}
              action={handleLogout}
              color={"secondary"}
            />
          </ul>
        )}
        {!checkIfUserIsLogged && (
          <>
            <ul className="navbar-nav ml-auto">
              <div className="container">
                <div className="row">
                  <div className="offset-m mx-2">
                    <CustomedButton
                      text={"Sign up"}
                      action={handleSignUp}
                      color={"success"}
                    />
                  </div>
                  <div className="mx-2 float-right">
                    <CustomedButton
                      text={"Sign in"}
                      action={handleSignIn}
                      color={"primary"}
                    />
                  </div>
                </div>
              </div>
            </ul>
          </>
        )}
      </nav>
    </div>
  );
};

Navbar.defaultProps = {
  iconColor: "action",
};
