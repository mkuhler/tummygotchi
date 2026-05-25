import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  onSave: (name: string) => void;
  className?: string;
  inputClassName?: string;
};

export function EditablePetName({
  name,
  onSave,
  className = "",
  inputClassName = "",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) {
      onSave(trimmed);
    } else {
      setDraft(name);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`editable-name editable-name--editing ${className}`}>
        <input
          ref={inputRef}
          type="text"
          className={`editable-name__input ${inputClassName}`}
          value={draft}
          maxLength={24}
          aria-label="Pet name"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          onBlur={commit}
        />
      </div>
    );
  }

  return (
    <div className={`editable-name ${className}`}>
      <span className="editable-name__label">{name}</span>
      <button
        type="button"
        className="editable-name__edit"
        onClick={() => setEditing(true)}
        aria-label="Edit pet name"
        title="Edit name"
      >
        ✏️
      </button>
    </div>
  );
}
