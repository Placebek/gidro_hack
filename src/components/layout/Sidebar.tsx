import { useState, useEffect } from "react";
import { Search, Mic, MicOff, MapPinned, Table } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { mockObjects } from "../../data/mockObjects";
// import type { ObjectFeature } from "..types";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [resourceType, setResourceType] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Голосовой поиск — магия 2025
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "ru-RU";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setSearchQuery(transcript);

      // Умное распознавание команд
      if (transcript.includes("красн") || transcript.includes("пят")) setCondition("5");
      if (transcript.includes("жёлт")) setCondition("3");
      if (transcript.includes("алмат")) setRegion("Алматинская");
      if (transcript.includes("водохранилище")) setResourceType("водохранилище");
      if (transcript.includes("озеро")) setResourceType("озеро");
      if (transcript.includes("высокий приоритет") || transcript.includes("срочно")) setPriorityFilter("Высокий");

      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.abort();
  }, [isListening]);

  // Применяем фильтры глобально — просто пример, потом подключим к карте
  const filteredObjects = mockObjects.filter(obj => {
    const p = obj.properties;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (region !== "all" && p.region !== region) return false;
    if (resourceType !== "all" && p.resource_type !== resourceType) return false;
    if (condition !== "all" && p.technical_condition !== +condition) return false;
    if (priorityFilter !== "all" && p.priorityLevel !== priorityFilter) return false;
    return true;
  });

  const regions = Array.from(new Set(mockObjects.map(o => o.properties.region)));

  return (
    <div className="h-full overflow-y-auto p-6 bg-linear-to-b from-cyan-50/50 to-transparent dark:from-gray-900">
      <h2 className="text-2xl font-bold mb-8 bg-linear-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
        ГидроАтлас
      </h2>

      {/* Поиск + голос */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Поиск по названию или голосом..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12 h-12 text-base"
        />
        <Button
          size="icon"
          variant={isListening ? "destructive" : "ghost"}
          className="absolute right-1 top-1 h-10 w-10"
          onClick={() => setIsListening(!isListening)}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        {isListening && <div className="text-xs text-cyan-600 mt-1 animate-pulse">Слушаю...</div>}
      </div>

      {/* Фильтры */}
      <div className="space-y-6">

        <div>
          <Label className="text-sm font-semibold mb-2 block">Область</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Все области" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все области</SelectItem>
              {regions.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Тип объекта</Label>
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="озеро">Озёра</SelectItem>
              <SelectItem value="водохранилище">Водохранилища</SelectItem>
              <SelectItem value="канал">Каналы</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Состояние</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Любое" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {[1,2,3,4,5].map(n => (
                <SelectItem key={n} value={String(n)}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: {
                      1: "#22c55e",2: "#84cc16",3: "#eab308",4: "#f97316",5: "#ef444c"
                    }[n]}} />
                    Категория {n}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Приоритет обследования</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="Высокий">Высокий (срочно!)</SelectItem>
              <SelectItem value="Средний">Средний</SelectItem>
              <SelectItem value="Низкий">Низкий</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Heatmap toggle */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-cyan-600" />
            <div>
              <div className="font-medium">Тепловая карта критичности</div>
              <div className="text-xs text-gray-500">Красное = срочно</div>
            </div>
          </div>
          <Switch checked={heatmapEnabled} onCheckedChange={setHeatmapEnabled} />
        </div>

        {/* Кнопки действий */}
        <div className="pt-6 space-y-3">
          <Button className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Table className="mr-2 h-4 w-4" />
            Открыть таблицу приоритетов
          </Button>

          <div className="text-center text-sm text-gray-600 pt-4">
            Найдено объектов: <span className="font-bold text-cyan-600">{filteredObjects.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}