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

/**
 * Firebase auth provider
 * @param WrappedComponent Input component to wrap with
 */
export function withFirebaseAuth(WrappedComponent: any) {
  return class extends React.Component {
    constructor(props: any) {
      super(props);
      this.firebaseRecaptchaRender = this.firebaseRecaptchaRender.bind(this);
    }

    /**
     * Recaptchav2 render
     * @param elementId Captcha container element id (<div id="">)
     * @param callbacks Callbacks on captcha init render stages
     */
    public firebaseRecaptchaRender(elementId: string, callbacks: any) {
      try {
        (window as unknown as IWindow).recaptchaVerifier =
          new firebase.auth.RecaptchaVerifier(
            elementId,
            {
              "callback": callbacks.captchaIsVerified,
              "expired-callback": callbacks.expiredCallback,
              "size": "big",
            },
          );
        (window as unknown as IWindow).recaptchaVerifier
        .render()
        .then((widgetId: any) => {
          callbacks.captchaRendered();
          (window as unknown as IWindow).recaptchaWidgetId = widgetId;
        });
        /*
        if (this.context.firebaseUser) {
          push("/profile");
        }
        */
      } catch (e) {
        // reCaptcha may not render on enzyme mount test or smth else
        callbacks.captchaError(e);
      }
    }

    public render() {
      return <WrappedComponent
        firebaseRecaptchaRender={this.firebaseRecaptchaRender} {...this.props} />;
    }
  };
}
