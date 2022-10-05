import { Transaction, EditorState, } from "prosemirror-state";
import { Schema, DOMParser } from "prosemirror-model"
import { addListNodes } from "prosemirror-schema-list"
import {

  Node,
  mergeAttributes
} from '@tiptap/core'

export default function addPreview(schema: Schema, loc: number, tr: Transaction) {

  const tmpNode = document.createElement('div');
  const newContent = document.createTextNode("Hi there and greetings!");
  tmpNode.appendChild(newContent);
  const parser = DOMParser.fromSchema(schema);
  const newNodes = parser.parse(tmpNode);


  tr.insert(loc, newNodes.content)




}


