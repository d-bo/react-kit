import "./style.scss";


type Viewport = {
  height: number;
  width: number;
}
interface IToastOptions {
  text?: string;
  position?: "left-top" | "top-left" | "left-bottom" | "bottom-left" |
    "center-top" | "top-center" | "center-bottom" | "bottom-center" |
    "right-top" | "top-right" | "right-bottom" | "bottom-right";
  width?: string;
  background?: string;
  color?: string;
}
export interface Toaster {
  getViewportHeightWidth(): Viewport;
  show(text?: string, options?: IToastOptions): void;
  createToast(text?: string, options?: IToastOptions): void;
  createContainer(): HTMLElement;
}

export class Toaster {

  /**
   * Get window width and height
   */
  public static getViewportHeightWidth(): Viewport {
    let viewportwidth, viewportheight;
    if (typeof window.innerWidth != "undefined") {
      viewportwidth = window.innerWidth;
      viewportheight = window.innerHeight;
    } else if (typeof document.documentElement != "undefined"
        && typeof document.documentElement.clientWidth != "undefined"
        && document.documentElement.clientWidth !== 0) {
          viewportwidth = document.documentElement.clientWidth;
          viewportheight = document.documentElement.clientHeight;
    } else {
      viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
      viewportheight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return {width: viewportwidth, height: viewportheight};
  }

  // Create container
  public static createContainer(): HTMLElement {
    const div = document.createElement("div");
    div.id = `toast-container-${new Date().getTime()}`;
    div.setAttribute("style",
      `position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      `);
    document.body.appendChild(div);
    return div;
  }

  public static createToast(text?: string, options?: IToastOptions) {

    // defaults
    let animateIn: string = "", animateOut: string = "";
    let elementWidth = null, elementBackground = "#333", elementColor = "#fff";

    const {width, height} = this.getViewportHeightWidth();

    const toastItem = document.createElement("div");
    if (options && options.width) {
      elementWidth = options.width;
    }
    if (options && options.background) {
      elementBackground = options.background;
    }
    if (options && options.color) {
      elementColor = options.color;
    }

    toastItem.setAttribute("style", `
      position: absolute;
      padding: 20px;
      background: ${elementBackground};
      color: ${elementColor};
      font-size: 16px;
      border-radius: 3px 3px 3px 3px;
      -moz-border-radius: 3px 3px 3px 3px;
      -webkit-border-radius: 3px 3px 3px 3px;
      visibility: hidden;
      word-break: break-word;
      ${elementWidth && `width: ${elementWidth};`};
    `);
    if (text) {
      toastItem.innerHTML = `<div>${text}</div>`;
    }
    document.body.appendChild(toastItem);
    // Calculate coords
    if (options && options.hasOwnProperty("position")) {
      if (options!.position!.indexOf("bottom") !== -1) {
        toastItem.style.bottom = "20px";
        animateIn = "fadeInDown";
        animateOut = "fadeOutUp";
      }
      if (options!.position!.indexOf("top") !== -1) {
        toastItem.style.top = "20px";
        animateIn = "fadeInUp";
        animateOut = "fadeOutDown";
      }
      if (options!.position!.indexOf("left") !== -1) {
        toastItem.style.left = "20px";
        animateIn = "fadeInRight";
      }
      if (options!.position!.indexOf("right") !== -1) {
        toastItem.style.right = "20px";
        animateIn = "fadeInLeft";
      }
      if (options!.position!.indexOf("center") !== -1) {
        const centerX = (width / 2) - (toastItem.scrollWidth / 2);
        toastItem.style.left = `${centerX}px`;
      }
    }
    //toastItem.style.left = "100px";
    //toastItem.style.top = "200px";
    toastItem.className = `animated fast ${animateIn}`;
    toastItem.style.visibility = "visible";
    setTimeout(() => {
      toastItem.className = `animated fast ${animateOut}`;
    }, 2000);
  }

  public static show(text?: string, options?: IToastOptions): void {
    // TODO: toast directly in the DOM
    const toastElementContainer = this.createToast(text, options);
  }

}
