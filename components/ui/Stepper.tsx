'use client'

import React from 'react'
import { Check } from 'lucide-react'

interface StepperProps {
  steps: {
    id: string
    title: string
    description?: string
  }[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <button
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 font-semibold
                  ${index < currentStep 
                    ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700' 
                    : index === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-600'
                  }
                  ${onStepClick && index !== currentStep ? 'cursor-pointer' : ''}
                `}
              >
                {index < currentStep ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-1 mx-4 transition-all duration-300
                ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}
              `} style={{ marginTop: '-2rem' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
