'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingIntro } from '@/components/onboarding/OnboardingIntro';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';

type AutomationLevel = 'balanced' | 'aggressive' | 'minimal';

interface OnboardingData {
  workspaceName: string;
  teamSize: string;
  industry: string;
  workflowStyle: string;
  automationLevel: AutomationLevel;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [data, setData] = useState<OnboardingData>({
    workspaceName: '',
    teamSize: '',
    industry: '',
    workflowStyle: '',
    automationLevel: 'balanced',
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    // In a real app, we'd save this to the database
    console.log('Onboarding complete:', data);
    router.push('/dashboard');
  };

  if (showIntro) {
    return <OnboardingIntro onStart={() => setShowIntro(false)} />;
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <OnboardingLayout
            currentStep={1}
            totalSteps={totalSteps}
            title="Name Your Workspace"
            description="Every great structure begins with a name. Define your digital environment’s identity."
          >
            <OnboardingStep1 data={data} updateData={updateData} onNext={nextStep} />
          </OnboardingLayout>
        );
      case 2:
        return (
          <OnboardingLayout
            currentStep={2}
            totalSteps={totalSteps}
            title="Curate Your Style"
            description="Visual clarity drives execution. Choose an aesthetic that aligns with your mental model."
          >
            <OnboardingStep2 data={data} updateData={updateData} onNext={nextStep} />
          </OnboardingLayout>
        );
      case 3:
        return (
          <OnboardingLayout
            currentStep={3}
            totalSteps={totalSteps}
            title="Align Intelligence"
            description="Define how much assistance you need. Your AI companion adapts to your velocity."
          >
            <OnboardingStep3 data={data} updateData={updateData} onNext={nextStep} />
          </OnboardingLayout>
        );
      case 4:
        return (
          <div className="min-h-screen bg-cream grain-overlay flex items-center justify-center p-6">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-surface-elevated border border-border-soft p-12 rounded-[32px] shadow-medium relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-light-green/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <OnboardingComplete onComplete={handleComplete} workspaceName={data.workspaceName} />
             </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={showIntro ? 'intro' : `step-${step}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {getStepContent()}
      </motion.main>
    </AnimatePresence>
  );
}
