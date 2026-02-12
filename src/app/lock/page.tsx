'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Lock, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraUI } from '@/components/auth/CameraUI';
import { useRouter, useSearchParams } from 'next/navigation';

function AppLockContent() {
  const [isLocked, setIsLocked] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleFaceCapture = async (imageData: string) => {
    // Mock face verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLocked(false);
    setTimeout(() => {
      router.push(redirect);
    }, 500);
  };

  if (!isLocked) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-md bg-background/80 border border-border rounded-2xl p-8 shadow-2xl">
          {/* Lock Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full">
                <Lock className="w-12 h-12 text-foreground" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">App Locked</h1>
            <p className="text-muted-foreground">
              {showCamera
                ? 'Position your face to unlock'
                : 'Use biometric authentication to unlock'}
            </p>
          </motion.div>

          {/* Camera or Unlock Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {showCamera ? (
              <div className="space-y-4">
                <CameraUI
                  onCapture={handleFaceCapture}
                  onFaceDetected={setIsFaceDetected}
                  isLoading={false}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCamera(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={() => setShowCamera(true)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 text-lg gap-2 py-6"
                >
                  <Camera className="w-5 h-5" />
                  Unlock with Face ID
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    or use alternative method
                  </p>
                  <Button variant="outline" className="w-full">
                    Enter Password
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20 text-center"
          >
            <p className="text-xs text-muted-foreground">
              🔐 Biometric authentication is secure and encrypted
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AppLock() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AppLockContent />
    </Suspense>
  );
}
