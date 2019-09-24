import { networkStatusType } from "../../../redux/actions";

// TODO: .d.ts ?
// Same props shared between components
export interface IPropsGlobal {
  readonly history?: any;
  readonly location?: any;
  readonly networkStatus?: networkStatusType;
}

export interface IWindow extends Window {
  recaptchaVerifier: any;
  recaptchaWidgetId: any;
}
