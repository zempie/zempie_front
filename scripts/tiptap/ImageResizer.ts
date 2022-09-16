import Image from '@tiptap/extension-image';

import { VueNodeViewRenderer } from '@tiptap/vue-3'

import ResizableImageTemplate from './ResizableImageTemplate.vue';

const CustomResizeImage = Image.extend({

  name: 'CustomResizeImage',

  addAttributes() {

    // Return an object with attribute configuration

    return {

      ...this.parent?.(),

      src: {

        default: '',

        renderHTML: attributes => {

          // … and return an object with HTML attributes.

          return {

            src: attributes.src,

          };

        },

      },

      width: {

        default: 750,

        renderHTML: ({ width }) => ({ width }),

      },

      height: {

        default: 500,

        renderHTML: ({ height }) => ({ height }),

      },

      isDraggable: {

        default: true,

        // We don't want it to render on the img tag

        renderHTML: attributes => {

          return {};

        },

      },

    };

  },

  addNodeView() {
    console.log('CustomResizeImage')
    return VueNodeViewRenderer(ResizableImageTemplate);

  },

});

export { CustomResizeImage };

export default CustomResizeImage;
