import React, { PropTypes } from 'react';

import CollectiveCard from '../components/CollectiveCard';

const RelatedGroups = ({
	groupList,
	title,
	i18n
}) => {
	if (groupList.length === 0) {
		return (<div/>);
	}
	return (
		<div className='container'>
		<div className='RelatedGroups'>
			<h2 className='RelatedGroups-title center m0 -ff-sec -fw-bold'>
				{title}
			</h2>
            {groupList.map(group => <CollectiveCard
              key={group.id}
              bg={group.backgroundImage}
              logo={group.logo}
              name={group.name}
              description={group.mission || group.description}
              url={group.publicUrl}
              yearlyIncome={group.yearlyIncome}
              contributors={group.contributors}
              backers={group.backers}
              members={group.members}
              i18n={i18n}
            />)}
		</div>
		</div>
	);
};

RelatedGroups.propTypes = {
	groupList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
	title: PropTypes.string
};

RelatedGroups.defaultProps = {
	groupList: [],
	title: ''
}

export default RelatedGroups;