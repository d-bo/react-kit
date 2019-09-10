import React from "react";
import DmButton from "../shared/elements/DmButton";
import DmFolderWidget from "../shared/widgets/DmFolderWidget";
import { FaRegThumbsUp, FaHeart, FaEnvelope } from "react-icons/fa";
import { FaRegStar, FaCommentAlt } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ButtonWidget from "../shared/widgets/ButtonWidget";
import { withRouter } from "react-router";
import Footer from "../app-footer";
import axios from "axios";
import produce from "immer";
import { receiveItems } from "../../redux/actions";
import store from "../../redux/stores/store";
import { connect } from "react-redux";
import { LoadingFacebookBlack } from "../shared/elements/Loader";
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
} from "mongodb-stitch-browser-sdk";
import { networkStatusType } from "../../redux/actions";
import ProductCardMiniWidget from "../shared/widgets/ProductCardMiniWidget";
import "./style.scss";

const mapStateToProps = (state: any) => state.firebaseAuth;

const Counter = (props: any) => <span style={{ paddingRight: "10px", fontSize: "18px" }}>{props.itemId}</span>;
const LikeCounter = (props: any) =>
  <DmButton text={<><Counter itemId={props.itemId} /><FaRegThumbsUp /></>}
  onClick={() => null} className="margin-top-10 button-grey" />;

interface IHomeProps {
  history: any;
  items: object[] | null;
  location?: any;
  networkStatus?: networkStatusType;
}

interface IHomeState {
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

class Home extends React.PureComponent<IHomeProps, IHomeState> {

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      errors: null,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
    this.fetchItems = this.fetchItems.bind(this);
    this.fetchItemsMongoAtlas = this.fetchItemsMongoAtlas.bind(this);
  }

  public componentDidUpdate(prevProps: IHomeProps) {
    const {location, items} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
    if (prevProps.items && items && prevProps.items.length !== items.length) {
      store.dispatch(this.fetchItemsMongoAtlas() as any);
    }
  }

  public fetchItemsMongoAtlas() {
    const self = this;
    return (dispatch: any) => {
      const client = Stitch.initializeDefaultAppClient("kuvalda-uuveu");
      const db = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db("test");
      client.auth.loginWithCredential(new AnonymousCredential()).then((user) =>
        db.collection("gotcha").find({}, {limit: 10}).asArray(),
      ).then((docs: any) => {
        dispatch(receiveItems(docs));
      }).catch((error: any) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.errors = error;
          }),
        );
      });
    };
  }

  public fetchItems() {
    const self = this;
    return (dispatch: any) => {
      axios({
        method: "get",
        responseType: "json",
        url: "https://fakerestapi.azurewebsites.net/api/Users",
      })
      .then((response) => {
        dispatch(receiveItems(response.data));
      })
      .catch((error) => {
        self.setState(
          produce(self.state, (draft) => {
            draft.errors = error;
          }),
        );
        dispatch(receiveItems(null));
      });
    };
  }

  public componentDidMount(): void {
    const {networkStatus, items} = this.props;
    if (!items && networkStatus === "online") {
      store.dispatch(this.fetchItemsMongoAtlas() as any);
    }
  }

  public render() {
    const {errors, loading} = this.state;
    const {items} = this.props;
    return (
      <>
      <div className="container-fluid fade-in-fx body-page-color body-page-margin-top">

        {items &&
          <div className="row-fluid fade-in-fx">
            <div className="row">
            <div className="col-sm-6 col-lg-8">
              <div className="row no-gutters">

                {items &&
                  items.map((item: any) =>
                  <div className="col-sm-12 col-lg-6 col-md-12 col-xl-4" key={item.id}>
                    <ProductCardMiniWidget
                      title={item.name}
                      shadow="soft-left-bottom-shadow"
                      img_preview={item.img_preview}
                      description={item.description}>
                    </ProductCardMiniWidget>
                  </div>,
                  )
                }

              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <DmFolderWidget title="Телефон NOKIA 3310"
                style={{textAlign: "center"}}>
                <LazyLoadImage
                  src="/img/prod-5.jpg"
                  placeholderSrc="/img/no-image-slide.png"
                  effect="blur"
                  className="fit-in-cover-product round-border-3px" />
                <h2 className="price">{<FaRegStar/>} 71 $</h2>
              </DmFolderWidget>
              <DmFolderWidget title="Утюг Tefal CV-901"
                desc="Тип загрузки: фронтальная, максимальная загрузка: 4кг,
                отжим: 1000об/мин, класс стирки: A, класс отжима: B, дисплей, цвет: белый"
                style={{textAlign: "center"}}>

                <ButtonWidget />

                <LazyLoadImage
                  src="/img/prod-1.jpg"
                  placeholderSrc="/img/no-image-slide.png"
                  effect="blur"
                  className="fit-in-cover-product round-border-3px" />

                <h2 className="price">{<FaRegStar/>} 233 $</h2>

              </DmFolderWidget>
            </div>
          </div>
          </div>
        }

        {!items &&
          <LoadingFacebookBlack/>
        }

        {errors &&
          <div className="error-message round-border-5px">No items</div>
        }

      </div>
      <Footer />
      </>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Home) as any);
