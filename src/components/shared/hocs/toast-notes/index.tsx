
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
  [key: string]: any;
}

type BoxWidth = number | string | null;
type BoxHeight = BoxWidth;
type CloseDelay = string | number | boolean;

export class Toaster {

  public static containerId: string = "itemToastId";
  public static animateIn: string = "fadeInDown";
  public static animateOut: string = "fadeOutUp";
  public static horizontal: string | number = "center";
  public static vertical: string | number = "top";
  public static width: BoxWidth = null;
  public static height: BoxHeight = null;
  public static delay: CloseDelay = 1500;
  public static hideOnClick: boolean = true;

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
  public static setPosition(toastItem: HTMLDivElement): HTMLDivElement {

    const {width, height} = this.getViewport();
    // Horizontal position
    // case height overload from options -> force align center
    if (toastItem.scrollWidth > width) {
      this.horizontal = "center";
      toastItem.style.width = "auto";
      toastItem.style.left = toastItem.style.marginLeft;
      toastItem.style.right = toastItem.style.left;
    } else {
      if (typeof this.horizontal === "string") {
        if (this.horizontal.toLowerCase() === "center") {
          //toastItem.style.left = toastItem.style.marginLeft;
          toastItem.style.left = `${(width / 2) - (toastItem.offsetWidth as number / 2)}px`;
          // equal left right margins if custom options width is higher
          //toastItem.style.right = toastItem.style.left;
          //toastItem.style.width = "auto";
        }
        if (this.horizontal.toLowerCase() === "left") {
          toastItem.style.left = "0";
          if (toastItem.style.marginLeft) {
            toastItem.style.left = toastItem.style.marginLeft;
          }
        }
        if (this.horizontal.toLowerCase() === "right") {
          toastItem.style.right = "0";
          if (toastItem.style.marginRight) {
            toastItem.style.right = toastItem.style.marginRight;
          }
        }
      }
    }
    // TODO: width in case of pure XY coords
    if (typeof this.horizontal === "number") {}


    // Vertical position
    if (toastItem.scrollHeight > height) {
      this.vertical = "center";
      toastItem.style.height = "auto";
    }
    if (typeof this.vertical === "string") {
      if (this.vertical.toLowerCase() === "center") {
        toastItem.style.marginTop = "0";
        toastItem.style.marginBottom = "0";
        toastItem.style.top = `${(height / 2) - (toastItem.scrollHeight / 2)}px`;
        toastItem.style.bottom = toastItem.style.top;
      }
      if (this.vertical.toLowerCase() === "top") {
        toastItem.style.top = "0";
        if (toastItem.style.marginTop) {
          toastItem.style.top = toastItem.style.marginTop;
        }
      }
      if (this.vertical.toLowerCase() === "bottom") {
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

    let toastItem: HTMLDivElement;

    const getDelay = () => {
      return this.delay as number;
    }

    // Listeners
    // Fade on end
    const animationShowEnd = (ev: AnimationEvent) => {
      setTimeout(() => {
        this.hide(toastItem);
        toastItem.removeEventListener("animationend", animationShowEnd);
        toastItem.addEventListener("animationend", animationHideEnd);
      }, getDelay());
    };
    // Animation fade out end - remove element from DOM
    const animationHideEnd = (ev: AnimationEvent) => {
      toastItem.remove();
      toastItem.removeEventListener("animationend", animationHideEnd);
      window.removeEventListener('resize', onWindowResize);
    };
    // Hide on modal body click
    const hideOnClickListener = (ev: MouseEvent) => {
      this.hide(toastItem);
      toastItem.removeEventListener("animationend", animationShowEnd);
      toastItem.addEventListener("animationend", animationHideEnd);
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
    // TODO: not working
    const onWindowResize = (ev: Event) => {
      console.log(this.getViewport());
      this.setPosition(toastItem);
    }

    window.addEventListener("resize", onWindowResize);

    // Merge custom options with element style
    let styles = "";
    if (options) {
      // Style object to CSS string

      for (let key in options) {
        styles += `${key}: ${options[key]};`;
      }
      if (options.hasOwnProperty("horizontal")) {
        this.horizontal = options.horizontal;
      }
      if (options.hasOwnProperty("vertical")) {
        this.vertical = options.vertical;
      }
      if (options.hasOwnProperty("delay")) {
        this.delay = options.delay;
      }
      if (options.hasOwnProperty("hideOnClick")) {
        this.hideOnClick = options.hideOnClick;
      }
      if (options.hasOwnProperty("width")) {
        this.width = options.width as BoxWidth;
      }
      if (options.hasOwnProperty("height")) {
        this.height = options.height;
      }
      if (options.hasOwnProperty("animateIn")) {
        this.animateIn = options.animateIn as string;
      }
      if (options.hasOwnProperty("animateOut")) {
        this.animateOut = options.animateOut as string;
      }
    }

    // Hide on modal body click
    if (this.hideOnClick) {
      toastItem.addEventListener("click", hideOnClickListener);
    }

    // Auto close delay
    if (this.delay) {
      toastItem.addEventListener("animationend", animationShowEnd);
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
      ${styles !== undefined ? styles : ""}
    `;
    console.log("STYLE:", styleSet);
    toastItem.setAttribute("style", styleSet);

    if (text) {
      toastItem.innerHTML = `<div>${text}</div>`;
    }
    document.body.appendChild(toastItem);

    // Calculate position after element rendered
    this.setPosition(toastItem);

    toastItem.classList.add("animated", "fast", this.animateIn);
    toastItem.style.visibility = "visible";
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
