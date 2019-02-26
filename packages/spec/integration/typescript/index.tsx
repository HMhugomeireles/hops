import { render, importComponent } from 'hops';
import { HopsGraphqlOptions } from 'hops-graphql';
import { HopsReduxOptions } from 'hops-redux';
import { HopsStyledComponentsOptions } from 'hops-styled-components';
import * as React from 'react';

import Headline from './headline';

const Content = importComponent('./content');

type Options = HopsGraphqlOptions &
  HopsReduxOptions &
  HopsStyledComponentsOptions;

export default render<Options>(
  <>
    <Headline />
    <Content />
  </>,
  {
    graphql: {
      ssrMode: true,
    },
    redux: {
      reducers: {},
    },
    router: {
      basename: 'a',
    },
    styled: {
      theme: {},
    },
  }
);
