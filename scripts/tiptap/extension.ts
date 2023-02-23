import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '~~/components/PreviewLink.vue'

export default Node.create({
  name: 'vueComponent',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      title: {
        default: '',
      },
      description: {
        default: '',
      },
      img_url: {
        default: '',
      },
      favicon: {
        default: '',
      },
      domain: {
        default: ''
      }
    }

  },

  parseHTML() {
    return [
      {
        tag: 'vue-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['vue-component', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})
