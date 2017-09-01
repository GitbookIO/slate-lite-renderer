import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Button', module)
    .addDecorator(story => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            {story()}
        </div>
    ))
    .add('with text', () => (
        <button onClick={action('clicked')}>Hi Button</button>
    ));
