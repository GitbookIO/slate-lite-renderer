import React from 'react';
import Slate from 'slate';

import LightRender from '../../src';
import stateJson from './state.json';

function story() {
    const schema = {
        nodes: {
            'block-quote': props => (
                <blockquote {...props.attributes}>{props.children}</blockquote>
            ),
            'bulleted-list': props => (
                <ul {...props.attributes}>{props.children}</ul>
            ),
            'heading-one': props => (
                <h1 {...props.attributes}>{props.children}</h1>
            ),
            'heading-two': props => (
                <h2 {...props.attributes}>{props.children}</h2>
            ),
            'list-item': props => (
                <li {...props.attributes}>{props.children}</li>
            ),
            'numbered-list': props => (
                <ol {...props.attributes}>{props.children}</ol>
            )
        },
        marks: {
            bold: {
                fontWeight: 'bold'
            },
            code: {
                fontFamily: 'monospace',
                backgroundColor: '#eee',
                padding: '3px',
                borderRadius: '4px'
            },
            italic: {
                fontStyle: 'italic'
            },
            underlined: {
                textDecoration: 'underline'
            }
        }
    };

    const state = Slate.Raw.deserialize(stateJson, { terse: true });

    return <LightRender schema={schema} editor={{}} state={state} />;
}

export default story;
