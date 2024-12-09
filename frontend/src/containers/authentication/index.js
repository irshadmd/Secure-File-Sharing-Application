
import React from 'react';

import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import actions from '../../redux/actions';

class Authentication extends React.PureComponent {
  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      return <Navigate to='/login' />;
    } else {
      return <>testing{this.props}</>;
    }
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(Authentication);

