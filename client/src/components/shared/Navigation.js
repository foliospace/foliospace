import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

export default withAuth(
  class Navigation extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.checkAuthentication();
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    render() {
      if (this.state.authenticated === null) return null;
      const authNav = this.state.authenticated ? (
        <ul className="auth-nav">
          <li>
            <Link to = "/logout"
              onClick = {() => this.props.auth.login()} 
            > Logout </Link> 
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      ) : (
        <ul className="auth-nav">
          <li> 
            <Link to = "/login"
              onClick = {() => this.props.auth.login()} 
            > Login </Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      );
      return (
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {authNav}
          </ul>
        </nav>
      );
    }
  }
);