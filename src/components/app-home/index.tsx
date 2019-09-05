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

const mapStateToProps = (state: any) => state.firebaseAuth;

const Counter = (props: any) => <span style={{ paddingRight: "10px", fontSize: "18px" }}>{props.itemId}</span>;
const LikeCounter = (props: any) =>
  <DmButton text={<><Counter itemId={props.itemId} /><FaRegThumbsUp /></>}
  onClick={() => null} className="margin-top-10 button-grey" />;

interface IHomeProps {
  history: any;
  items: object[] | null;
  location?: any;
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
  }

  public componentDidUpdate(prevProps: IHomeProps) {
    const {location} = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
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
    if (!this.props.items) {
      store.dispatch(this.fetchItems() as any);
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
              <div className="row">

                {items.map((item: any) =>
                  <div className="col-sm-12 col-lg-6 col-md-12 col-xl-4" key={item.ID}>
                    <DmFolderWidget title={item.UserName} shadow="soft-left-bottom-shadow">
                      <img src="/img/python-logo.png" alt=""
                        className="in-folder-img round-border-50" />
                      <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
                    and sizes thanks to a twelve column system, five default responsive tiers,
                    Sass variables and mixins, and dozens of predefined classes.</p>
                    <table style={{width: "100%"}}><tbody><tr>
                      <td style={{width: "30%"}} className="td-pad-10">
                          <DmButton text={<FaEnvelope />} loading={loading}
                          onClick={() => this.props.history.push("/profile")}
                          className="margin-top button-transparent" />
                      </td>
                      <td style={{width: "35%"}} className="td-pad-10">
                        <DmButton text={<FaRegStar />} loading={loading}
                        onClick={() => this.props.history.push("/profile")}
                        className="margin-top button-grey" />
                      </td>
                      <td style={{width: "35%"}} className="td-pad-10">
                        <DmButton text={<FaCommentAlt />} loading={loading}
                        onClick={() => this.props.history.push("/profile")}
                        className="margin-top button-grey" />
                      </td>
                    </tr></tbody></table>
                    </DmFolderWidget>
                  </div>,
                )}

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

        <div className="row">
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Python" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
                onClick={() => this.props.history.push("/person/58758ff")}
                className="margin-bottom" />
              <img src="/img/python-logo.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Javascript" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
                onClick={() => this.props.history.push("/person/58758ff")}
                className="margin-bottom" />
              <img src="/img/js-logo.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Go" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
                onClick={() => this.props.history.push("/person/58758ff")}
                className="margin-bottom" />
              <img src="/img/Go-Logo_Blue.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Rust" shadow="soft-left-bottom-shadow">
              <p></p>
              <img src="/img/rust-logo.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>

          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="C++" shadow="soft-left-bottom-shadow">
              <p></p>
              <img src="/img/c-plus-plus-logo.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="C" shadow="soft-left-bottom-shadow">
              <p></p>
              <img src="/img/c-logo.png" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
            </DmFolderWidget>
            <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Isabelle Hurst" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
              onClick={() => this.props.history.push("/person/58758ff")}
              className="margin-bottom" />
              <img src="/img/bio_1.jpg" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Jeffrey Monnaghan" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
              onClick={() => this.props.history.push("/person/87g8787")} className="margin-bottom" />
              <img src="/img/bio_2.jpg" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-6 col-lg-4">
            <DmFolderWidget title="Nina Ricci" shadow="soft-left-bottom-shadow">
              <DmButton text="PROFILE" loading={loading}
              onClick={() => this.props.history.push("/person/ricci.ui")} className="margin-bottom" />
              <img src="/img/bio_3.jpg" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">

          <div className="col-sm-4 col-lg-2">
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

          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget title="Холодильник SAMSUNG XL-908"
            desc="Тип загрузки: фронтальная, максимальная загрузка: 4кг, отжим: 1000об/мин"
            style={{textAlign: "center"}}>

              <ButtonWidget />

              <LazyLoadImage
                src="/img/prod-2.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover-product round-border-3px" />

              <h2 className="price">{<FaRegStar/>} 13 $</h2>

            </DmFolderWidget>
          </div>

          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget title="Пылесос MUSTANG El Diablo"
            desc="Тип загрузки: фронтальная, максимальная загрузка: 4кг,
            отжим: 1000об/мин, класс стирки: A, класс отжима: B,
            дисплей, цвет: белый"
            style={{textAlign: "center"}}>

              <ButtonWidget />

              <LazyLoadImage
                src="/img/prod-3.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover-product round-border-3px" />

              <h2 className="price">{<FaRegStar/>} 13 $</h2>

            </DmFolderWidget>
          </div>

          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget title="Стиральная машина LIQUID MOLLY KL-908"
              style={{textAlign: "center"}}>

              <ButtonWidget />

              <LazyLoadImage
                src="/img/prod-4.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover-product round-border-3px" />

              <h2 className="price">{<FaRegStar/>} 96 $</h2>

            </DmFolderWidget>
          </div>

          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget title="Телефон NOKIA 3310"
              style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/prod-5.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover-product round-border-3px" />

              <ButtonWidget />

              <h2 className="price">{<FaRegStar/>} 71 $</h2>

            </DmFolderWidget>
          </div>

          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget title="Стиральная машина LIQUID MOLLY KL-908"
              style={{textAlign: "center"}}>

              <ButtonWidget />

              <LazyLoadImage
                src="/img/prod-6.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover-product round-border-3px" />

              <h2 className="price">{<FaRegStar/>} 59.32 $</h2>

            </DmFolderWidget>
          </div>

        </div>

        <div className="row">
          <div className="col-sm-4 col-lg-3">
            <DmFolderWidget title="Mercedes ZX180" style={{textAlign: "center"}}>
            <ButtonWidget />
            <LazyLoadImage
              src="/img/avto-1.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px product-pic-shadow" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-3">
            <DmFolderWidget title="Toyota RAV102" style={{textAlign: "center"}}>
              <ButtonWidget />
              <LazyLoadImage
                src="/img/avto-2.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-3">
            <DmFolderWidget title="LADA 540 El Diablo" style={{textAlign: "center"}}>
              <ButtonWidget />
              <LazyLoadImage
                src="/img/avto-3.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-3">
            <DmFolderWidget title="BMW Z3 Autotesting" style={{textAlign: "center"}}>
              <ButtonWidget />
              <LazyLoadImage
                src="/img/avto-4.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-3">
            <DmFolderWidget title="Shailene Woodley" style={{textAlign: "center"}}>
            <LazyLoadImage
              src="/img/bio_4.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
              <DmButton text={<FaHeart />} loading={loading}
              onClick={() => this.props.history.push("/profile")}
              className="margin-top-10 button-grey margin-top" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget title="Ashley judd" style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/ashley_judd.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />

              <table style={{width: "100%"}} className="margin-top"><tbody><tr>
                <td style={{width: "50%"}}>
                  <DmButton text={<FaRegThumbsUp />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top-10 button-transparent" />
                </td>
                <td style={{width: "50%"}}>
                  <DmButton text={<FaEnvelope />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top-10 button-grey" />
                </td>
              </tr></tbody></table>

            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget title="Brie Larson" style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/brie_larson.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget title="Natasha Henstridge" style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/natasha_henstridge.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-3">
            <DmFolderWidget title="Shailene Woodley" style={{textAlign: "center"}}>
            <LazyLoadImage
              src="/img/nude-1.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px product-pic-shadow" />
              <DmButton text={<FaHeart />} loading={loading}
              onClick={() => this.props.history.push("/profile")}
              className="margin-top-10 button-grey margin-top" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget desc="Njkbvwiueg wewiugfuwgeuwg" title="Ashley judd"
            style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/nude-2.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px product-pic-shadow" />
              <table style={{width: "100%"}} className="margin-top"><tbody><tr>
                <td style={{width: "50%"}}>
                  <DmButton text={<FaRegThumbsUp />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top-10 button-transparent" />
                </td>
                <td style={{width: "50%"}}>
                  <DmButton text={<FaEnvelope />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top-10 button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget title={<FaRegStar />} style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/nude-3.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px product-pic-shadow" />
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
          <div className="col-sm-3">
            <DmFolderWidget title="Natasha Henstridge" style={{textAlign: "center"}}>
              <LazyLoadImage
                src="/img/nude-4.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px product-pic-shadow" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-1.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="46" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-2.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="12" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-3.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="69" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-4.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="19" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-5.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="76" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-6.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="84" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-7.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="59" />
          </div>
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-8.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="97" />
          </div>
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-9.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="62" />
          </div>
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-10.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="5" />
          </div>
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-11.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="37" />
          </div>
          <div className="col-sm-4 col-lg-2">
            <LazyLoadImage
              src="/img/nude-12.jpg"
              placeholderSrc="/img/no-image-slide.png"
              effect="blur"
              className="fit-in-cover round-border-5px" />
            <LikeCounter itemId="55" />
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-13.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="46" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-14.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="12" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-15.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="69" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-16.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="19" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-17.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="76" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-18.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="84" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-19.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="46" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-20.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="12" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-21.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="69" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-22.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="19" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-23.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="76" />
            </DmFolderWidget>
          </div>
          <div className="col-sm-4 col-lg-2">
            <DmFolderWidget>
              <LazyLoadImage
                src="/img/nude-24.jpg"
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="fit-in-cover round-border-5px" />
              <LikeCounter itemId="84" />
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4">
            <DmFolderWidget title="Python Identity Operators">
                <div style={{textAlign: "center", marginBottom: "14px"}}>
                <LazyLoadImage
                  src="/img/bio_1.jpg"
                  placeholderSrc="/img/no-image-slide.png"
                  effect="blur"
                  className="round-border-5px" />
                </div>

                <table style={{width: "100%"}}><tbody><tr>
                  <td style={{width: "35%"}}>
                    <DmButton text={<FaRegThumbsUp />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top-10 button-transparent" />
                  </td>
                  <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaHeart />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top-10 button-red" />
                  </td>
                  <td style={{width: "35%"}}>
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top-10 button-transparent" />
                  </td>
                </tr></tbody></table>

            </DmFolderWidget>

          </div>
          <div className="col-sm-4">
            <DmFolderWidget title="Skills">
            <DmButton text="INSTALL" loading={loading}
            onClick={() => this.props.history.push("/profile")} className="margin-bottom" />
              <code style={{fontSize: "12px", lineHeight: "10px"}}>
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
              <DmButton text="PROFILE" loading={loading}
              onClick={() => this.props.history.push("/profile")} className="margin-bottom" />
              <img src="/img/bio_2.jpg" alt="" className="in-folder-img round-border-50" />
              <p>Use our powerful mobile-first flexbox grid to build layouts of all shapes
              and sizes thanks to a twelve column system, five default responsive tiers,
              Sass variables and mixins, and dozens of predefined classes.</p>
              <table style={{width: "100%"}}><tbody><tr>
                <td style={{width: "30%"}} className="td-pad-10">
                    <DmButton text={<FaEnvelope />} loading={loading}
                    onClick={() => this.props.history.push("/profile")}
                    className="margin-top button-transparent" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaRegStar />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
                <td style={{width: "35%"}} className="td-pad-10">
                  <DmButton text={<FaCommentAlt />} loading={loading}
                  onClick={() => this.props.history.push("/profile")}
                  className="margin-top button-grey" />
                </td>
              </tr></tbody></table>
            </DmFolderWidget>
          </div>
        </div>

        <p></p>

        <div className="row">
          <div className="col-sm-4">
            <DmFolderWidget title="BRAWLcast 261 Data Raven - Renegade Interrupt">
              <LazyLoadImage
                src="/img/cast_1.jpg"
                placeholderSrc="/img/no-image-slide.png"
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
                src="/img/bio_3.jpg"
                placeholderSrc="/img/no-image-slide.png"
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
      <Footer />
      </>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Home) as any);
