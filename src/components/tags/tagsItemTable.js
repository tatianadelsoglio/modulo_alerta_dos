import React from 'react';
import { Fragment } from 'react';

const TagsItemTable = ({ color }) => {
	return (
		<Fragment>
			<div style={{ background: color }} className="tag"></div>
		</Fragment>
	);
};

export default TagsItemTable;
