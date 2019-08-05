import { connect } from "react-redux";
import React, { Component } from "react";
import { firebaseLogOut } from "../../redux/actions";
import DmButton from "../shared/elements/DmButton";
import DmFolderWidget from "../shared/widgets/DmFolderWidget";
import { FaRegThumbsUp, FaHeart, FaEnvelope } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { withRouter } from "react-router";

const mapStateToProps = (state: any) => state.firebaseAuth;
const mapDispatchToProps = (dispatch: any) => ({
  firebaseLogOut: () => dispatch(firebaseLogOut()),
});

const Counter = (props: any) => <span
  style={{ paddingRight: "10px", fontSize: "18px" }}>
  {props.itemId}</span>;

const LikeCounter = (props: any) =>
  <DmButton text={<><Counter itemId={props.itemId} /><FaRegThumbsUp /></>}
  onClick={() => null} className="margin-top-10 button-grey" />;

interface IHomeProps {
  history: any;
  match: any;
  location?: any;
}

interface IHomeState {
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

class Person extends React.Component<IHomeProps, IHomeState> {

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
  }

  public componentDidUpdate(prevProps: IHomeProps): void {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    const { match: { params } } = this.props;
    return (
      <>
      <div style={{textAlign: "center"}}>{params.id}</div>
      <div className="container fade-in-fx">

        <div className="row">
          <div className="col-sm-4">
            <DmFolderWidget title="BRAWLcast 261 Data Raven - Renegade Interrupt">
              <LazyLoadImage
                src="/cast_1.jpg"
                placeholderSrc="/no-image-slide.png"
                effect="blur"
                className="in-folder-img round-border-50" />
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
              <LazyLoadImage
                src="/bio_3.jpg"
                placeholderSrc="/no-image-slide.png"
                effect="blur"
                className="in-folder-img round-border-50" />
                <p>
                When the conditional part of an if-statement is long enough to require 
                that it be written across multiple lines, it"s worth noting that the 
                combination of a two character keyword (i.e. if), plus a single space, 
                plus an opening parenthesis creates a natural 4-space indent for the 
                subsequent lines of the multiline conditional.
                </p>
            </DmFolderWidget>

            <p></p>

            <DmFolderWidget title="Application">
                When the conditional part of an if-statement is long enough to require 
                that it be written across multiple lines, it"s worth noting that the 
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Person) as any);
