import { EditorState, RichUtils, Modifier } from "draft-js";

export const colorStyleMap = {
  red: {
    color: "rgba(255, 0, 0, 1.0)",
  },
  highlight: {
    backgroundColor: "rgb(238, 158, 9)",
  },
};

export const getFormattedTextState = (editorState, commandName, commandKey) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const commandKeyLength = commandKey.length;
  const newContentState = Modifier.replaceText(
    contentState,
    selectionState.merge({
      anchorOffset: selectionState.getFocusOffset() - commandKeyLength,
      focusOffset: selectionState.getFocusOffset(),
    }),
    ""
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "remove-range"
  );

  const updatedEditorState = EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );

  return commandName === "header-one"
    ? RichUtils.toggleBlockType(updatedEditorState, commandName)
    : commandName === "bold"
    ? RichUtils.handleKeyCommand(updatedEditorState, commandName)
    : commandName === "underline"
    ? RichUtils.handleKeyCommand(updatedEditorState, commandName)
    : commandName === "red"
    ? RichUtils.toggleInlineStyle(updatedEditorState, commandName)
    : commandName === "code-block" &&
      RichUtils.toggleBlockType(updatedEditorState, commandName);
};
