import React, { Component } from 'react';
import { connect } from 'react-redux';

import OnBoardingHeader from '../components/on_boarding/OnBoardingHeader';
import UserPhoto from '../components/UserPhoto';
import PublicFooter from '../components/PublicFooter';

export class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
  	return (
  		<div className='ProfilePage'>
        <OnBoardingHeader />
        <UserPhoto user={{avatar:""}} addBadge={true} className="mx-auto" />
        <div>Hello I'm</div>
        <div>Scott Murphey</div>
        <div>
          Keeping one’s self going is a difficult thing to do. There are a million distractions that occur every day and that can mean that we do not stay on track with what we should be doing. Self-motivation is something that does not come easy to a lot of people and that means that there are some steps that need to be taken before you can become motivated to the fullest extent.
        </div>

        <section>I proudly belong to these collectives...</section>
        <section>And happily act as backer of these other collectives...</section>

        <PublicFooter />
  		</div>
  	)
  }
}

export default connect(mapStateToProps, {})(ProfilePage);

function mapStateToProps() {
  return {};
}
