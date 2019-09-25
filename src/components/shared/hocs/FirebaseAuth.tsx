import React from "react";
import "firebase/auth";
import firebase from "firebase/app";

/**
 * Extend Window interface for recaptcha
 */
export interface IWindow extends Window {
  recaptchaVerifier: any;
  recaptchaWidgetId: any;
}

export interface IErrorArgs {
  message: string | null;
}

export interface ICaptchaHooks {
  captchaIsVerified?(): void;
  expiredCallback?(): void;
  captchaRendered?(): void;
  captchaError?(e: string): void;
  afterLogOut?(): void;
  onError?(error: IErrorArgs): void;
}

/**
 * Firebase auth provider
 * @param WrappedComponent Input component to wrap with
 */
export function withFirebaseAuth(WrappedComponent: any) {
  return class extends React.Component  {
    constructor(props: any) {
      super(props);
      this.firebaseRecaptchaRender = this.firebaseRecaptchaRender.bind(this);
      this.firebaseLogOut = this.firebaseLogOut.bind(this);
    }

    /**
     * Recaptchav2 render
     * @param elementId Captcha container element id (<div id="">)
     * @param callbacks Callbacks captcha init, render stages
     */
    public firebaseRecaptchaRender(elementId: string, hooks: ICaptchaHooks = {}) {
      try {
        (window as unknown as IWindow).recaptchaVerifier =
          new firebase.auth.RecaptchaVerifier(
            elementId,
            {
              "callback": hooks.hasOwnProperty("captchaIsVerified") && hooks.captchaIsVerified,
              "expired-callback": hooks.hasOwnProperty("expiredCallback") && hooks.expiredCallback,
              "size": "big",
            },
          );
        (window as unknown as IWindow).recaptchaVerifier
        .render()
        .then((widgetId: any) => {
          if (hooks.captchaRendered) {
            hooks.captchaRendered();
          }
          (window as unknown as IWindow).recaptchaWidgetId = widgetId;
        });
        /*
        if (this.context.firebaseUser) {
          push("/profile");
        }
        */
      } catch (e) {
        // reCaptcha may not render on enzyme mount test or smth else
        if (hooks.captchaError) {
          hooks.captchaError(e);
        }
      }
    }

    /**
     * Log user out
     * @param afterLogOut Callback after firebase user logged out
     * @param onError Error callback
     */
    public firebaseLogOut(
      afterLogOut: ICaptchaHooks["afterLogOut"],
      onError: ICaptchaHooks["onError"],
    ): void {
      firebase.auth().signOut().then(() => {
        if (afterLogOut) {
          afterLogOut();
        }
      }).catch((error) => {
        if (onError) {
          onError(error);
        }
      });
    }

    public render() {
      return <WrappedComponent
        firebaseRecaptchaRender={this.firebaseRecaptchaRender}
        firebaseLogOut={this.firebaseLogOut}
        {...this.props} />;
    }
  };
}