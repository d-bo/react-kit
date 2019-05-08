import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '.';
import renderer from 'react-test-renderer';
import store from '../../redux/store';
import { Provider } from 'react-redux';
import * as firebase from 'firebase/app';

test('Navbar renders without crashing', () => {
	const component = renderer.create(<Provider store={store}><Navbar /></Provider>);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});