
type Viewport = {
  height: number;
  width: number;
}

interface IToastOptions {
  text?: string;
  width?: string;
  background?: string;
  color?: string;
  animateIn?: string | boolean;
  animateOut?: string | boolean;
  animateSpeed: string | boolean;
  [key: string]: any;
}

type BoxWidth = number | string | null;
type BoxHeight = BoxWidth;
type CloseDelay = string | number | boolean;

export class Toaster {

  public static containerId: string = "itemToastId";
  public static animateIn: string | boolean = "fadeInDown";
  public static animateOut: string | boolean = "fadeOutUp";
  public static animateSpeed: string | boolean = "faster";
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

    let viewportwidth = document.documentElement.clientWidth
    || document.body.clientWidth;
    let viewportheight = document.documentElement.clientHeight
    || document.body.clientHeight;
    return {width: viewportwidth, height: viewportheight};
  }

  /**
   * Set element position
   * @param toastItem HTML element
   * @param options Custom options
   */
  public static setPosition(toastItem: HTMLDivElement): HTMLDivElement {

    const {width, height} = this.getViewport();
    const el = toastItem.getBoundingClientRect();
    // TODO: calculate Scroll top if position is absolute (no need if static)
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    let calculatedMarginsX, calculatedMarginsY;
    let elFullWidth = el.width;
    let elFullHeight = el.height;
    const computed = window.getComputedStyle(toastItem, null);

    // Calculate element full WIDTH + margins (may be relative in vw)
    if (computed.marginLeft || computed.marginRight) {
      calculatedMarginsX = (parseFloat(computed.marginLeft as any) + parseFloat(computed.marginRight as any));
      elFullWidth = el.width as any + (calculatedMarginsX * 2);
    }
    // Calculate element full HEIGHT + margins (may be relative in vw)
    if (computed.marginTop || computed.marginBottom) {
      calculatedMarginsY = (parseFloat(computed.marginTop as any) + parseFloat(computed.marginBottom as any));
      elFullHeight = el.height as any + (calculatedMarginsY * 2);
    }

    console.log("SUMMARY", elFullWidth, width, calculatedMarginsX, calculatedMarginsY);
    // Case: height overload from options -> force align center
    if (elFullWidth > width) {
      this.horizontal = "center";
      toastItem.style.width = "auto";
      toastItem.style.left = toastItem.style.marginLeft;
      toastItem.style.right = toastItem.style.left;
    } else {
      if (typeof this.horizontal === "string") {
        if (this.horizontal.toLowerCase() === "center") {
          toastItem.style.left = `${(width / 2) - ((elFullWidth) / 2)}px`;
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

    if (typeof this.vertical === "string") {
      if (this.vertical.toLowerCase() === "center") {
        toastItem.style.top = `${(height / 2) - ((elFullHeight) / 2)}px`;
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
      if (!this.animateOut) {
        toastItem.remove();
        return;
      }
      toastItem.addEventListener("animationend", animationHideEnd);
    };

    // Do not spawn node if it is allready exist
    // Just close it
    toastItem = document.getElementById(this.containerId) as HTMLDivElement;
    if (toastItem) {
      this.hide(toastItem as HTMLDivElement);
      toastItem.removeEventListener("animationend", animationShowEnd);
      if (!this.animateOut) {
        toastItem.remove();
        return;
      }
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
        this.animateIn = options.animateIn === true ? this.animateIn : options.animateIn as string;
      }
      if (options.hasOwnProperty("animateOut")) {
        this.animateOut = options.animateOut === true ? this.animateOut : options.animateOut as string;
      }
      if (options.hasOwnProperty("animateSpeed")) {
        this.animateSpeed = options.animateSpeed === true ? this.animateSpeed : options.animateSpeed as string;
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
      position: fixed;
      padding: 15px;
      background: rgba(0,0,0, 0.9);
      color: #fefefe;
      font-size: 15px;
      cursor: pointer;
      border-radius: 4px 4px 4px 4px;
      -moz-border-radius: 4px 4px 4px 4px;
      -webkit-border-radius: 4px 4px 4px 4px;
      visibility: hidden;
      word-break: break-word;
      ${styles !== undefined ? styles : ""}
    `;
    toastItem.setAttribute("style", styleSet);

    if (text) {
      toastItem.innerHTML = `<div>${text}</div>`;
    }
    document.body.appendChild(toastItem);

    // Calculate position after element rendered
    this.setPosition(toastItem);

    if (typeof this.animateIn === "string") {
      toastItem.classList.add("animated", this.animateSpeed as string, this.animateIn);
    }
    toastItem.style.visibility = "visible";
  }

  /**
   * Animate out
   * @param element HTML container element
   */
  public static hide(element: HTMLDivElement) {
    if (typeof this.animateIn === "string") {
      element.classList.remove(this.animateIn);
    }
    if (typeof this.animateOut === "string") {
      element.classList.add("animated", "fast", this.animateOut);
    }
  }

}
