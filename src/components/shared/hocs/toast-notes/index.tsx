
type Viewport = {
  height: number;
  width: number;
}

interface IToastOptions {
  text?: string;
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
  public static x: string | number = "right";
  public static y: string | number = "top";
  public static width: number;
  public static height: number;

  /**
   * Get window width and height
   */
  public static getViewport(): Viewport {
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
    const {width, height} = this.getViewport();
    // Horizontal position
    console.log("H:", toastItem.scrollWidth, width);
    if (toastItem.scrollWidth > width) {
      this.x = "center";
      toastItem.style.width = "auto";
    }
    if (typeof this.x === "string") {
      if (this.x.toLowerCase() === "center") {
        // Reset margins
        toastItem.style.marginLeft = "0";
        toastItem.style.marginRight = "0";
        toastItem.style.left = `${(width / 2) - (toastItem.scrollWidth / 2)}px`;
        toastItem.style.right = toastItem.style.left;  // kind of responsive
      }
      if (this.x.toLowerCase() === "left") {
        toastItem.style.left = "0";
        if (toastItem.style.marginLeft) {
          toastItem.style.left = toastItem.style.marginLeft;
        }
      }
      if (this.x.toLowerCase() === "right") {
        toastItem.style.right = "0";
        if (toastItem.style.marginRight) {
          toastItem.style.right = toastItem.style.marginRight;
        }
      }
    }

    // Vertical position
    if (options && options.y) {
      this.y = options.y;
    }
    if (toastItem.scrollHeight > height) {
      this.y = "center";
      toastItem.style.height = "auto";
    }
    if (typeof this.y === "string") {
      if (this.y.toLowerCase() === "center") {
        toastItem.style.marginTop = "0";
        toastItem.style.marginBottom = "0";
        toastItem.style.top = `${(height / 2) - (toastItem.scrollHeight / 2)}px`;
        toastItem.style.bottom = toastItem.style.top;
      }
      if (this.y.toLowerCase() === "top") {
        toastItem.style.top = "0";
        if (toastItem.style.marginTop) {
          toastItem.style.top = toastItem.style.marginTop;
        }
      }
      if (this.y.toLowerCase() === "bottom") {
        toastItem.style.bottom = "0";
        if (toastItem.style.marginBottom) {
          toastItem.style.bottom = toastItem.style.marginBottom;
        }
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

    let styles, toastItem: HTMLDivElement;

    // Listeners
    // Fade in end
    const animationShowEnd = (ev: AnimationEvent) => {
      setTimeout(() => {
        this.hide(toastItem);
        toastItem.removeEventListener("animationend", animationShowEnd);
        toastItem.addEventListener("animationend", animationHideEnd);
      }, 2000);
    };
    // Animation fade out end - remove element from DOM
    const animationHideEnd = (ev: AnimationEvent) => {
      toastItem.remove();
      toastItem.removeEventListener("animationend", animationHideEnd);
      window.removeEventListener('resize', onWindowResize);
    };

    // Do not spawn node if it is allready exist
    // Just close it
    toastItem = document.getElementById(this.containerId) as HTMLDivElement;
    if (toastItem) {
      this.hide(toastItem as HTMLDivElement);
      toastItem.removeEventListener("animationend", animationShowEnd);
      toastItem.addEventListener("animationend", animationHideEnd);
      return;
    }

    // Create container with default style
    toastItem = document.createElement("div");
    toastItem.id = this.containerId;

    // Resize box on window resize
    const onWindowResize = (ev: Event) => {
      console.log(this.getViewport());
      this.setPosition(toastItem);
    }

    window.addEventListener('resize', onWindowResize);

    // Remove on click
    toastItem.onclick = (ev: MouseEvent) => {
      this.hide(toastItem);
      toastItem.removeEventListener("animationend", animationShowEnd);
      toastItem.addEventListener("animationend", animationHideEnd);
    };

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
      background: rgba(0,0,0, 0.9);
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
