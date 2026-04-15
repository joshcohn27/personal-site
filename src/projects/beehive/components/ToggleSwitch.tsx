import React from "react";

type Props = {
  label?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

const ToggleSwitch: React.FC<Props> = ({
  label,
  checked,
  onChange,
}) => {


  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    gap: "0.3em",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: ".67em",
    fontWeight: 400,
    margin: 0,
    lineHeight: 1,
  };

  const trackStyle: React.CSSProperties = {
    width: "10em",
    height: "3.5em",
    borderRadius: "8px",
    background: checked ? "#BFF1BA" : "#e6e6e6",
    border: "none",
    position: "relative",
    cursor: "pointer",
    padding: 0,
    overflow: "visible",
  };

  const thumbStyle: React.CSSProperties = {
    width: "5em",
    height: "4em",
    borderRadius: "8px",
    background: checked ? "#1DA311" : "#111",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: checked ? "calc(100% - 4em)" : "0",
    transition: "left 150ms ease",
    boxShadow: "0 4px 8px #00000033",
  };

  const textStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: checked ? "flex-start" : "flex-end",
    paddingLeft: checked ? "1.1em" : 0,
    paddingRight: checked ? 0 : "1.1em",
    fontSize: "1.5em",
    fontWeight: 400,
    color: "#111",
    pointerEvents: "none",
  };

  function onClick() {
    onChange(!checked);
  }


  return (
    <div style={containerStyle}>
      <div style={labelStyle}>{label}</div>

      <button
        type="button"
        onClick={onClick}
        aria-pressed={checked}
        style={trackStyle}
      >
        <div style={thumbStyle} />
        <div style={textStyle}>{checked ? "On" : "Off"}</div>
      </button>
    </div>
  );
};

export default ToggleSwitch;
