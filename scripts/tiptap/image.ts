import {
    Node,
    nodeInputRule,
    mergeAttributes,
} from '@tiptap/core'
import { InputRuleFinder } from '@tiptap/vue-3'

export interface ImageOptions {
    inline: boolean,
    HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        image: {
            setImage: (options: { src: string, alt?: string, title?: string, type?: string }) => ReturnType,
        }
    }
}

export const inputRegex: InputRuleFinder = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

let blobUrl = null



export default Node.create<ImageOptions>({
    name: 'image',

    defaultOptions: {
        inline: true,
        HTMLAttributes: {},
    },

    inline() {

        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            type: {
                default: 'image/jpg',
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        if (usePost().post.value.type.toUpperCase() == 'BLOG') {
            return ['img', mergeAttributes({ 'class': 'attr-img' }, this.options.HTMLAttributes, HTMLAttributes)]
        }



    },
    addCommands() {

        return {
            setImage: options => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: match => {
                    const [, , alt, src, title, type] = match

                    return { src, alt, title, type }
                },


            }),
        ]
    },

}
)
