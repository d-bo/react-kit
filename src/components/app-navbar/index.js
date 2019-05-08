import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import DmButton from '../shared/DmButton';
import { Link } from 'react-router-dom';
import { firebaseLogOut } from '../../redux/actions';


const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  firebaseLogOut: () => dispatch(firebaseLogOut())
});


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false
    };
    this.handleLogOut = this.handleLogOut.bind(this);
    this.redirectProfile = this.redirectProfile.bind(this);
  }

  handleLogOut() {
    var self = this;
    self.setState({
      loadingExit: true
    });
    firebase.auth().signOut().then(function() {
      self.setState({user: null, loadingExit: false});
      self.props.firebaseLogOut();
      self.props.history.push('/auth/signin');
    }).catch(function(error) {
      var errorMessage = error.message;
      self.setState({
        errors: errorMessage,
        loadingExit: false
      });
    });
  }

  redirectProfile() {
    this.props.history.push('/profile');
  }

  render() {
    return (
      <div className="navbar-body" style={{marginBottom: '14px'}}>
        <div className="container navbar">
          <div className="row">

            <div className="col-sm-4">
              <div>
                <Link to="/"><img src="/favicons/apple-touch-icon.png" 
                  alt="" className="img-navbar" />
                  </Link>
              </div>
            </div>

            <div className="col-sm-4"></div>

            <div className="col-sm-4 navbar-user">
              {this.state.user &&
                <div style={{textAlign: 'right'}}>
                  <span onClick={this.redirectProfile} style={{cursor: 'pointer'}}>
                  {this.state.user.displayName &&
                    <b>{this.state.user.displayName}</b>
                  }
                  {(this.state.user.email && !this.state.user.displayName) &&
                    <b>{this.state.user.email}</b>
                  }
                  {this.state.user.photoURL &&
                    <img className="img-navbar" src={this.state.user.photoURL} 
                    alt="" />
                  }
                  {!this.state.user.photoURL &&
                    <img className="img-navbar" src="/no-user.png"
                    alt="" />
                  }
                  </span>
                </div>
              }
              {!this.state.user &&
                <table style={{width: '100%'}}><tbody><tr>
                <td style={{width: '50%'}}></td>
                <td style={{width: '50%'}}>
                  <DmButton text="SIGN IN" loading={this.state.loading} 
                  onClick={() => this.props.history.push('/profile')} 
                  style={{padding: '7px 0', border: '1px solid #555', 
                  background: 'transparent', color: '#333'}} />
                </td>
                </tr></tbody></table>
              }
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);