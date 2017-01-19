import React, { PropTypes } from 'react';

import CollectiveCard from '../components/CollectiveCard';

const CollectiveList = ({
	groupList,
	title,
	style,
	i18n
}) => {
	if (groupList.length === 0) {
		return (<div/>);
	}

	if (groupList.length > 20 && !style)
		style = 'small';

	return (
		<div className='CollectiveList'>
			<h2 className='CollectiveList-title center m0 -ff-sec -fw-bold'>
				{title || i18n.getString('otherSimilarCollectives')}
			</h2>
			{groupList.map(group => <CollectiveCard
				key={group.id}
				i18n={i18n}
				group={group}
				style={style}
			/>)}
		</div>
	);
};

CollectiveList.propTypes = {
	groupList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
	title: PropTypes.string,
	style: PropTypes.string
};

CollectiveList.defaultProps = {
	groupList: [],
	title: ''
}

export default CollectiveList;