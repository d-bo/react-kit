import React from "react";
import "./style.scss";
import { FaEnvelope } from "react-icons/fa";
import { FaRegStar, FaCommentAlt } from "react-icons/fa";
import DmButton from "../../elements/DmButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Modal from "react-responsive-modal";
import produce from "immer";
import { FirebaseUserContext } from "../../../../contexts/FirebaseUserContext";

interface IWidgetProps {
  readonly style?: any;
  readonly className?: any;
  readonly icon?: any;
  readonly title?: any;
  readonly children?: any;
  readonly desc?: any;
  readonly shadow?: string;
  readonly img_preview?: string;
  readonly description?: string;
  readonly history?: any;
}

interface IWidgetState {
  modalIsOpen: boolean;
}

interface IWidgetProto {
  onOpenModal(): void;
  onCloseModal(): void;
}

class ProductCardMiniWidget
extends React.PureComponent<IWidgetProps, IWidgetState>
implements IWidgetProto {

  constructor(props: any) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
  }

  public onOpenModal = () => {
    this.context.contextShowStaticNavbar(false);
    this.setState(
      produce(this.state, (draft) => {
        draft.modalIsOpen = true;
      }),
    );
  }

  public onCloseModal = () => {
    this.context.contextShowStaticNavbar(true);
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
      <section>
        <div id="product-folder-widget"
          className={`nice-border shadow-right-bottom ${className} margin-top-10 ${shadow}`}
          style={style}>

          <div className="product-folder-center">
            {title &&
              <div className="product-folder-right round-border-5px-only-top">
                {icon &&
                  <span>{icon}</span>
                }
                <header>
                  <b>{title}</b>
                </header>
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
                <article>
                  <p className="product-description">{description.slice(0, 120)} ...</p>
                </article>
              }

              <div className="flex-buttons-row">
                <DmButton icon={<FaEnvelope />}
                  onClick={() => null}
                  className="margin-top flex-button-item button-grey" />
                <DmButton icon={<FaRegStar />}
                  onClick={() => null}
                  className="margin-top flex-button-item button-grey" />
                <DmButton icon={<FaCommentAlt />}
                  onClick={() => null}
                  className="margin-top flex-button-item button-grey" />
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}

ProductCardMiniWidget.contextType = FirebaseUserContext;

export default ProductCardMiniWidget;
