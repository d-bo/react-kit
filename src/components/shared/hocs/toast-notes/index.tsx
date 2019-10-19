
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
  animateIn?: string;
  animateOut?: string;
  [key: string]: string | number | undefined;
}

export class Toaster {

  public static containerId: string = "itemToastId";
  public static animateIn: string = "fadeInDown";
  public static animateOut: string = "fadeOutUp";
  public static x: string | number = "center";
  public static y: string | number = "top";
  public static width: number;
  public static height: number;

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

  /**
   * Set element position
   * @param toastItem HTML element
   * @param options Custom options
   */
  public static setPosition(toastItem: HTMLDivElement, options?: IToastOptions): HTMLDivElement {

    if (options && options.x) {
      this.x = options.x;
    }
    if (typeof this.x === "string") {
      if (this.x.toLowerCase() === "center") {
        const {width} = this.getViewportHeightWidth();
        toastItem.style.left = `${(width / 2) - (toastItem.scrollWidth / 2)}px`;
      }
      if (this.x.toLowerCase() === "left") {
        toastItem.style.left = "0";
      }
      if (this.x.toLowerCase() === "right") {
        toastItem.style.right = "0";
      }
    }

    if (options && options.y) {
      this.y = options.y;
    }
    if (typeof this.y === "string") {
      if (this.y.toLowerCase() === "center") {
        const {height} = this.getViewportHeightWidth();
        toastItem.style.top = `${(height / 2) - (toastItem.scrollHeight / 2)}px`;
      }
      if (this.y.toLowerCase() === "top") {
        toastItem.style.top = "0";
      }
      if (this.y.toLowerCase() === "bottom") {
        toastItem.style.bottom = "0";
      }
    }

    return toastItem;
  }

  /**
   * Show toast container
   * @param text Text string
   * @param options Custom options
   */
  public static show(text?: string, options?: IToastOptions) {

    let styles;

    // Do not spawn node if it is allready exist
    const node = document.getElementById(this.containerId);
    if (node && node.style.visibility === "visible") {
      console.log(node.style.visibility);
      return;
    }

    // Create container with default style
    const toastItem = document.createElement("div");
    toastItem.id = this.containerId;

    // Merge custom options with element style
    if (options) {
      styles = JSON.stringify(options);
      styles = styles.replace(/"/g, "");
      styles = styles.replace(/'/g, "");
      styles = styles.replace(/,/g, ";");
      styles = styles.replace("{", "");
      styles = styles.replace("}", "");
    }
    const styleSet = `
      position: absolute;
      padding: 15px;
      background: #333;
      color: #fefefe;
      font-size: 15px;
      cursor: pointer;
      border-radius: 3px 3px 3px 3px;
      -moz-border-radius: 3px 3px 3px 3px;
      -webkit-border-radius: 3px 3px 3px 3px;
      visibility: hidden;
      word-break: break-word;
      margin: 15px;
      ${styles !== undefined ? styles : ""}
    `;

    toastItem.setAttribute("style", styleSet);

    if (text) {
      toastItem.innerHTML = `<div>${text}</div>`;
    }
    document.body.appendChild(toastItem);

    // Calculate position after element rendered
    this.setPosition(toastItem);

    toastItem.classList.add("animated", "fast", this.animateIn);
    toastItem.style.visibility = "visible";

    const animationShowEnd = (ev: AnimationEvent) => {
      setTimeout(() => {
        this.hide(toastItem);
        toastItem.removeEventListener("animationend", animationShowEnd);
        toastItem.addEventListener("animationend", animationHideEnd);
      }, 2000);
    };
    const animationHideEnd = (ev: AnimationEvent) => {
      toastItem.remove();
      toastItem.removeEventListener("animationend", animationHideEnd);
    };
    // Remove on click
    toastItem.onclick = (ev: MouseEvent) => {
      this.hide(toastItem);
      toastItem.removeEventListener("animationend", animationShowEnd);
      toastItem.addEventListener("animationend", animationHideEnd);
    };
    toastItem.addEventListener("animationend", animationShowEnd);
  }

  /**
   * Animate out
   * @param element HTML container element
   */
  public static hide(element: HTMLDivElement) {
    element.classList.remove(this.animateIn);
    element.classList.add("animated", "fast", this.animateOut);
  }

}
