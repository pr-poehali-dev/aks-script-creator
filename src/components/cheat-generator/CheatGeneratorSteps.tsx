import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { availableFeatures } from './LuaCodeGenerator';

interface Step1Props {
  cheatName: string;
  setCheatName: (value: string) => void;
  onNext: () => void;
}

export const Step1 = ({ cheatName, setCheatName, onNext }: Step1Props) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cheatName" className="text-lg text-orange-300">
          1️⃣ Название чита
        </Label>
        <Input
          id="cheatName"
          value={cheatName}
          onChange={(e) => setCheatName(e.target.value)}
          placeholder="Например: MegaCheat v2.0"
          className="mt-2 bg-black/40 border-orange-500/50 text-white placeholder:text-gray-500"
        />
      </div>
      <Button onClick={onNext} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
        Далее <Icon name="ArrowRight" className="ml-2" size={20} />
      </Button>
    </div>
  );
};

interface Step2Props {
  selectedFeatures: string[];
  onFeatureToggle: (featureId: string) => void;
  customFeatures: { name: string; code: string }[];
  customFeatureName: string;
  setCustomFeatureName: (value: string) => void;
  customFeatureCode: string;
  setCustomFeatureCode: (value: string) => void;
  onAddCustomFeature: () => void;
  onRemoveCustomFeature: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2 = ({
  selectedFeatures,
  onFeatureToggle,
  customFeatures,
  customFeatureName,
  setCustomFeatureName,
  customFeatureCode,
  setCustomFeatureCode,
  onAddCustomFeature,
  onRemoveCustomFeature,
  onPrev,
  onNext,
}: Step2Props) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg text-red-300">2️⃣ Выберите функции</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {availableFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedFeatures.includes(feature.id)
                ? 'bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500'
                : 'bg-black/30 border-gray-700 hover:border-orange-500/50'
            }`}
            onClick={() => onFeatureToggle(feature.id)}
          >
            <div className="flex items-start gap-2">
              <Checkbox
                checked={selectedFeatures.includes(feature.id)}
                className="mt-1"
              />
              <div>
                <h4 className="font-semibold text-white">{feature.name}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-lg">
        <Label className="text-lg text-yellow-300 mb-3 block">➕ Добавить свою функцию</Label>
        <div className="space-y-3">
          <Input
            value={customFeatureName}
            onChange={(e) => setCustomFeatureName(e.target.value)}
            placeholder="Название функции (например: Авто-стрельба)"
            className="bg-black/40 border-yellow-500/50 text-white"
          />
          <Textarea
            value={customFeatureCode}
            onChange={(e) => setCustomFeatureCode(e.target.value)}
            placeholder="Lua код функции..."
            rows={4}
            className="bg-black/40 border-yellow-500/50 text-white font-mono"
          />
          <Button
            onClick={onAddCustomFeature}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            <Icon name="Plus" className="mr-2" size={18} />
            Добавить функцию
          </Button>
        </div>

        {customFeatures.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm text-yellow-300">Добавленные функции:</Label>
            {customFeatures.map((cf, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-black/40 rounded border border-yellow-500/30">
                <span className="text-white text-sm">{cf.name}</span>
                <Button
                  onClick={() => onRemoveCustomFeature(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" className="flex-1 border-orange-500/50">
          <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700">
          Далее <Icon name="ArrowRight" className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

interface Step3Props {
  menuDesign: string;
  setMenuDesign: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step3 = ({ menuDesign, setMenuDesign, onPrev, onNext }: Step3Props) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg text-yellow-300">3️⃣ Выберите дизайн меню</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['classic', 'modern', 'neon'].map((design) => (
          <div
            key={design}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              menuDesign === design
                ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500'
                : 'bg-black/30 border-gray-700 hover:border-yellow-500/50'
            }`}
            onClick={() => setMenuDesign(design)}
          >
            <h4 className="font-semibold text-white capitalize">{design}</h4>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" className="flex-1 border-yellow-500/50">
          <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
        </Button>
        <Button onClick={onNext} className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
          Далее <Icon name="ArrowRight" className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

interface Step4Props {
  additionalCode: string;
  setAdditionalCode: (value: string) => void;
  loading: boolean;
  onPrev: () => void;
  onGenerate: () => void;
}

export const Step4 = ({ additionalCode, setAdditionalCode, loading, onPrev, onGenerate }: Step4Props) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="additionalCode" className="text-lg text-orange-300">
        4️⃣ Дополнительный код (опционально)
      </Label>
      <Textarea
        id="additionalCode"
        value={additionalCode}
        onChange={(e) => setAdditionalCode(e.target.value)}
        placeholder="Вставьте свой Lua код..."
        rows={8}
        className="bg-black/40 border-orange-500/50 text-white font-mono"
      />
      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" className="flex-1 border-orange-500/50">
          <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
        </Button>
        <Button
          onClick={onGenerate}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
              Создание (30 сек)...
            </>
          ) : (
            <>
              <Icon name="Sparkles" className="mr-2" size={20} />
              Создать чит
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
