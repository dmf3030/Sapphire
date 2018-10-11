import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import DonateModal from './partials/DonateModal';

class Donations extends Component {
  constructor(props) {
    super(props);
    this.animateCircle = this.animateCircle.bind(this);

    this.state = {
      selectedGoal: null,
      modalToggle: null
    };
  }

  componentDidMount() {
    for (const obj in this.props.donationGoals) {
      const canvas = this.refs[`donation-${this.props.donationGoals[obj].name}`];
      const ctx = canvas.getContext('2d');
      this.animateCircle(ctx, 0, canvas.getAttribute('data-progress'));
    }
  }

  handleClick (val) {
    this.setState({
      selectedGoal: val
    });
    this.modal.getWrappedInstance().toggle();
  }

  animateCircle(context, currentPct, endPct) {
    const elDims = 200;
    const centerPoint = elDims / 2;
    const radius = centerPoint - 5;
    const fullCircle = Math.PI * 2;
    const quarterCircle = fullCircle / 4;

    context.clearRect(0, 0, elDims, elDims);
    context.lineWidth = 5;

    context.strokeStyle = '#E7E7E7';
    context.beginPath();
    context.arc(centerPoint, centerPoint, radius, 0, fullCircle, false);
    context.stroke();

    context.strokeStyle = '#DB8F27';
    context.beginPath();
    context.arc(centerPoint, centerPoint, radius, -quarterCircle, (fullCircle * currentPct) - quarterCircle, false);
    context.stroke();

    if ((currentPct += 0.01) < endPct) {
      requestAnimationFrame(() => {
        this.animateCircle(context, currentPct, endPct);
      });
    }
  }

  // the key element is required, otherwise we get a weird behavior (caused by react optimizations) switching between panels that have toggles, feel free to remove the key element and give it a go
  render() {
    return (
      <div>
        <p id="walletBackup">{ this.props.lang.donate }</p>
        <div className="row col-md-12" style={{ overflowY: 'scroll' }}>
          {this.props.donationGoals.map((goal, index) => {
            return (
              <div key={index} style={{ borderRadius: '4px', boxShadow: '0px 0px 20px -5px white', margin: '10px', padding: '10px' }} className="community-goal col-md-5">
                <div className="goal-to-go">
                  {goal.completedAt != null ? 'Completed' : null}
                  {goal.daysRemaining != null ? `Days Remaining ${goal.daysRemaining}` : null }
                </div>
                <p className="text-center">{goal.name}</p>
                <hr />
                <div className="goal-details-container" style={{ textAlign: 'center' }}>
                  <div className="goal-progress">
                    <canvas ref={`donation-${goal.name}`} className="goal-progress-circle" height="200" width="200" data-progress={goal.currentBTCTotal / goal.goalBTCTotal} />
                    <div className="goal-desc" style={{ marginTop: '-130px', marginBottom: '100px' }}>
                      <div className="goal-current-btc-total"><span className="fa fa-btc" style={{ marginRight: '5px' }} />{ goal.currentBTCTotal }</div>
                      <div className="goal-of">of</div>
                      <div className="goal-goal-btc-total"><span className="fa fa-btc" style={{ marginRight: '5px' }} />{ goal.goalBTCTotal }</div>
                    </div>
                  </div>
                  {goal.currentBTCTotal >= goal.goalBTCTotal ? <span className="buttonPrimary caps disabled"><img src="/img/ecc_logo_white.svg" />Thanks</span> :
                  <div className="buttonPrimary caps" onClick={this.handleClick.bind(this, goal)} data-toggle="modal" data-target={`#goal-${goal.id}-detail`}>
                    <span className="fa fa-gift" /> Donate</div>}
                </div>
              </div>
            );
          })
        }
        </div>
        <ReactTooltip />
        <DonateModal ref={(e) => {this.modal = e}} goal={this.state.selectedGoal} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.startup.lang,
    donationGoals: state.application.donationGoals,
    donationGoalsLastUpdated: state.application.donationGoalsLastUpdated
  };
};

export default connect(mapStateToProps, actions)(Donations);
