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
      setImage: (options: { src: string, height: number, width: number, alt?: string, title?: string, type?: string }) => ReturnType,
    }
  }
}

export const inputRegex: InputRuleFinder = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/


export default Node.create<ImageOptions>({
  name: 'image',

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
      height: {
        default: 100,
      },
      width: {
        default: 1000,
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
    return ['div', this.options.HTMLAttributes, ['img', HTMLAttributes]]
  },
  addCommands() {
    return {
      setImage: options => ({ commands, tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)
        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }
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
  }

})
