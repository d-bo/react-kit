import React from 'react';


class DmCheckbox extends React.Component {
  
	constructor(props: any) {
		super(props);
	}

	render() {
		return(
			<>
				<input type="checkbox" className="dm-checkbox" />
			</>
		);
	}
}