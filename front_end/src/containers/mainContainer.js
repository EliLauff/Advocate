import { WelcomeBanner } from "../components/welcomeBanner";
import { Dashboard } from "./dashboard";
import { UserSelect } from "../components/userSelect";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import SocketHandler from "../SocketHandler";
import { connect } from "react-redux";
import history from "../history";
import { LoginForm } from "../components/loginForm";
import { AdvocateSignup } from "../components/advocateSignup";
import { UserSignup } from "../components/userSignup";

const mapStateToProps = state => {
  return {
    language: localStorage.getItem("language") || state.language,
    userType: localStorage.getItem("userType") || state.userType
  };
};

const myConnector = connect(mapStateToProps);

class _MainContainer extends React.Component {
  constructor() {
    super();
    SocketHandler.connect(localStorage.getItem("token"));
  }

  componentDidMount() {}

  forceMainBoxRender = () => {
    this.forceUpdate();
  };

  renderPage = () => {
    if (localStorage.getItem("token")) {
      return <Dashboard forceMainBoxRender={this.forceMainBoxRender} />;
    } else {
      return (
        <Router history={history}>
          <Switch>
            <Route path="/userSelect" render={() => <UserSelect />} />
            <Route
              path="/userSignup"
              render={() => (
                <UserSignup forceMainBoxRender={this.forceMainBoxRender} />
              )}
            />
            <Route
              path="/advocateSignup"
              render={() => (
                <AdvocateSignup forceMainBoxRender={this.forceMainBoxRender} />
              )}
            />
            <Route
              path="/loginForm"
              render={() => (
                <LoginForm forceMainBoxRender={this.forceMainBoxRender} />
              )}
            />
            <Route
              path="/userSetup"
              render={props => {
                let token = props.location.search.split("?token=")[1];
                if (token) {
                  localStorage.setItem("token", token);
                  SocketHandler.disconnect();
                  SocketHandler.connect(localStorage.getItem("token"));
                  this.forceMainBoxRender();
                }
                return null;
              }}
            />
            <Route path="" render={() => <WelcomeBanner />} />
          </Switch>
        </Router>
      );
    }
  };

  render() {
    return <div>{this.renderPage()}</div>;
  }
}

export const MainContainer = myConnector(_MainContainer);
