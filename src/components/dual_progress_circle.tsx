import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface DualProgressCircleProps {
  seriesProgress: number;
  postProgress: number;
  size?: number;
}

const DualProgressCircle: React.FC<DualProgressCircleProps> = ({
  seriesProgress,
  postProgress,
  size = 40,
}) => {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {/* Series Progress (Blue, inner circle) */}
      <CircularProgressbar
        value={seriesProgress}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: "butt",
          pathColor: "#3b82f6",
          trailColor: "#e5e7eb",
          pathTransitionDuration: 0.5,
        })}
      />
      {/* Post Progress (Green, outer circle) */}
      <div
        style={{
          position: "absolute",
          width: "92%",
          height: "92%",
          top: "4%",
          left: "4%",
        }}
      >
        <CircularProgressbar
          value={postProgress}
          styles={buildStyles({
            rotation: 0,
            strokeLinecap: "butt",
            pathColor: "#10b981",
            trailColor: "transparent",
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
      {/* Percentage Text */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.35,
          fontWeight: "bold",
        }}
      >
        {postProgress}%
      </div>
    </div>
  );
};

export default DualProgressCircle;
