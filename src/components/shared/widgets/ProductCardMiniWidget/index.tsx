import React from "react";
import "./style.scss";
import { FaEnvelope } from "react-icons/fa";
import { FaRegStar, FaCommentAlt } from "react-icons/fa";
import DmButton from "../../elements/DmButton";
import { LazyLoadImage } from "react-lazy-load-image-component";

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

const ProductCardMiniWidget = (props: IWidgetProps) =>
  <div id="product-folder-widget" className={`nice-border shadow-right-bottom ${props.className}
    margin-top-10 ${props.shadow}`} style={props.style}>
    <div className="product-folder-center">
      {props.title &&
        <div className="product-folder-right round-border-5px-only-top">
          {props.icon &&
            <span>{props.icon}</span>
          }
          <b>{props.title}</b>
        </div>
      }
    </div>

    <div className="login-body">
      <div>
        <div style={{float: "left"}}>
          <LazyLoadImage
            src={props.img_preview}
            placeholderSrc="/img/no-image-slide.png"
            effect="blur"
            className="in-folder-img round-border-50" />
        </div>
        {props.description && <p>{props.description.slice(0, 120)} ...</p>}
        <table style={{width: "100%"}}><tbody><tr>
          <td style={{width: "30%"}} className="td-pad-10">
              <DmButton text={<FaEnvelope />}
              onClick={() => {props.history.push("/profile")}}
              className="margin-top button-transparent" />
          </td>
          <td style={{width: "35%"}} className="td-pad-10">
            <DmButton text={<FaRegStar />}
            onClick={() => {props.history.push("/profile")}}
            className="margin-top button-grey" />
          </td>
          <td style={{width: "35%"}} className="td-pad-10">
            <DmButton text={<FaCommentAlt />}
            onClick={() => {props.history.push("/profile")}}
            className="margin-top button-grey" />
          </td>
        </tr></tbody></table>
      </div>
    </div>
  </div>;

export default ProductCardMiniWidget;
