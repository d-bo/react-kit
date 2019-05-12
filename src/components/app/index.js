import Navbar from '../app-navbar';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import React, { Component } from 'react';
import DmButton from '../shared/DmButton';
import { FaCommentAlt, FaRegStar } from "react-icons/fa";
import { FaHeart, FaRegThumbsUp, FaEnvelope } from "react-icons/fa";
import { firebaseLogOut } from '../../redux/actions';
import DmFolderWidget from '../shared/DmFolderWidget';


const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  firebaseLogOut: () => dispatch(firebaseLogOut())
});


class App extends Component {

	constructor(props) {
		super(props);
    this.state = {
      user: firebase.auth().currentUser,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false
    };
    this.handleLogOut = this.handleLogOut.bind(this);
    this.sendVerifyLink = this.sendVerifyLink.bind(this);
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

  sendVerifyLink() {
    var self = this;
    self.setState({
      loading: true
    });
    firebase.auth().currentUser.sendEmailVerification({
      url: 'http://localhost:3000/'
    }).then(function() {
      self.setState({
        verifyLinkSent: true
      });
      self.forceUpdate();
    })
    .catch(function(error) {
      self.setState({
        errors: error.message,
        loading: false
      });
    });
  }

  render() {
    return (
      <>
      <Navbar {...this.props} />
      <div className="container fade-in-fx">
        <div className="row">
          <div className="col-sm-4">

            <DmFolderWidget title="Python Identity Operators">
                <div style={{textAlign: 'center', marginBottom: '14px'}}>
                  <img src="/bio_1.jpg" alt="" className="round-border-5px" 
                   />
                </div>

                <table style={{width: '100%'}}><tbody><tr>
                  <td style={{width: '35%'}}>
                    <DmButton text={<FaRegThumbsUp />} loading={this.state.loading} 
                    click={() => this.props.history.push('/profile')} 
                    className="margin-top-10 button-transparent" />
                  </td>
                  <td style={{width: '30%'}} className="td-pad-10">
                    <DmButton text={<FaHeart />} loading={this.state.loading} 
                    click={() => this.props.history.push('/profile')} 
                    className="margin-top-10 button-red" />
                  </td>
                  <td style={{width: '35%'}}>
                    <DmButton text={<FaEnvelope />} loading={this.state.loading} 
                    click={() => this.props.history.push('/profile')} 
                    className="margin-top-10 button-transparent" />
                  </td>
                </tr></tbody></table>

            </DmFolderWidget>

          </div>
          <div className="col-sm-4">
            <DmFolderWidget title="Skills">
            <DmButton text="INSTALL" loading={this.state.loading} 
            click={() => this.props.history.push('/profile')} className="margin-bottom" />
              <code style={{fontSize: '12px',lineHeight: '10px'}}>
                # No extra indentation.
                if (this_is_one_thing and
                    that_is_another_thing):
                    do_something()

                # Add a comment, which will provide some distinction in editors
                # supporting syntax highlighting.
                if (this_is_one_thing and
                    that_is_another_thing):
                    # Since both conditions are true, we can frobnicate.
                    do_something()

                # Add some extra indentation on the conditional continuation line.
                if (this_is_one_thing
                        and that_is_another_thing):
                    do_something()
              </code>
            </DmFolderWidget>

          </div>
          <div className="col-sm-4">
            <DmFolderWidget title={<FaRegStar />}>
              <DmButton text="PROFILE" loading={this.state.loading} 
              click={() => this.props.history.push('/profile')} className="margin-bottom" />
              <img src="/bio_2.jpg" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes 
              and sizes thanks to a twelve column system, five default responsive tiers, 
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: '100%'}}><tbody><tr>
                <td style={{width: '30%'}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={this.state.loading} 
                    click={() => this.props.history.push('/profile')} 
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: '35%'}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={this.state.loading} 
                  click={() => this.props.history.push('/profile')} 
                  className="margin-top button-grey" />
                </td>
                <td style={{width: '35%'}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={this.state.loading} 
                  click={() => this.props.history.push('/profile')} 
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4">
            <DmFolderWidget title="BRAWLcast 261 Data Raven - Renegade Interrupt">
              <img src="/cast_1.jpg" alt="" className="in-folder-img round-border-50" />
              Rizzle - Serenity <b>[Dispatch Recordings]</b>
              Kasra - Alburz <b>[Critical Music]</b>
              Skeptical - Mechanism [Exit Records]
              Neve - Ping Pong [Guidance]
              Mefjus - Sinkhole (Skeptical Remix) [Vision Recordings]
              Trex & Qu3st - Eye Spy [The Dreamers]
              Alix Perez & Monty - Good to Me [1985 Music]
              Nucleus & Paradox - Azha [Metalheadz]
              Frame & Base - Pony Express [Delta9 Recordings]
              Blacklight - Enormous Machine [Subplate Recordings]
              Doctor Jeep - Natural Selection [Plush Recordings]
              Ground - Attract [Flexout Audio]
            </DmFolderWidget>
          </div>
          <div className="col-sm-8">
            <DmFolderWidget title="Rave girl 303">
                <img src="/bio_3.jpg" alt="" className="in-folder-img round-border-50" />
                <p>
                When the conditional part of an if-statement is long enough to require 
                that it be written across multiple lines, it's worth noting that the 
                combination of a two character keyword (i.e. if), plus a single space, 
                plus an opening parenthesis creates a natural 4-space indent for the 
                subsequent lines of the multiline conditional.
                </p>
            </DmFolderWidget>
            <p></p>
            <DmFolderWidget title="Application">
                When the conditional part of an if-statement is long enough to require 
                that it be written across multiple lines, it's worth noting that the 
                combination of a two character keyword (i.e. if), plus a single space, 
                plus an opening parenthesis creates a natural 4-space indent for the 
                subsequent lines of the multiline conditional.
            </DmFolderWidget>
          </div>
        </div>

      </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);