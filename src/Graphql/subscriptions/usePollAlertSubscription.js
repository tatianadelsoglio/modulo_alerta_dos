/* eslint import/no-anonymous-default-export: [0, {"allowCallExpression": true}] */

import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";

export const POLL_ALERT_SUBSCRIPTION = gql`
  subscription pollAlertSubscription {
    pollAlertSubscription {
      message
    }
  }
`;

export default () => useSubscription(POLL_ALERT_SUBSCRIPTION);
