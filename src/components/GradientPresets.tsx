
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientPreset } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';

interface GradientPresetsProps {
  presets: GradientPreset[];
  onSelectPreset: (preset: GradientPreset) => void;
  selectedValue?: string;
}

export const GradientPresets = ({ presets, onSelectPreset, selectedValue }: GradientPresetsProps) => {
  const { toast } = useToast();
  
  const handlePresetClick = (preset: GradientPreset) => {
    onSelectPreset(preset);
    toast({
      title: "Gradient Applied",
      description: `The "${preset.name}" gradient has been selected.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Gradient Presets</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all relative ${
              selectedValue === preset.value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div 
              className={`h-16 w-full ${preset.value}`}
              title={preset.name}
            ></div>
            <div className="p-2 text-xs text-center truncate">{preset.name}</div>
            {selectedValue === preset.value && (
              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

