import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../views/HomePage';
import MainMenu from '../views/MainMenu';
import SignupPage from '../views/SignupPage';
import LoginPage from '../views/LoginPage';
import ConfigPage from '../views/ConfigPage';
import RegisterDocType from '../views/RegisterDocType';
import DocumentEditPage from '../views/DocumentEditPage';
import DocumentUpdatePage from '../views/DocumentUpdatePage';
import EditDocumentLanding from '../views/EditDocumentLanding';
import EditDisplayTemplate from '../views/EditDisplayTemplate';
import FrontDocumentDisplay from '../views/FrontDocumentDisplay';
import UpdateDocType from '../views/UpdateDocType';
import NotFound from '../views/NotFound';
import ProfileEditPage from '../views/ProfileEditPage';
import Footer from '../reusables/Footer';
import axios from 'axios';
import { default as urlUtils } from '../utils';

class RedirectToIndex extends Component {
  static propTypes = {
    url: PropTypes.string
  }

  render() {
    return <Redirect to={this.props.url || '/'} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, config: undefined, canDisplay: false };
  }

  componentDidMount() {
    axios.get(
      urlUtils.serverInfo.path('/api/users/get'), { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ user: data, canDisplay: true }); })
      .catch((err) => {
        console.log(err);
        console.log('User not logged in.');
        this.setState({ user: null, canDisplay: true });
      });

    axios.get(
      urlUtils.serverInfo.path('/api/site_config/get'),
      { withCredentials: true })
      .then((res) => res.data)
      .then(data => { this.setState({ config: data }); })
      .catch((err) => {
        console.log(err);
        console.log('Couldn\'t get site config.');
        this.setState({ config: null, canDisplay: true });
      });

    axios.get(
      urlUtils.serverInfo.path('/api/documents/get_types'),
      { withCredentials: true
      }).then((res) => res.data).then(data => {
      console.log(data);
      this.setState({ docTypes: data, canDisplay: true });
    }).catch((err) => {
      console.log(err);
      console.log('Couldn\'t get document types.');
      this.setState({ docTypes: [], canDisplay: true });
    });
  }

  render() {
    if (this.state.canDisplay) return [
      (!!this.state.config && !!this.state.docTypes && !!this.state.user) ?
        <MainMenu config={this.state.config}
          user={this.state.user} docTypes={this.state.docTypes} /> : null,
      !!this.state.config ?
        <style>{this.state.config.stylesheet}</style> : null,
      <Router>
        <Switch>
          <Route exact path='/' component={() =>
            <HomePage user={this.state.user || null}
              config={this.state.config || null} /> } />
          {this.state.user !== undefined ?
            (this.state.user !== null && this.state.user.roleId === 0) ?
              [
                <Route exact path="/admin/edit_profile" component={() =>
                  <ProfileEditPage user={this.state.user} />} />,
                <Route exact path="/admin/config" component={() =>
                  <ConfigPage config={this.state.config} />} />,
                <Route exact path="/admin/register_type"
                  component={RegisterDocType} />,
                this.state.docTypes !== undefined ?
                  [<Route path='/admin/new/:docTypeId'
                    component={DocumentEditPage} />,
                  <Route path={'/admin/edit/:docType'}
                    component={({ match }) => (
                      <EditDocumentLanding match={match}
                        config={this.state.config} />)} />,
                  <Route path='/admin/edit_document/:docNode'
                    component={DocumentUpdatePage}/>,
                  <Route path='/admin/edit_template/:docTypeId'
                    component={EditDisplayTemplate}/>,
                  <Route path='/admin/edit_type/:docTypeId'
                    component={UpdateDocType}/>, ] :
                  null
              ] :
              <Route path="/admin/"
                component={() => <RedirectToIndex url="/login" />}/> : null}
          <Route path="/signup" component=
            {() => this.state.user ?
              <RedirectToIndex url="/admin"/> : <SignupPage />} />
          <Route path="/login" component=
            {() => this.state.user ?
              <RedirectToIndex url="/admin"/> : <LoginPage />} />,
          {!!this.state.config ?
            <Route path="/:docType/:docNode" component={({ match }) =>
              <FrontDocumentDisplay config={this.state.config}
                match={match} />} /> : null}
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>,
      <Footer user={this.state.user || null} />
    ];
    else return null;
  }
}

export default App;
