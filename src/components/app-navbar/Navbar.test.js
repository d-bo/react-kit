import React from "react";
import {shallow, mount, render} from "enzyme";
import Navbar from "./index";
import { store } from "../../redux/stores/store";
import { Provider } from "react-redux";

describe("Navbar", () => {
  it("Navbar img logo should render", () => {
    //const component = shallow(<Navbar />);
    //expect(component).toMatchSnapshot();
    //const wrapper = shallow(<Provider store={store}><Navbar /></Provider>);
    // eslint-disable-next-line no-undef
    //expect(wrapper).toContainMatchingElement(".img-navbar");
    const wrapper = shallow(<Navbar profileImgUrl={null} />);
    expect(wrapper.prop("profileImgUrl")).toEqual(null);
  });
});
