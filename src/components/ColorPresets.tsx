
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Palette } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorPresetsProps {
  presets: ColorPreset[];
  onSelectPreset: (preset: ColorPreset) => void;
  onApplyToUI?: (preset: ColorPreset) => void;
  selectedPreset?: string;
}

export const ColorPresets = ({ 
  presets, 
  onSelectPreset, 
  onApplyToUI,
  selectedPreset 
}: ColorPresetsProps) => {
  const { toast } = useToast();
  
  const handlePresetClick = (preset: ColorPreset) => {
    onSelectPreset(preset);
    toast({
      title: "Colors Applied",
      description: `The "${preset.name}" color preset has been applied.`,
      duration: 3000,
    });
  };

  const handleApplyToUI = (preset: ColorPreset, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (onApplyToUI) {
      onApplyToUI(preset);
      toast({
        title: "Colors Applied to UI",
        description: `The "${preset.name}" colors have been applied to the UI.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Color Presets</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all relative ${
              selectedPreset === preset.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div className="p-2 space-y-2">
              <div className="flex gap-1">
                <div 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: preset.primary }}
                  title="Primary color"
                ></div>
                <div 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: preset.secondary }}
                  title="Secondary color"
                ></div>
                <div 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: preset.accent }}
                  title="Accent color"
                ></div>
              </div>
              <div className="text-xs text-center truncate">{preset.name}</div>
            </div>
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
