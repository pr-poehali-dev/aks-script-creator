import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Step1, Step2, Step3, Step4 } from './cheat-generator/CheatGeneratorSteps';
import { CheatGeneratorResult } from './cheat-generator/CheatGeneratorResult';
import { generateLuaCode } from './cheat-generator/LuaCodeGenerator';

interface CheatGeneratorProps {
  userId: number;
}

const CheatGenerator = ({ userId }: CheatGeneratorProps) => {
  const [step, setStep] = useState(1);
  const [cheatName, setCheatName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatures, setCustomFeatures] = useState<{ name: string; code: string }[]>([]);
  const [customFeatureName, setCustomFeatureName] = useState('');
  const [customFeatureCode, setCustomFeatureCode] = useState('');
  const [menuDesign, setMenuDesign] = useState('classic');
  const [additionalCode, setAdditionalCode] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [generatedCheat, setGeneratedCheat] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const addCustomFeature = () => {
    if (!customFeatureName || !customFeatureCode) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите название и код функции',
      });
      return;
    }

    setCustomFeatures(prev => [...prev, { name: customFeatureName, code: customFeatureCode }]);
    setCustomFeatureName('');
    setCustomFeatureCode('');
    toast({
      title: 'Успешно',
      description: `Функция "${customFeatureName}" добавлена`,
    });
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const generateActivationCode = () => {
    const code = Math.random().toString(36).substring(2, 15).toUpperCase();
    setActivationCode(code);
    return code;
  };

  const generateCheat = () => {
    if (!cheatName || (selectedFeatures.length === 0 && customFeatures.length === 0)) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните название и выберите хотя бы одну функцию',
      });
      return;
    }

    setLoading(true);

    const code = generateActivationCode();

    const luaCode = generateLuaCode({
      cheatName,
      activationCode: code,
      selectedFeatures,
      customFeatures,
      menuDesign,
      additionalCode,
    });

    setGeneratedCheat(luaCode);
    const fakeDownloadLink = `https://aksgod.dev/download/${code}.apk`;
    setDownloadLink(fakeDownloadLink);
    
    setLoading(false);
    setStep(5);
    
    toast({
      title: 'Чит создан!',
      description: `Активационный код: ${code}`,
    });
  };

  const nextStep = () => {
    if (step === 1 && !cheatName) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите название чита',
      });
      return;
    }
    if (step === 2 && selectedFeatures.length === 0 && customFeatures.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Выберите хотя бы одну функцию',
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const resetGenerator = () => {
    setStep(1);
    setCheatName('');
    setSelectedFeatures([]);
    setCustomFeatures([]);
    setMenuDesign('classic');
    setAdditionalCode('');
    setActivationCode('');
    setGeneratedCheat('');
    setDownloadLink('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 border-2 border-purple-500/50 animate-glow-pulse">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
            🎮 ИИ Генератор Читов
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-[length:200%_auto] animate-rainbow'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Step1
              cheatName={cheatName}
              setCheatName={setCheatName}
              onNext={nextStep}
            />
          )}

          {step === 2 && (
            <Step2
              selectedFeatures={selectedFeatures}
              onFeatureToggle={handleFeatureToggle}
              customFeatures={customFeatures}
              customFeatureName={customFeatureName}
              setCustomFeatureName={setCustomFeatureName}
              customFeatureCode={customFeatureCode}
              setCustomFeatureCode={setCustomFeatureCode}
              onAddCustomFeature={addCustomFeature}
              onRemoveCustomFeature={removeCustomFeature}
              onPrev={prevStep}
              onNext={nextStep}
            />
          )}

          {step === 3 && (
            <Step3
              menuDesign={menuDesign}
              setMenuDesign={setMenuDesign}
              onPrev={prevStep}
              onNext={nextStep}
            />
          )}

          {step === 4 && (
            <Step4
              additionalCode={additionalCode}
              setAdditionalCode={setAdditionalCode}
              loading={loading}
              onPrev={prevStep}
              onGenerate={generateCheat}
            />
          )}

          {step === 5 && (
            <CheatGeneratorResult
              activationCode={activationCode}
              generatedCheat={generatedCheat}
              downloadLink={downloadLink}
              onCopyToClipboard={copyToClipboard}
              onReset={resetGenerator}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheatGenerator;
