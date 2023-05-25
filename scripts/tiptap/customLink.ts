import { Node } from 'tiptap';

export default class LinkPreviewNode extends Node {
  get name() {
    return 'link_preview';
  }

  get schema() {
    return {
      attrs: {
        url: {},
        title: {},
        description: {},
        image: {},
      },
      group: 'inline',
      inline: true,
      selectable: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({
            url: dom.getAttribute('href'),
          }),
        },
      ],
      toDOM: (node) => [
        'a',
        {
          class: 'link-preview',
          href: node.attrs.url,
          'data-url': node.attrs.url,
          'data-title': node.attrs.title,
          'data-description': node.attrs.description,
          'data-image': node.attrs.image,
        },
        [
          'div',
          {
            class: 'link-preview__title',
          },
          node.attrs.title,
        ],
        [
          'div',
          {
            class: 'link-preview__description',
          },
          node.attrs.description,
        ],
        [
          'div',
          {
            class: 'link-preview__image',
          },
          [
            'img',
            {
              src: node.attrs.image,
            },
          ],
        ],
      ],
    };
  }

  async getMetadata(url) {
    try {
      const data = await getOpenGraphData(url);
      return {
        title: data.title,
        description: data.description,
        image: data.image.url,
      };
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  async getPreviewData(url) {
    const metadata = await this.getMetadata(url);
    return {
      url,
      ...metadata,
    };
  }

  async createNode(url) {
    const data = await this.getPreviewData(url);
    return this.editor.schema.nodes.link_preview.create(data);
  }

  commands({ type }) {
    return (attrs) => (state, dispatch) => {
      const { selection } = state;
      const url = attrs.url || prompt('Enter a URL');
      if (!url) return false;
      const node = type.create({ url });
      const transaction = state.tr.replaceSelectionWith(node);
      dispatch(transaction);
      this.createNode(url);
      return true;
    };
  }
}
