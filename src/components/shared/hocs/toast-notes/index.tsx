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
    const {height, width} = this.getViewportHeightWidth();
    const div = document.createElement("div");
    div.id = `toast-container-${new Date().getTime()}`;
    div.setAttribute("style",
      `position: fixed;
      bottom: 0;
      left: 0;
      width: ${width}px;
      height: ${height}px;
      background: rgba(38, 12, 12, 0.22)`);
    document.body.appendChild(div);
    return div;
  }

  public static createToast(text?: string, options?: IToastOptions) {

    // defaults
    let duration = 3000, speed = "fast";
    let animateOut = "fadeOutUp", animateIn = "fadeInDown";
    let verticalPosition = "bottom", horizontalPosition = "center";

    const toastElementContainer = document.createElement("div");
    const toastFlex = document.createElement("div");
    const toastItem = document.createElement("div");

    if (options) {
      if (options.hasOwnProperty("position")) {
        switch(options.position) {
          case "left-bottom" || "bottom-left":
            verticalPosition = "bottom";
            horizontalPosition = "left";
            animateIn = "fadeInDown";
            animateOut = "fadeInUp";
            break;
          case "left-top" || "top-left":
            verticalPosition = "top";
            horizontalPosition = "left";
            animateOut = "fadeInDown";
            animateIn = "fadeInUp";
            break;
          case "center-top" || "top-center":
            verticalPosition = "top";
            horizontalPosition = "center";
            animateIn = "fadeInDown";
            animateOut = "fadeInUp";
            break;
          case "center-bottom" || "bottom-center":
            verticalPosition = "bottom";
            horizontalPosition = "center";
            animateIn = "fadeInDown";
            animateOut = "fadeInUp";
            break;
          case "right-bottom" || "bottom-right":
            verticalPosition = "bottom";
            horizontalPosition = "right";
            animateIn = "fadeInDown";
            animateOut = "fadeInUp";
            break;
          case "right-top" || "top-right":
            verticalPosition = "top";
            horizontalPosition = "right";
            animateIn = "fadeInDown";
            animateOut = "fadeInUp";
            break;
        }
      }
    }
    toastElementContainer.setAttribute("style", `
      position: fixed;
      ${verticalPosition === "top" ? "top: 0" : "bottom: 0"};
      text-align: "${horizontalPosition}";
      width: 100%;
    `);
    toastElementContainer.className = `animated ${speed} ${animateIn}`;
    toastFlex.setAttribute("style", `
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
    `);
    toastItem.setAttribute("style", `
      max-width: 300px;
      padding: 20px;
      text-align: center;
      background: #333;
      color: #fefefe;
      font-size: 16px;
      margin: 20px;
      border-radius: 3px 3px 3px 3px;
      -moz-border-radius: 3px 3px 3px 3px;
      -webkit-border-radius: 3px 3px 3px 3px;
    `);
    if (text) {
      toastItem.innerHTML = `<div>${text}</div>`;
    }
    toastElementContainer.appendChild(
        toastFlex.appendChild(toastItem)
      );
    setTimeout(() => {
      toastElementContainer.className = `animated ${speed} ${animateOut}`;
    }, duration);
    return toastElementContainer;
  }

  public static show(text?: string, options?: IToastOptions): void {
    // TODO: toast directly in the DOM
    const container: HTMLElement = this.createContainer();
    const toastElementContainer: HTMLElement = this.createToast(text, options);
    container.appendChild(toastElementContainer);
    document.body.appendChild(container);
  }

}
