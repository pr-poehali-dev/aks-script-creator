import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CheatGeneratorResultProps {
  activationCode: string;
  generatedCheat: string;
  downloadLink: string;
  onCopyToClipboard: (text: string) => void;
  onReset: () => void;
}

export const CheatGeneratorResult = ({
  activationCode,
  generatedCheat,
  downloadLink,
  onCopyToClipboard,
  onReset,
}: CheatGeneratorResultProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-lg">
        <h3 className="text-xl font-bold text-green-400 mb-2">
          ✅ Чит успешно создан!
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-black/40 rounded">
            <span className="text-white">Активационный код:</span>
            <div className="flex items-center gap-2">
              <code className="text-green-400 font-bold text-lg">{activationCode}</code>
              <Button
                onClick={() => onCopyToClipboard(activationCode)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-lg text-purple-300">Lua скрипт:</Label>
        <div className="relative">
          <Textarea
            value={generatedCheat}
            readOnly
            rows={12}
            className="bg-black/60 border-purple-500/50 text-green-400 font-mono text-sm"
          />
          <Button
            onClick={() => onCopyToClipboard(generatedCheat)}
            size="sm"
            className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700"
          >
            <Icon name="Copy" size={16} className="mr-1" />
            Копировать
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-300 mb-2">📦 Готовый APK установщик</h4>
        <div className="flex items-center gap-2">
          <Input
            value={downloadLink}
            readOnly
            className="bg-black/40 border-blue-500/50 text-white"
          />
          <Button
            onClick={() => onCopyToClipboard(downloadLink)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Icon name="Copy" size={18} />
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Модифицированная Black Russia со встроенными читами
        </p>
      </div>

      <Button onClick={onReset} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700">
        <Icon name="RefreshCw" className="mr-2" size={20} />
        Создать новый чит
      </Button>
    </div>
  );
};
