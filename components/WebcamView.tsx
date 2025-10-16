"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

interface WebcamViewProps {
  onFrame: (frame: string | null) => void;
}

const WebcamView: React.FC<WebcamViewProps> = ({ onFrame }) => {
  const webcamRef = useRef<Webcam>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current) {
        const frame = webcamRef.current.getScreenshot();
        onFrame(frame);
      }
    }, 250); // Capture frame 4 times per second

    // Check for camera permissions
    navigator.mediaDevices.getUserMedia({ video: true })
      .catch(err => {
        setCameraError("Camera permission is required. Please enable it in your browser settings.");
        console.error("Camera error:", err);
      });

    return () => clearInterval(interval);
  }, [onFrame]);

  if (cameraError) {
    return <div className="w-full h-full bg-card border border-border rounded-lg flex items-center justify-center p-4 text-center text-sm">{cameraError}</div>;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        mirrored={true}
      />
    </div>
  );
};

export default WebcamView;