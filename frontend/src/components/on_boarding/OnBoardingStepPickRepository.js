import React from 'react';

import OnBoardingStepHeading from './OnBoardingStepHeading';
import RepositoryPicker from './RepositoryPicker';

export default class OnBoardingStepPickRepository extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRepo: ''
    };
  }

  render() {
    const { onNextStep, repositories } = this.props;
    const { selectedRepo } = this.state;

    return (
      <div className="OnBoardingStepPickRepository">
        <OnBoardingStepHeading step="2/4" title="Pick a repository." subtitle="Select the project you wish to create an Open Collective for."/>
        <RepositoryPicker repositories={repositories} onSelect={(selectedRepo) => this.setState({selectedRepo: selectedRepo})} selectedRepo={selectedRepo} />
        <div style={{margin: '0 auto', marginTop: '30px', width: '300px', textAlign: 'center'}}>
          <div className={`OnBoardingButton ${selectedRepo ? '': 'disabled'}`} onClick={selectedRepo ? onNextStep(selectedRepo): null}>continue</div>
        </div>
      </div>
    )
  }
}
