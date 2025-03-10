
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Palette } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export interface GradientPreset {
  id: string;
  name: string;
  value: string;
}

interface GradientPresetsProps {
  presets: GradientPreset[];
  onSelectPreset: (preset: GradientPreset) => void;
  onApplyToUI?: (preset: GradientPreset) => void;
  selectedPreset?: string;
}

export const GradientPresets = ({ 
  presets, 
  onSelectPreset, 
  onApplyToUI,
  selectedPreset 
}: GradientPresetsProps) => {
  const { toast } = useToast();
  
  const handlePresetClick = (preset: GradientPreset) => {
    onSelectPreset(preset);
    toast({
      title: "Gradient Applied",
      description: `The "${preset.name}" gradient has been applied.`,
      duration: 3000,
    });
  };

  const handleApplyToUI = (preset: GradientPreset, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (onApplyToUI) {
      onApplyToUI(preset);
      toast({
        title: "Gradient Applied to UI",
        description: `The "${preset.name}" gradient has been applied to the UI.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Gradient Presets</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all relative ${
              selectedPreset === preset.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div 
              className={`h-16 w-full ${preset.value}`}
              title={preset.name}
            ></div>
            <div className="p-2 text-xs text-center truncate">{preset.name}</div>
            <div className="absolute bottom-1 left-1 flex gap-1">
              {onApplyToUI && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-background/80 hover:bg-background/90"
                  onClick={(e) => handleApplyToUI(preset, e)}
                  title="Apply to UI"
                >
                  <Palette className="h-3 w-3" />
                </Button>
              )}
            </div>
            {selectedPreset === preset.id && (
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
