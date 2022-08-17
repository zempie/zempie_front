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
            /**
             * Add an image
             */
            setImage: (options: { src: string, alt?: string, title?: string }) => ReturnType,
        }
    }
}

export const inputRegex: InputRuleFinder = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

let blobUrl = null

const urlToBlob = async (url: string) => {
    const result = await fetch(url)
    const blob = await result.blob()
    blobUrl = URL.createObjectURL(blob)
}



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

        return ['img', mergeAttributes({ 'class': 'attr-img' }, this.options.HTMLAttributes, HTMLAttributes)]

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
                    const [, , alt, src, title] = match

                    return { src, alt, title }
                },


            }),
        ]
    },

}
)
