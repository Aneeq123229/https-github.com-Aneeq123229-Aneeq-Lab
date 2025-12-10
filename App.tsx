import React, { useState, useRef, useEffect } from 'react';
import { ToolType } from './types';
import { generateAdCopy, generateImage, generateSong } from './services/geminiService';
import { 
  Megaphone, 
  Palette, 
  Music, 
  Image as ImageIcon, 
  ArrowRight, 
  Cpu, 
  Loader2,
  Sparkles, 
  Play, 
  Pause, 
  Home 
} from 'lucide-react';

// --- Shared UI Components ---

const LoadingSpinner = () => <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />;

const ToolHeader = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
  <div className="mb-8 text-center sm:text-left">
    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
        <Icon className="w-8 h-8 text-cyan-400" />
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h2>
    </div>
    <p className="text-slate-400 text-lg">{description}</p>
  </div>
);

const InputGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-slate-300 text-sm font-medium mb-2">{label}</label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
    placeholder={placeholder}
  />
);

const TextArea = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all h-32 resize-none"
    placeholder={placeholder}
  />
);

const Button = ({ onClick, disabled, loading, children, className = "" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className} ${loading ? 'cursor-wait' : ''}`}
  >
    {loading ? <LoadingSpinner /> : <><Sparkles className="w-5 h-5" /> {children}</>}
  </button>
);

// --- Tool Components ---

const AdCreator = () => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState<{headline: string, body: string, cta: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!product || !features) return;
    setLoading(true);
    try {
      const data = await generateAdCopy(product, audience, features);
      setResult(data);
    } catch (e) {
      alert("Failed to generate ad copy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-panel p-6 rounded-2xl">
        <ToolHeader title="Ad Creator" description="Generate high-converting ad copy in seconds." icon={Megaphone} />
        <InputGroup label="Product Name">
          <TextInput value={product} onChange={setProduct} placeholder="e.g., Aneeq Energy Drink" />
        </InputGroup>
        <InputGroup label="Target Audience">
          <TextInput value={audience} onChange={setAudience} placeholder="e.g., Gamers, Students" />
        </InputGroup>
        <InputGroup label="Key Features">
          <TextArea value={features} onChange={setFeatures} placeholder="e.g., Zero sugar, High caffeine, Blue raspberry flavor" />
        </InputGroup>
        <Button onClick={handleGenerate} loading={loading} disabled={!product} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20">
          Generate Ad
        </Button>
      </div>

      <div className="glass-panel p-6 rounded-2xl min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
        {!result && !loading && (
          <div className="text-center text-slate-500">
            <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Your ad copy will appear here</p>
          </div>
        )}
        {loading && <LoadingSpinner />}
        {result && (
          <div className="w-full h-full text-left space-y-6 animate-fade-in">
             <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Headline</span>
                <h3 className="text-2xl font-bold text-white">{result.headline}</h3>
             </div>
             <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Ad Body</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.body}</p>
             </div>
             <div className="pt-4 border-t border-slate-700">
                <span className="inline-block bg-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  {result.cta}
                </span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LogoMaker = () => {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name || !style) return;
    setLoading(true);
    try {
      const prompt = `A professional, vector-style logo for a brand named "${name}". Style description: ${style}. Minimalist, high contrast, clean background.`;
      const url = await generateImage(prompt, "1:1");
      setImageUrl(url);
    } catch (e) {
      alert("Failed to generate logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-panel p-6 rounded-2xl">
        <ToolHeader title="Logo Maker" description="Design unique brand identities with AI." icon={Palette} />
        <InputGroup label="Brand Name">
          <TextInput value={name} onChange={setName} placeholder="e.g., Aneeq Tech" />
        </InputGroup>
        <InputGroup label="Style & Colors">
          <TextArea value={style} onChange={setStyle} placeholder="e.g., Cyberpunk aesthetic, neon purple and black, geometric shapes" />
        </InputGroup>
        <Button onClick={handleGenerate} loading={loading} disabled={!name} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20">
          Create Logo
        </Button>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex justify-center items-center min-h-[400px]">
        {!imageUrl && !loading && (
          <div className="text-center text-slate-500">
            <Palette className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Your logo will appear here</p>
          </div>
        )}
        {loading && <LoadingSpinner />}
        {imageUrl && (
          <div className="relative group">
            <img src={imageUrl} alt="Generated Logo" className="w-full max-w-sm rounded-xl shadow-2xl border border-slate-700" />
            <a href={imageUrl} download="logo.png" className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const SongCreator = () => {
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('');
  const [result, setResult] = useState<{lyrics: string, audioBuffer: AudioBuffer} | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };
  }, []);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult(null);
    setIsPlaying(false);
    
    // Stop any currently playing audio
    if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
    }

    try {
      const data = await generateSong(topic, mood);
      setResult(data);
    } catch (e) {
      alert("Failed to create song");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!result?.audioBuffer) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    
    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = result.audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => setIsPlaying(false);
    source.start();
    sourceNodeRef.current = source;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      setIsPlaying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-panel p-6 rounded-2xl">
        <ToolHeader title="Song Creator" description="Generate lyrics and hear them performed." icon={Music} />
        <InputGroup label="Topic">
          <TextInput value={topic} onChange={setTopic} placeholder="e.g., Coding late at night" />
        </InputGroup>
        <InputGroup label="Mood/Genre">
          <TextInput value={mood} onChange={setMood} placeholder="e.g., Lo-fi, Melancholic, Rap" />
        </InputGroup>
        <Button onClick={handleGenerate} loading={loading} disabled={!topic} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20">
          Compose Song
        </Button>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center min-h-[300px]">
        {!result && !loading && (
          <div className="text-center text-slate-500">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Lyrics and audio will appear here</p>
          </div>
        )}
        {loading && <LoadingSpinner />}
        {result && (
          <div className="w-full max-w-md">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-6 max-h-60 overflow-y-auto">
              <p className="text-lg text-slate-300 font-mono text-center whitespace-pre-wrap">{result.lyrics}</p>
            </div>
            <button 
              onClick={isPlaying ? stopAudio : playAudio}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              {isPlaying ? <><Pause className="w-6 h-6"/> Stop Audio</> : <><Play className="w-6 h-6" /> Play Audio</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ThumbnailMaker = () => {
  const [title, setTitle] = useState('');
  const [vibe, setVibe] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const prompt = `A viral YouTube thumbnail for a video titled "${title}". Vibe: ${vibe}. High saturation, expressive, 16:9 aspect ratio, 4k quality.`;
      const url = await generateImage(prompt, "16:9");
      setImageUrl(url);
    } catch (e) {
      alert("Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-panel p-6 rounded-2xl">
        <ToolHeader title="Thumbnail Maker" description="Create click-worthy thumbnails instantly." icon={ImageIcon} />
        <InputGroup label="Video Title">
          <TextInput value={title} onChange={setTitle} placeholder="e.g., I Built a Robot Dog!" />
        </InputGroup>
        <InputGroup label="Vibe / Description">
          <TextArea value={vibe} onChange={setVibe} placeholder="e.g., Shocked face, bright red background, arrows pointing to robot" />
        </InputGroup>
        <Button onClick={handleGenerate} loading={loading} disabled={!title} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-lg shadow-orange-500/20">
          Design Thumbnail
        </Button>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex justify-center items-center min-h-[300px]">
        {!imageUrl && !loading && (
          <div className="text-center text-slate-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Thumbnail preview</p>
          </div>
        )}
        {loading && <LoadingSpinner />}
        {imageUrl && (
          <div className="relative group w-full">
            <img src={imageUrl} alt="Generated Thumbnail" className="w-full rounded-xl shadow-2xl border border-slate-700" />
            <a href={imageUrl} download="thumbnail.png" className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);

  const tools = [
    { id: ToolType.AD_CREATOR, name: 'Ad Creator', description: 'Generate viral ad scripts', icon: Megaphone, color: 'from-cyan-400 to-blue-500' },
    { id: ToolType.LOGO_MAKER, name: 'Logo Maker', description: 'Design pro brand logos', icon: Palette, color: 'from-purple-400 to-pink-500' },
    { id: ToolType.SONG_CREATOR, name: 'Song Created', description: 'Write & perform lyrics', icon: Music, color: 'from-emerald-400 to-teal-500' },
    { id: ToolType.THUMBNAIL_MAKER, name: 'Thumbnail', description: 'Make YouTube covers', icon: ImageIcon, color: 'from-orange-400 to-red-500' },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.AD_CREATOR: return <AdCreator />;
      case ToolType.LOGO_MAKER: return <LogoMaker />;
      case ToolType.SONG_CREATOR: return <SongCreator />;
      case ToolType.THUMBNAIL_MAKER: return <ThumbnailMaker />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTool(ToolType.HOME)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Aneeq<span className="text-cyan-400">Lab</span></span>
          </div>
          {activeTool !== ToolType.HOME && (
             <button 
               onClick={() => setActiveTool(ToolType.HOME)}
               className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
             >
               <Home className="w-4 h-4" /> Dashboard
             </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTool === ToolType.HOME ? (
          <div className="animate-fade-in">
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Create with <br className="sm:hidden" /> <span className="text-cyan-400">Intelligence.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Welcome to Aneeq Lab. The all-in-one AI creative suite for your digital content needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="group relative glass-panel p-6 rounded-2xl cursor-pointer hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 border-t border-white/5"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                  <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
                    <tool.icon className={`w-6 h-6 text-slate-300 group-hover:text-white`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">{tool.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center text-cyan-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                    Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
             {renderTool()}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-auto py-8 text-center text-slate-600">
        <p>© {new Date().getFullYear()} Aneeq Lab. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;