import React from "react";
import "firebase/auth";
import firebase from "firebase/app";

/**
 * Extend Window interface for ReCaptchav2 DOM
 */
export interface IWindow extends Window {
  recaptchaVerifier: any;
  recaptchaWidgetId: any;
}

export interface IErrorArgs {
  message: string | null;
}

/**
 * Hooks interaces
 */
export interface ICaptchaHooks {
  captchaIsVerified?(): void;
  expiredCallback?(): void;
  captchaRendered?(): void;
  captchaError?(e: string): void;
  afterLogOut?(): void;
  onError?(error: IErrorArgs): void;
}
export interface ICreateUserHooks {
  onError?(error: string): void;
  afterCreate?(): void;
}
export interface IEmailVerifyHooks {
  afterSend?(): void;
  onError?(e: string): void;
}
export interface ISignOutHooks {
  afterSignOut?(): void;
  onError?(e: string): void;
}
export interface IDeleteAccountHooks {
  onUserDeleted?(): void;
  onError?(e: string): void;
}

/**
 * Define some actions after user is created
 */
interface ICreateUserOptions {
  stayLoggedAfterCreate: boolean;
  sendVerifyLinkToEmail: boolean;
}

/**
 * Firebase wrapper interface
 */
export interface IFirebaseAuth {
  signOut(onSuccess: (() => void) | {}, onError: (e: string) => void): void;
  sendEmailVerification(hooks: IEmailVerifyHooks): void;
  firebaseLogOut(afterLogOut: ICaptchaHooks["afterLogOut"], onError: ICaptchaHooks["onError"]): void;
  firebaseDeleteAccount(onUserDeleted: () => void, onError: (e: string) => void): void;
  firebaseRecaptchaRender(...args: any): any;
  createUserWithEmailAndPassword(email: string, password: string, opts: object, hooks: object): void;
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
      this.sendEmailVerification = this.sendEmailVerification.bind(this);
      this.signOut = this.signOut.bind(this);
      this.firebaseDeleteAccount = this.firebaseDeleteAccount.bind(this);
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

    /**
     * Create firebase user (email and password required)
     * Default scenario: create, send verify link, log out
     * @param email User email
     * @param password Password
     * @param hooks Callbacks
     */
    public createUserWithEmailAndPassword(
      email: string,
      password: string,
      options: ICreateUserOptions = {
        sendVerifyLinkToEmail: true,
        stayLoggedAfterCreate: false,
      },
      hooks: ICreateUserHooks = {}) {
        firebase.auth().createUserWithEmailAndPassword(
          email as string,
          password as string,
        ).then(() => {
          if (options.sendVerifyLinkToEmail) {
            // Email virification link
            this.sendEmailVerification({
              onError: (e: string) => {
                if (hooks.onError) {
                  hooks.onError(e);
                }
              },
            });
          }
          if (!options.stayLoggedAfterCreate) {
            // Sign out
            this.signOut({},
              (error: string) => {
                if (hooks.onError) {
                  hooks.onError(error);
                }
              },
            );
          }
          if (hooks.afterCreate) {
            hooks.afterCreate();
          }
        }).catch((error) => {
          if (hooks.onError) {
            hooks.onError(error);
          }
        });
    }

    public sendEmailVerification(hooks: IEmailVerifyHooks = {}) {
      const currentUser = firebase.auth().currentUser;
      const url = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : "")}`;
      if (currentUser) {
        currentUser.sendEmailVerification({
          url,
        }).then(() => {
          if (hooks.afterSend) {
            hooks.afterSend();
          }
        }).catch((error) => {
          if (hooks.onError) {
            hooks.onError(error.message);
          }
        });
      }
    }

    /**
     * End user session
     * @param hooks Sign out callbacks
     */
    public signOut(onSuccess: (() => void) | {}, onError: (e: string) => void) {
      firebase.auth().signOut().then(() => {
        if (typeof onSuccess === "function") {
          onSuccess();
        }
      }).catch((error) => {
        if (onError) {
          onError(error.message);
        }
      });
    }

    public firebaseDeleteAccount(onUserDeleted: any, onError: any) {
      const user = firebase.auth().currentUser;
      if (user) {
        user.delete().then(() => {
          if (onUserDeleted) {
            onUserDeleted();
          }
        }).catch((error) => {
          if (onError) {
            onError(error.message);
          }
        });
      }
    }

    public render() {
      return <WrappedComponent
        firebaseRecaptchaRender={this.firebaseRecaptchaRender}
        firebaseLogOut={this.firebaseLogOut}
        createUserWithEmailAndPassword={this.createUserWithEmailAndPassword}
        sendEmailVerification={this.sendEmailVerification}
        signOut={this.signOut}
        firebaseDeleteAccount={this.firebaseDeleteAccount}
        {...this.props} />;
    }
  };
}
