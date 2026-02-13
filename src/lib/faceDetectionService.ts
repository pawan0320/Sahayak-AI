// Face Detection Service (TEACHER ONLY)
// Using mock implementation for development/testing
// In production, you can integrate with TensorFlow.js

// Commented out TensorFlow import to avoid bundling issues
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow-models/face-landmarks-detection';

export interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  landmarks?: any;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FaceData {
  base64: string;
  timestamp: number;
  confidence: number;
}

class FaceDetectionService {
  private detector: any = null;
  private model: string = 'facemesh';
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Skip TensorFlow initialization to avoid build issues
      // In production, load real face detection model here
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      throw error;
    }
  }

  async detectFaceFromVideo(videoElement: HTMLVideoElement): Promise<FaceDetectionResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // If using real detector
      if (this.detector) {
        const predictions = await this.detector.estimateFaces(videoElement, false);

        if (predictions && predictions.length > 0) {
          const face = predictions[0];
          const keypoints = face.landmarks as number[][];

          // Calculate bounding box
          const xs = keypoints.map(kp => kp[0]);
          const ys = keypoints.map(kp => kp[1]);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);

          return {
            detected: true,
            confidence: face.probability?.[0] || 0.95,
            landmarks: keypoints,
            boundingBox: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY,
            },
          };
        }
      } else {
        // Mock face detection for development
        return {
          detected: Math.random() > 0.3, // 70% chance of detection
          confidence: 0.85 + Math.random() * 0.15,
          boundingBox: {
            x: 100,
            y: 100,
            width: 200,
            height: 250,
          },
        };
      }

      return {
        detected: false,
        confidence: 0,
      };
    } catch (error) {
      console.error('Face detection error:', error);
      return {
        detected: false,
        confidence: 0,
      };
    }
  }

  async captureFaceImage(videoElement: HTMLVideoElement): Promise<FaceData> {
    try {
      const detection = await this.detectFaceFromVideo(videoElement);

      if (!detection.detected) {
        throw new Error('No face detected. Please ensure your face is clearly visible.');
      }

      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Flip horizontally (mirror effect)
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoElement, 0, 0);

      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      return {
        base64,
        timestamp: Date.now(),
        confidence: detection.confidence,
      };
    } catch (error: any) {
      throw new Error(`Face capture failed: ${error.message}`);
    }
  }

  async verifyFace(videoElement: HTMLVideoElement, storedFaceData: string): Promise<boolean> {
    try {
      const detection = await this.detectFaceFromVideo(videoElement);

      if (!detection.detected) {
        return false;
      }

      // Simple verification: check confidence is above threshold
      // In production, use face comparison ML model
      if (detection.confidence < 0.7) {
        return false;
      }

      // Mock verification (in production, use advanced face matching)
      return Math.random() > 0.1; // 90% success rate for demo
    } catch (error) {
      console.error('Face verification error:', error);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.detector) {
        this.detector.dispose();
        this.detector = null;
      }
      // TensorFlow cleanup skipped in mock mode
      // await tf.disposeVariables();
      this.isInitialized = false;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const faceDetectionService = new FaceDetectionService();
