// @flow
import React from 'react';
import type Slate from 'slate';

class LightRender extends React.PureComponent {
    props: {
        // className: string,
        // plugins: array,
        // role: string,
        schema: *,
        editor: *,
        state: Slate.State
        // style: object
    };

    static renderNode({ editor, state, schema, node }): React.Element<*> {
        let children = null;
        if (node.nodes) {
            children = node.nodes.map(n =>
                LightRender.renderNode({ editor, state, schema, node: n })
            );
        }

        // Get component
        if (node.kind === 'block') {
            const X =
                schema.nodes[node.type] ||
                (node.kind == 'block'
                    ? props => <div {...props} />
                    : props => <span {...props} />);

            return (
                <X
                    key={node.key}
                    editor={{ props: editor }}
                    state={state}
                    schema={schema}
                    node={node}
                >
                    {children}
                </X>
            );
        }
        // else (text, inline, void)
        return (
            <span key={node.key} node={node}>
                {node.text}
            </span>
        );
    }

    render() {
        const { state, schema, editor } = this.props;

        return (
            <div className="editor">
                <div data-slate-editor="true" key={state.document.key}>
                    {state.document.nodes.map(node =>
                        LightRender.renderNode({ editor, state, schema, node })
                    )}
                </div>
            </div>
        );
    }
}

export default LightRender;
