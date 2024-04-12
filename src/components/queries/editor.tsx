"use client";

import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { PostgreSQL } from "@codemirror/lang-sql";
import { forwardRef, useCallback } from "react";

type Props = {
  value: string;
  setValue: (val: string) => void;
};

const Editor = forwardRef((props: Props, _ref) => {
  const { value, setValue } = props;

  const onChange = useCallback(
    (val: string, _viewUpdate: ViewUpdate) => {
      setValue(val);
    },
    [setValue],
  );

  return (
    <CodeMirror value={value} extensions={[PostgreSQL]} onChange={onChange} />
  );
});

Editor.displayName = "Editor";

export default Editor;
