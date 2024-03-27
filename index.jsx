import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { getFormattedTextState, colorStyleMap } from "../../Utils/Utils";
import SaveButton from "./saveButton";
import EditorTitle from "./title";

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const currentEditorState = localStorage.getItem("currentEditorState");
    const rawEditorData = currentEditorState
      ? JSON.parse(currentEditorState)
      : null;
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleSave = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem("currentEditorState", JSON.stringify(rawContent));
    setEditorState(editorState);
  };

  const handleTextChange = (editorState) => {
    const currentChars = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getAnchorKey())
      .getText();
    if (currentChars.length === 2 && currentChars === "# ") {
      const newEditorState = getFormattedTextState(
        editorState,
        "header-one",
        currentChars
      );
      setEditorState(newEditorState);
    } else if (currentChars.length === 2 && currentChars === "* ") {
      const newEditorState = getFormattedTextState(
        editorState,
        "bold",
        currentChars
      );
      setEditorState(newEditorState);
    } else if (currentChars.length === 4 && currentChars === "*** ") {
      const newEditorState = getFormattedTextState(
        editorState,
        "underline",
        currentChars
      );
      setEditorState(newEditorState);
    } else if (currentChars.length === 3 && currentChars === "** ") {
      const newEditorState = getFormattedTextState(
        editorState,
        "red",
        currentChars
      );
      setEditorState(newEditorState);
    } else if (currentChars.length === 4 && currentChars === "``` ") {
      const newEditorState = getFormattedTextState(
        editorState,
        "code-block",
        currentChars
      );
      const highlightedEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        "highlight"
      );
      setEditorState(highlightedEditorState);
    } else {
      setEditorState(editorState);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <EditorTitle />
        <SaveButton handleSave={handleSave} />
      </div>
      <div className="editor">
        <Editor
          editorState={editorState}
          onChange={handleTextChange}
          customStyleMap={colorStyleMap}
        />
      </div>
    </>
  );
};

export default RichTextEditor;
