import React from "react";
import "./style.scss";


type Viewport = {
  height: number;
  width: number;
}
interface IToastOptions {
  text?: string;
  position?: "left-top" | "left-bottom" | "center-top" | "center-bottom" 
    | "right-top" | "right-bottom";
}
interface IToastComponent extends IToastOptions {
  getViewportHeightWidth(): Viewport;
  toast(text: string, options: IToastOptions): void;
}
interface IToastState {
  text: string;
}

/**
 * Toast notify HOC
 * @param Wrapper Wrapped react component
 */
export function withToaster(Wrapper: any) {
  return class extends React.Component<{}, IToastState> implements IToastComponent {

    constructor(props: any) {
      super(props);
      this.state = {
        text: "Testing ensurance quality of a product",
      };
      this.getViewportHeightWidth = this.getViewportHeightWidth.bind(this);
      this.toast = this.toast.bind(this);
      this.createContainer = this.createContainer.bind(this);
    }

    /**
     * Get window width and height
     */
    public getViewportHeightWidth(): Viewport {
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
    public createContainer(): HTMLElement {
      const {height, width} = this.getViewportHeightWidth();
      const div = document.createElement("div");
      div.id = `toast-container-${new Date().getTime()}`;
      div.setAttribute("style",
        `position: absolute;
        top: 0;
        left: 0;
        width: ${width}px;
        height: ${height}px;
        background: rgba(38, 12, 12, 0.22)`);
      document.body.appendChild(div);
      return div;
    }

    public createToast(text?: string, options?: IToastOptions) {
      let verticalPosition = "bottom", horizontalPosition = "center";
      const toastElementContainer = document.createElement("div");
      const toastFlex = document.createElement("div");
      const toastItem = document.createElement("div");
      if (options) {
        if (options.hasOwnProperty("position")) {
          switch(options.position) {
            case "left-bottom":
              verticalPosition = "bottom";
              horizontalPosition = "left";
            case "left-top":
              verticalPosition = "top";
              horizontalPosition = "left";
            case "center-top":
              verticalPosition = "top";
              horizontalPosition = "center";
            case "center-bottom":
              verticalPosition = "bottom";
              horizontalPosition = "center";
            case "right-bottom":
              verticalPosition = "bottom";
              horizontalPosition = "right";
            case "right-top":
              verticalPosition = "top";
              horizontalPosition = "right";
          }
        }
      }
      toastElementContainer.setAttribute("style", `
        position: absolute;
        ${verticalPosition === "top" ? "top: 0" : "bottom: 0"};
        text-align: "${horizontalPosition}";
        width: 100%;
      `);
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
      return toastElementContainer;
    }

    public toast(text?: string, options?: IToastOptions): void {
      // TODO: toast directly in the DOM
      const container: HTMLElement = this.createContainer();
      const toastElement: HTMLElement = this.createToast(text, options);
      container.appendChild(toastElement);
      document.body.appendChild(container);
    }

    public render() {
      const {children} = this.props;
      return <>
        <Wrapper {...this.props} toast={this.toast}>{children}</Wrapper>
      </>;
    }
  }
}
