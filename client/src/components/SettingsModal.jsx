import React from 'react';
import { X, Key, ShieldCheck, CheckCircle2, HelpCircle, ExternalLink, Zap } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, hasApiKey }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-brand-elevated border border-white/10 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/30 flex items-center justify-center text-brand-green">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">YouTube Integration & Settings</h3>
            <p className="text-xs text-brand-subtext">VibeFree Architecture & YouTube Data API v3</p>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-xl bg-brand-highlight/60 border border-white/10 mb-6 flex items-start space-x-3.5">
          {hasApiKey ? (
            <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
          ) : (
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <p className="font-bold text-white text-sm">
              Status: {hasApiKey ? 'YouTube Data API v3 Active' : 'Curated Fallback Mode Active'}
            </p>
            <p className="text-zinc-300 leading-relaxed">
              {hasApiKey
                ? 'Your YouTube API key is active! Live searches and trending music are requested directly from YouTube Data API v3 with automatic server-side caching.'
                : 'VibeFree is currently running with the built-in curated music database of top verified YouTube tracks. You can search, browse genres, and stream music immediately.'}
            </p>
          </div>
        </div>

        {/* Step-by-step instructions to add API key */}
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>How to add your free YouTube Data API v3 Key:</span>
          </h4>

          <ol className="list-decimal list-inside space-y-2 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[11px]">
            <li>
              Go to{' '}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-green hover:underline inline-flex items-center"
              >
                Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>Create a new project (e.g. <code>VibeFree Music</code>)</li>
            <li>In <strong>APIs & Services</strong> &gt; <strong>Library</strong>, search for <strong>YouTube Data API v3</strong> and click <strong>Enable</strong></li>
            <li>Go to <strong>Credentials</strong> &gt; <strong>Create Credentials</strong> &gt; <strong>API Key</strong></li>
            <li>
              Open your project's root <code>.env</code> file (or <code>server/.env</code>) and add:
              <div className="mt-1.5 p-2 bg-zinc-900 rounded border border-white/10 text-brand-neon select-all font-mono">
                YOUTUBE_API_KEY=your_copied_api_key_here
              </div>
            </li>
            <li>Restart the backend server (<code>npm run dev</code>)</li>
          </ol>

          {/* YouTube Policy & Terms of Service Compliance */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>YouTube Terms of Service Compliance</span>
            </h4>
            <p className="text-zinc-400">
              VibeFree adheres 100% to YouTube API developer policies:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Uses the official YouTube IFrame Player API for video playback.</li>
              <li>No extraction, downloading, or separation of audio streams.</li>
              <li>Does not bypass ads or restrictions imposed by content owners.</li>
              <li>Official YouTube player view is accessible anytime via the TV icon or bottom player.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
