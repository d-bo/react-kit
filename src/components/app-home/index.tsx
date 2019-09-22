import React from "react";
import DmFolderWidget from "../shared/widgets/DmFolderWidget";
import { FaRegStar } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ButtonWidget from "../shared/widgets/ButtonWidget";
import { withRouter } from "react-router";
import Footer from "../app-footer";
import { receiveItems } from "../../redux/actions";
import store from "../../redux/stores/store";
import { connect } from "react-redux";
import { LoadingFacebookBlack } from "../shared/elements/Loader";
import {
  Stitch,
  AnonymousCredential,
} from "mongodb-stitch-browser-sdk";
import ProductCardMiniWidget from "../shared/widgets/ProductCardMiniWidget";
import "./style.scss";
import { IPropsGlobal } from "../shared/Interfaces";

const mapStateToProps = (state: any) => state.firebaseAuth;

interface IHomeProps extends IPropsGlobal {
  readonly items: object[] | null;
}

interface IHomeState {
  errors: string | null;
  loading: boolean;
  loadingExit: boolean;
  verifyLinkSent: boolean;
}

interface IHomeProto {
  fetchItemsMongoAtlas(): (dispatch: any) => void;
}

class Home
extends React.PureComponent<IHomeProps, IHomeState>
implements IHomeProto {

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      errors: null,
      loading: false,
      loadingExit: false,
      verifyLinkSent: false,
    };
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

  public fetchItemsMongoAtlas(): (dispatch: any) => void {
    return (dispatch: any) => {
      const client = Stitch.initializeDefaultAppClient("kuvalda-uuveu");
      client.auth.loginWithCredential(new AnonymousCredential());
      client.callFunction("function0", []).then((res) => {
        dispatch(receiveItems(res));
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
    const {errors} = this.state;
    const {items} = this.props;
    return (
      <main>
        <div className="container-fluid fade-in-fx body-page-color body-page-margin-top">

          {items &&
              <div className="row-fluid fade-in-fx">
                <div className="row">
                  <div className="col-sm-6 col-lg-8">
                    <section>
                      <header>
                        <h2>Products</h2>
                      </header>
                      <div className="row no-gutters">
                        {items &&
                          items.map((item: any) =>
                            <div className="col-sm-12 col-lg-6 col-md-12 col-xl-4" key={item.id}>
                              <ProductCardMiniWidget
                                title={item.name}
                                shadow="soft-left-bottom-shadow"
                                img_preview={item.img_preview}
                                description={item.description}
                                className="animated pulse">
                              </ProductCardMiniWidget>
                            </div>,
                          )
                        }
                      </div>
                    </section>
                  </div>

                <div className="col-sm-6 col-lg-4">
                  <section>
                    <header>
                      <h2>News</h2>
                    </header>
                    <div className="row no-gutters">
                      <article>
                        <DmFolderWidget title="Телефон NOKIA 3310"
                          style={{textAlign: "center"}}>
                          <LazyLoadImage
                            src="/img/prod-5.jpg"
                            placeholderSrc="/img/no-image-slide.png"
                            effect="blur"
                            className="fit-in-cover-product round-border-3px animated pulse" />
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
                      </article>
                    </div>
                  </section>
                </div>
            </div>
            </div>
          }

          {!items &&
            <div style={{textAlign: "center"}}>
              <div style={{display: "inline-block"}}>
                <DmFolderWidget className="vertical-center center-loader-width">
                  <LoadingFacebookBlack/>
                </DmFolderWidget>
              </div>
            </div>
          }

          {errors &&
            <div className="error-message round-border-5px">No items</div>
          }

        </div>
        <Footer />
      </main>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Home) as any);
