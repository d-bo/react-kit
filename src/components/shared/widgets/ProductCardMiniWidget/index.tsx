import React from "react";
import "./style.scss";
import { FaEnvelope } from "react-icons/fa";
import { FaRegStar, FaCommentAlt } from "react-icons/fa";
import DmButton from "../../elements/DmButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Modal from "react-responsive-modal";
import produce from "immer";

interface IWidgetProps {
  style?: any;
  className?: any;
  icon?: any;
  title?: any;
  children?: any;
  desc?: any;
  shadow?: string;
  img_preview?: string;
  description?: string;
  history?: any;
}

interface IWidgetState {
  modalIsOpen: boolean;
}

class ProductCardMiniWidget extends React.PureComponent<IWidgetProps, IWidgetState> {

  constructor(props: any) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
  }

  public onOpenModal = () => {
    this.setState(
      produce(this.state, (draft) => {
        draft.modalIsOpen = true;
      }),
    );
  }

  public onCloseModal = () => {
    this.setState(
      produce(this.state, (draft) => {
        draft.modalIsOpen = false;
      }),
    );
  }

  public render() {
    const {
      className,
      description,
      icon,
      img_preview,
      shadow,
      style,
      title,
    } = this.props;
    const {modalIsOpen} = this.state;
    return (
      <div id="product-folder-widget"
        className={`nice-border shadow-right-bottom ${className} margin-top-10 ${shadow}`}
        style={style}>

        <div className="product-folder-center">
          {title &&
            <div className="product-folder-right round-border-5px-only-top">
              {icon &&
                <span>{icon}</span>
              }
              <b>{title}</b>
            </div>
          }
        </div>

        { // If image preview exist
          img_preview &&
            <Modal open={modalIsOpen}
              onClose={this.onCloseModal} blockScroll={false}
              overlayId="product-modal-overlay" center>
              <img src={img_preview} className="product-modal-image" />
            </Modal>
        }

        <div className="login-body">
          <div>
            <div className="product-img-float-container"
              onClick={img_preview ? this.onOpenModal : () => null}>
              <LazyLoadImage
                src={img_preview}
                placeholderSrc="/img/no-image-slide.png"
                effect="blur"
                className="in-folder-img round-border-50" />
            </div>
            {description &&
              <p className="product-description">{description.slice(0, 120)} ...</p>
            }
            <table style={{width: "100%"}}><tbody><tr>
              <td style={{width: "30%"}} className="td-pad-10">
                  <DmButton text={<FaEnvelope />}
                  onClick={() => null}
                  className="margin-top button-transparent" />
              </td>
              <td style={{width: "35%"}} className="td-pad-10">
                <DmButton text={<FaRegStar />}
                onClick={() => null}
                className="margin-top button-grey" />
              </td>
              <td style={{width: "35%"}} className="td-pad-10">
                <DmButton text={<FaCommentAlt />}
                onClick={() => null}
                className="margin-top button-grey" />
              </td>
            </tr></tbody></table>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCardMiniWidget;
