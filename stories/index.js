// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';

import './stories.css';

import richText from './rich-text';

storiesOf('LightRender', module)
    .addDecorator(story => (
        <div className="story">
            <div className="story-inner">{story()}</div>
        </div>
    ))
    .add('Rich text', richText);
