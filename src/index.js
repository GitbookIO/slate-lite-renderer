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

    constructor(props: *) {
        super(props);

        this.schema = Slate.Schema.create(props.schema || {});
    }

    /*
     * Render a mark.
     */
    renderMark = ({
        mark,
        marks,
        node,
        offset,
        children
    }: {
        mark: Slate.Mark,
        node: Slate.Text,
        marks: *,
        offset: number,
        children: React.Element<*>
    }): React.Element<*> => {
        const { state } = this.props;

        const Component = mark.getComponent(this.schema);
        if (!Component) {
            return children;
        }

        return (
            <Component
                editor={this}
                mark={mark}
                marks={marks}
                node={node}
                offset={offset}
                schema={this.schema}
                state={state}
                text={node}
            >
                {children}
            </Component>
        );
    };

    /*
     * Render a range of text.
     */
    renderRange = ({
        range,
        node,
        offset
    }: {
        range: Slate.Range,
        node: Slate.Text,
        offset: number
    }): React.Element<*> => {
        const { marks } = range;

        return marks.reduce(
            (children, mark) =>
                this.renderMark({
                    mark,
                    marks,
                    node,
                    children,
                    offset
                }),
            range.text
        );
    };

    /*
     * Render a text node.
     */
    renderText = ({ node }: { node: Slate.Text }): React.Element<*> => {
        const { document } = this.props.state;
        const decorators = this.schema.hasDecorators
            ? document.getDescendantDecorators(node.key, this.schema)
            : [];

        const ranges = node.getRanges(decorators);
        let offset = 0;

        const leaves = ranges.map((range, i) => {
            const leaf = this.renderRange({
                range,
                node,
                offset
            });
            offset += range.text.length;
            return leaf;
        });

        return <span data-key={node.key}>{leaves}</span>;
    };

    /*
     * Render a node.
     */
    renderNode = ({
        node,
        parent
    }: {
        node: Slate.Document | Slate.Inline | Slate.Block,
        parent: Slate.Document | Slate.Inline | Slate.Block
    }): React.Element<*> => {
        const Component = node.getComponent(this.schema);

        const attributes = {
            'data-key': node.key
        };

        // If it's a block node with inline children, add the proper `dir` attribute
        // for text direction.
        if (node.kind == 'block' && node.nodes.first().kind != 'block') {
            const direction = node.getTextDirection();
            if (direction == 'rtl') attributes.dir = 'rtl';
        }

        return (
            <Component
                attributes={attributes}
                editor={this}
                isSelected={false}
                key={node.key}
                node={node}
                parent={parent}
                readOnly
                state={this.props.state}
            >
                {node.isVoid ? null : (
                    node.nodes.map(child => {
                        if (child.kind == 'text') {
                            return this.renderText(child);
                        }
                        return this.renderNode({ node: child, parent: node });
                    })
                )}
            </Component>
        );
    };

    render() {
        const { state } = this.props;
        const { document } = state;

        return (
            <div className="editor">
                <div data-slate-editor="true">
                    {document.nodes.map(node =>
                        this.renderNode({ node, parent: document })
                    )}
                </div>
            </div>
        );
    }
}

export default LightRender;
