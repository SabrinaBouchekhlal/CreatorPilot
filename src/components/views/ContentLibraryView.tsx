import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentLibraryItem } from '../../types';
import { 
  FolderArchive, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  BookmarkCheck,
  FileText,
  UserCheck,
  Compass,
  Package
} from 'lucide-react';

export const ContentLibraryView: React.FC = () => {
  const { library, saveLibraryItem, deleteLibraryItem, openGenerator, t, showToast, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = library.filter(item => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.title.toLowerCase().includes(q) || 
                    item.content.toLowerCase().includes(q) ||
                    item.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(t.common.copied, 'success');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return <FileText className="w-3.5 h-3.5 text-[#FF5A6E]" />;
      case 'bio': return <UserCheck className="w-3.5 h-3.5 text-[#7BE0C3]" />;
      case 'strategy': return <Compass className="w-3.5 h-3.5 text-[#1B2650]" />;
      case 'digital_product': return <Package className="w-3.5 h-3.5 text-amber-600" />;
      default: return <BookmarkCheck className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.contentLibrary.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.contentLibrary.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGenerator('ideas')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7BE0C3]" />
            <span>
              {language === 'ar' ? 'توليد مسودة جديدة' : language === 'fr' ? 'Générer un brouillon' : 'Generate a new draft'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.contentLibrary.searchLibrary}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          >
            <option value="all">{t.contentLibrary.allTypes}</option>
            <option value="script">{t.contentLibrary.scripts}</option>
            <option value="bio">{t.contentLibrary.bios}</option>
            <option value="strategy">{t.contentLibrary.strategies}</option>
            <option value="digital_product">{t.contentLibrary.digitalProducts}</option>
          </select>
        </div>
      </div>

      {/* Library Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
            {t.contentLibrary.emptyLibrary}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    {getTypeIcon(item.type)}
                    <span>{t.contentLibrary[item.type as keyof typeof t.contentLibrary] || item.type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, item.content)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      title={t.common.copy}
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteLibraryItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#0E1633] leading-snug">
                  {item.title}
                </h3>

                <pre className="p-3 bg-slate-50 rounded-lg text-xs font-sans whitespace-pre-line text-slate-700 leading-relaxed max-h-48 overflow-y-auto border border-slate-100">
                  {item.content}
                </pre>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono tabular-nums">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
