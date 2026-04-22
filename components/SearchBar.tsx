"use client";

import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onBlur: () => void;
}

export default function SearchBar({ value, onChange, focused, onBlur }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  return (
    <div
      className="search-container"
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        width: 420,
        maxWidth: "calc(100% - 48px)",
      }}
    >
      <div
        className="search-shell"
      >
        <svg
          style={{
            position: "absolute",
            left: 16,
            color: "rgba(227,241,255,0.46)",
            flexShrink: 0,
          }}
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <path
            d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.36396 10.0711C8.60422 10.6469 7.64252 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.64252 10.6469 8.60422 10.0711 9.36396L13.3536 12.6464C13.5488 12.8417 13.5488 13.1583 13.3536 13.3536C13.1583 13.5488 12.8417 13.5488 12.6464 13.3536L9.36396 10.0711Z"
            fill="currentColor"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Search projects… (press /)"
          style={{
            width: "100%",
            background: "rgba(6, 18, 42, 0.7)",
            border: `1px solid ${value ? "rgba(104,179,255,0.72)" : "rgba(174, 214, 255, 0.18)"}`,
            borderRadius: 18,
            padding: "13px 44px 13px 44px",
            color: "#f5fbff",
            fontSize: 13,
            outline: "none",
            backdropFilter: "blur(18px)",
            boxShadow: value
              ? "0 0 0 2px rgba(0,82,255,0.2), 0 22px 48px rgba(0,0,0,0.3)"
              : "0 18px 42px rgba(0,0,0,0.22)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              right: 14,
              background: "none",
              border: "none",
              color: "rgba(227,241,255,0.55)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
