import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CommunityCheat {
  id: number;
  cheat_name: string;
  activation_code: string;
  lua_code: string;
  download_link: string;
  selected_features: string[];
  custom_features_count: number;
  menu_design: string;
  likes: number;
  dislikes: number;
  downloads: number;
  created_at: string;
  creator_name: string;
}

interface CommunityCheatsProps {
  userId: number;
}

const CommunityCheats = ({ userId }: CommunityCheatsProps) => {
  const [cheats, setCheats] = useState<CommunityCheat[]>([]);
  const [selectedCheat, setSelectedCheat] = useState<CommunityCheat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const { toast } = useToast();

  useEffect(() => {
    fetchCheats();
  }, [sortBy]);

  const fetchCheats = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/805ecddb-3309-4d7f-add8-11d9a9421c70?sort_by=${sortBy}`);
      const data = await response.json();
      setCheats(data.cheats || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить читы',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (cheatId: number, voteType: 'like' | 'dislike') => {
    try {
      const response = await fetch('https://functions.poehali.dev/805ecddb-3309-4d7f-add8-11d9a9421c70', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          cheat_id: cheatId,
          user_id: userId,
          vote_type: voteType,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCheats(prev => prev.map(cheat => 
          cheat.id === cheatId 
            ? { ...cheat, likes: data.likes, dislikes: data.dislikes }
            : cheat
        ));
        
        if (selectedCheat && selectedCheat.id === cheatId) {
          setSelectedCheat({ ...selectedCheat, likes: data.likes, dislikes: data.dislikes });
        }
        
        toast({
          title: data.action === 'removed' ? 'Голос отменён' : 'Голос учтён',
          description: voteType === 'like' ? '👍' : '👎',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось проголосовать',
      });
    }
  };

  const handleDownload = async (cheat: CommunityCheat) => {
    try {
      await fetch('https://functions.poehali.dev/805ecddb-3309-4d7f-add8-11d9a9421c70', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download',
          cheat_id: cheat.id,
        }),
      });

      navigator.clipboard.writeText(cheat.lua_code);
      
      toast({
        title: 'Скопировано!',
        description: 'Lua код скопирован в буфер обмена',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось скопировать',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
          Сообщество читов ({cheats.length})
        </h2>
        <div className="flex items-center gap-2">
          <Label className="text-orange-300">Сортировка:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-black/40 border-orange-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Недавние</SelectItem>
              <SelectItem value="popular">Популярные</SelectItem>
              <SelectItem value="downloads">По скачиваниям</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cheats.map((cheat) => (
          <Card
            key={cheat.id}
            className="border-2 border-orange-500/30 hover:border-red-500 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-yellow-900/20 transition-all cursor-pointer hover:animate-glow-pulse group hover:shadow-xl hover:shadow-orange-500/30"
            onClick={() => setSelectedCheat(cheat)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-400 transition-all">
                  {cheat.cheat_name}
                </CardTitle>
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white shrink-0">
                  {cheat.selected_features.length + cheat.custom_features_count} функций
                </Badge>
              </div>
              <div className="text-sm text-orange-300 mt-2">
                Создал: {cheat.creator_name}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(cheat.id, 'like');
                    }}
                    className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Icon name="ThumbsUp" size={16} />
                    <span>{cheat.likes}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(cheat.id, 'dislike');
                    }}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Icon name="ThumbsDown" size={16} />
                    <span>{cheat.dislikes}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Icon name="Download" size={16} />
                  <span>{cheat.downloads}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-2 border-orange-500/50 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(cheat);
                }}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Скачать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {cheats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Пока нет созданных читов</p>
        </div>
      )}

      <Dialog open={!!selectedCheat} onOpenChange={() => setSelectedCheat(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-orange-500/50 animate-glow-pulse bg-gradient-to-br from-orange-900/40 via-red-900/40 to-yellow-900/40 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
              {selectedCheat?.cheat_name}
            </DialogTitle>
            <DialogDescription className="text-orange-300">
              Создал: {selectedCheat?.creator_name} • {selectedCheat?.created_at ? new Date(selectedCheat.created_at).toLocaleDateString('ru-RU') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCheat && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(selectedCheat.id, 'like')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 transition-colors"
                  >
                    <Icon name="ThumbsUp" size={20} />
                    <span className="text-green-400 font-bold">{selectedCheat.likes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(selectedCheat.id, 'dislike')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 transition-colors"
                  >
                    <Icon name="ThumbsDown" size={20} />
                    <span className="text-red-400 font-bold">{selectedCheat.dislikes}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/50">
                  <Icon name="Download" size={20} className="text-blue-400" />
                  <span className="text-blue-400 font-bold">{selectedCheat.downloads} скачиваний</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white">Активационный код:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-green-400 font-bold text-lg">{selectedCheat.activation_code}</code>
                    <Button
                      onClick={() => copyToClipboard(selectedCheat.activation_code)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-orange-300 flex items-center gap-2">
                    <Icon name="Code" size={20} className="text-orange-400" />
                    Lua код
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(selectedCheat.lua_code)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Копировать
                  </Button>
                </div>
                <Textarea
                  value={selectedCheat.lua_code}
                  readOnly
                  className="font-mono text-sm h-64 bg-black/60 border-2 border-orange-500/50 text-green-400"
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 border-2 border-orange-500 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-300 mb-2">📦 APK установщик</h4>
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedCheat.download_link}
                    readOnly
                    className="bg-black/40 border-orange-500/50 text-white"
                  />
                  <Button
                    onClick={() => copyToClipboard(selectedCheat.download_link)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Icon name="Copy" size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCheat.selected_features.map((feature, index) => (
                  <Badge key={index} className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
                    {feature}
                  </Badge>
                ))}
                {selectedCheat.custom_features_count > 0 && (
                  <Badge className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
                    +{selectedCheat.custom_features_count} кастомных
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityCheats;
