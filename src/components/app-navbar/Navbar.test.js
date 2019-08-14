/* eslint-disable */
import React from "react";
import {shallow} from "enzyme";
import Navbar from "./index";
import { FirebaseUserContext } from "../../contexts/FirebaseUserContext";

function Fixture() {
  return (
    <div>
      <input id="disabled" disabled />
      <input id="not"/>
    </div>
  );
}

describe("Navbar", () => {
  it("Fixture is OK", () => {
    const wrapper = shallow(<Fixture />);
    expect(wrapper.find('#disabled')).toBeDisabled();
    expect(wrapper.find('#not')).not.toBeDisabled();
  });
  it("Navbar is rendering", () => {
    const wrapper = shallow(<FirebaseUserContext.Provider value={{
      contextSetFirebaseUser: () => null,
      firebaseUser: null,
    }}><Navbar /></FirebaseUserContext.Provider>);
    expect(wrapper.dive()).toExist();
  });
});
