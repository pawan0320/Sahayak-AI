'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraUIProps {
  onCapture: (imageData: string) => void;
  onFaceDetected?: (isDetected: boolean) => void;
  isLoading?: boolean;
}

export function CameraUI({ onCapture, onFaceDetected, isLoading = false }: CameraUIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          setError(null);
        }
      } catch (err) {
        setError('Unable to access camera. Please check permissions.');
        console.error('Camera access error:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Mock face detection
  useEffect(() => {
    if (!isCameraActive) return;

    const interval = setInterval(() => {
      const detected = Math.random() > 0.3;
      setIsFaceDetected(detected);
      onFaceDetected?.(detected);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCameraActive, onFaceDetected]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-lg border-2 border-primary/50 bg-black">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Face Detection Indicator */}
            <motion.div
              animate={{
                borderColor: isFaceDetected ? '#22c55e' : '#ef4444',
                boxShadow: isFaceDetected
                  ? '0 0 20px rgba(34, 197, 94, 0.5)'
                  : '0 0 20px rgba(239, 68, 68, 0.5)',
              }}
              className="absolute inset-0 rounded-lg border-2 pointer-events-none transition-all"
            />

            {/* Center Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-56 border-2 border-primary/50 rounded-lg" />
            </div>

            {/* Status Label */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isFaceDetected ? 1 : 0.95,
                  opacity: isFaceDetected ? 1 : 0.7,
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isFaceDetected
                    ? 'bg-success/20 text-success'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {isFaceDetected ? 'Face Detected ✓' : 'Position Your Face'}
              </motion.div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleCapture}
          disabled={!isFaceDetected || isLoading || !!error}
          size="lg"
          className="gap-2"
        >
          <Camera className="w-4 h-4" />
          {isLoading ? 'Processing...' : 'Capture Face'}
        </Button>
      </div>
    </div>
  );
}
