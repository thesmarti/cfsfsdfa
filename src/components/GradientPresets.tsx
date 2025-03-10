
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientPreset } from '@/types';

interface GradientPresetsProps {
  presets: GradientPreset[];
  onSelectPreset: (preset: GradientPreset) => void;
}

export const GradientPresets = ({ presets, onSelectPreset }: GradientPresetsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Gradient Presets</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => onSelectPreset(preset)}
          >
            <div 
              className={`h-16 w-full ${preset.value}`}
              title={preset.name}
            ></div>
            <div className="p-2 text-xs text-center truncate">{preset.name}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
