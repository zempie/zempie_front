import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '~~/components/PreviewLink.vue'

export default Node.create({
  name: 'linkPreview',

  inline: false,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {

    return {

      title: {
        default: '',
      },
      url: {
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
        tag: 'div',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // this.dom.classList.add("ProseMirror-selectednode")
    return ['div', { class: 'el-card' },
      ['a', { 'href': `${HTMLAttributes.url}`, 'target': '_blank' },
        ['div', {
          style: `background:url(${HTMLAttributes.img_url}) center center / cover no-repeat;
        width: 100%;
      height: 150px;
      background-size: cover;
      background-position: center;`}],
        [
          'div', { class: 'tag-info-container' },
          [
            'span', [
              'strong', { class: 'tag-title' }, `${HTMLAttributes.title}`
            ],
            ['div', { class: 'bottom' }],
            [
              'div', { style: 'display:block' },
              ['p', { class: 'tag-desc' }, `${HTMLAttributes.description}`],
              ['div', { 'class': 'domain-div' },
                [
                  'p', {
                    class: 'tag-favicon',
                    style: `background:url(${HTMLAttributes.favicon}); `
                  },
                ],
                ['strong', `${HTMLAttributes.domain}`]
              ]
            ]
          ]
        ],
      ]
    ]

  },


  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})
