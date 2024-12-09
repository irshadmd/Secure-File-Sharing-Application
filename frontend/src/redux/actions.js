import { bindActionCreators } from 'redux';
import * as authentication from '../containers/authentication/actions';

export default function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        ...authentication,
      },
      dispatch
    );
  }
  