import { networkStatusType } from "../../../redux/actions";

// Same props shared between components
export interface IPropsGlobal {
  readonly history?: any;
  readonly location?: any;
  readonly networkStatus?: networkStatusType;
}
