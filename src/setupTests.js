import "jest-enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import firebase_config from "./config/firebase.config";
import firebase from "firebase/app";

// Init firebase account
firebase.initializeApp(firebase_config);

configure({ adapter: new Adapter() });
const noop = () => {};
Object.defineProperty(window, "scrollTo", { value: noop, writable: true });
