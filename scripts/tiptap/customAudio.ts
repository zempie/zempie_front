import { mergeAttributes, Node } from '@tiptap/core'

export interface AudioOptions {
    inline: boolean,
    HTMLAttributes: {
        [key: string]: any
    },
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        audio: {
            setAudio: (options: { src: string, title?: string, type?: string, controls?: boolean }) => ReturnType,
        }
    }
}
let renderCount = 2;

export default Node.create({
    name: 'audio',
    inline() {
        return this.options.inline
    },
    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addAttributes() {
        return {
            title: {
                default: null,
            },
            src: {
                default: null,
            },
            type: {
                default: null
            },
            controls: {
                default: true
            }

        }
    },
    parseHTML() {
        return [{
            tag: 'audio',
        }]
    },


    renderHTML({ HTMLAttributes }) {
        return ['div', this.options.HTMLAttributes, ['audio', mergeAttributes({ 'controls': true }, HTMLAttributes)]
            // FIXME: content호출시 p 두번 출력..; 왜? 
            // , ['p', HTMLAttributes.title]
        ]
    },

    addCommands() {
        return {
            setAudio: (options: { src: string, title?: string, type?: string }) => ({ tr, dispatch }) => {
                const { selection } = tr
                const node = this.type.create(options)
                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }

                return true
            },
        }
    },

})
