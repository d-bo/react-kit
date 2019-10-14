import React from "react";
import "./style.scss";


type Viewport = {
  height: number;
  width: number;
}
interface IToastOptions {
  text?: string;
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
    }

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

    public toast(text?: string, options?: IToastOptions): void {
      // TODO: toast directly in the DOM
      const {height, width} = this.getViewportHeightWidth();
    }

    public render() {
      const {children} = this.props;
      return <>
        <Wrapper {...this.props} toast={this.toast}>{children}</Wrapper>
      </>;
    }
  }
}
