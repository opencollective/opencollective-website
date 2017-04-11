import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import Notification from '../containers/Notification';
import LoginTopBar from '../containers/LoginTopBar';

import PublicFooter from '../components/PublicFooter';


export class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Login'>
        <LoginTopBar />
        This is an event page:
        <div onClick={this.onClick.bind(this)}>Click me</div>
        {false && this.props.data.addEvent && this.props.data.addEvent.map(event => (
          <div>
            <div> {event.name} </div>
            <div> {event.description} </div>
          </div>
        ))}
        <PublicFooter/>
      </div>
    );
  }

  componentWillMount() {
  }
  onClick() {
    this.props.mutate({ 
      variables: { 
        //event: {
          name:"mac event", 
          description:"awesome friday event", 
          groupSlug:"oc-stripe",
          startsAt: new Date()
        //}
      } 
    })
      .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });      
  }
}

const getEventQuery = gql`
  query getEvent($eventSlug:String, $groupSlug:String) {
        getEvent(slug: $eventSlug, groupSlug:$groupSlug) {
          id,
          name,
          description,
          slug,
          group {
            name,
            mission,
            slug,
            backgroundImage,
            logo
          }
          tiers {
            id,
            name,
            description,
            startsAt,
            endsAt,
            amount,
            currency,
            password,
            quantity,
          }
          responses {
            id
            status
            quantity
            user {
              id
              email
            }
          }
        }
      }`;

const createEventQuery = gql`
  mutation addEvent($event:EventInputType!) {
    addOrUpdateEvent(event: $event) {
          event {
            id,
            name,
            description,
            slug,
            group {
              id,
              name,
              slug
            } 
          }
        }
      }
  `
  
export default graphql(createEventQuery, { 
  /*options: props => ({
    variables: { 
      //groupSlug: props.params.slug, 
      //eventSlug: props.params.eventslug 
      name:"mac event", 
      description:"awesome friday event", 
      groupSlug:"opencollective",
      startsAt:"2016-12-12T12:00:00.000Z"
    }
  })*/
})(Event);