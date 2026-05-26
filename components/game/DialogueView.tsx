"use client";

import { useGameStore } from "@/lib/game/store";
import { NPCS, getInitialDialogue } from "@/lib/game/dialogues";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogueViewProps {
  npcId: string;
  onClose: () => void;
}

export function DialogueView({ npcId, onClose }: DialogueViewProps) {
  const { npcInteractions, recordNpcInteraction, addItem, setGameState } = useGameStore();
  const [currentDialogueId, setCurrentDialogueId] = useState<string>("intro");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showResponses, setShowResponses] = useState(false);

  const npc = NPCS[npcId];
  const hasMetBefore = npcInteractions[npcId] > 0;

  useEffect(() => {
    const initialDialogue = getInitialDialogue(npcId, hasMetBefore);
    setCurrentDialogueId(initialDialogue);
  }, [npcId, hasMetBefore]);

  const currentDialogue = npc?.dialogues[currentDialogueId];

  useEffect(() => {
    if (!currentDialogue) return;
    setDisplayedText("");
    setIsTyping(true);
    setShowResponses(false);

    let index = 0;
    const text = currentDialogue.text;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setShowResponses(true);
        clearInterval(interval);
      }
    }, 20); // slightly faster typing

    return () => clearInterval(interval);
  }, [currentDialogue]);

  const handleSkipTyping = () => {
    if (isTyping && currentDialogue) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      setShowResponses(true);
    }
  };

  const handleResponse = (response: {
    text: string;
    nextDialogueId: string | null;
    action?: { type: string; itemId?: string; quantity?: number; questId?: string };
  }) => {
    if (response.action) {
      switch (response.action.type) {
        case "giveItem":
          if (response.action.itemId && response.action.quantity) {
            addItem(response.action.itemId, response.action.quantity);
          }
          break;
        case "openShop":
          recordNpcInteraction(npcId);
          setGameState("shop");
          return;
        case "startPractice":
          recordNpcInteraction(npcId);
          setGameState("worldMap");
          return;
      }
    }

    if (response.nextDialogueId) {
      setCurrentDialogueId(response.nextDialogueId);
    } else {
      recordNpcInteraction(npcId);
      onClose();
    }
  };

  if (!npc || !currentDialogue) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Dim backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkipTyping} />

      {/* Dialogue Window */}
      <motion.div className="relative w-full max-w-4xl z-10 flex flex-col"
        initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "20%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{
          background: "oklch(0.12 0.04 280 / 0.95)",
          border: "1px solid oklch(0.28 0.08 280 / 0.6)",
          borderBottom: "none",
          borderRadius: "32px 32px 0 0",
          backdropFilter: "blur(24px)",
          boxShadow: "0 -20px 80px oklch(0.05 0.04 280 / 0.8)",
        }}
        onClick={handleSkipTyping}>

        {/* Glow effect matching NPC */}
        <div className="absolute top-0 left-12 w-64 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ background: "oklch(0.55 0.18 145)" }} />

        {/* NPC Header */}
        <div className="flex items-center gap-5 px-8 pt-6 pb-4" style={{ borderBottom: "1px solid oklch(0.3 0.06 280 / 0.3)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{
              background: "oklch(0.16 0.04 280 / 0.8)",
              border: "1px solid oklch(0.35 0.08 280)",
              boxShadow: "0 0 20px oklch(0.35 0.08 280 / 0.3)"
            }}>
            {npc.portrait}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{npc.name}</h2>
            <p className="text-sm font-medium" style={{ color: "oklch(0.7 0.12 145)" }}>
              {hasMetBefore ? "An old acquaintance" : "First meeting"}
            </p>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="px-10 py-6 min-h-[140px] flex items-start text-lg leading-relaxed text-foreground">
          <p>{displayedText}{isTyping && <span className="animate-pulse">_</span>}</p>
        </div>

        {/* Responses Area */}
        <div className="px-8 pb-8 space-y-3">
          <AnimatePresence>
            {showResponses ? (
              currentDialogue.responses.map((response: any, index: number) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={(e) => { e.stopPropagation(); handleResponse(response); }}
                  className="w-full text-left px-5 py-3.5 rounded-xl transition-all group flex items-center gap-3"
                  style={{ background: "oklch(0.15 0.04 280 / 0.6)", border: "1px solid oklch(0.3 0.06 280 / 0.5)" }}
                  whileHover={{ scale: 1.01, background: "oklch(0.2 0.06 280 / 0.8)", borderColor: "oklch(0.4 0.1 280)" }}
                  whileTap={{ scale: 0.98 }}>
                  <MessageSquareText size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="flex-1 text-foreground font-medium">{response.text}</span>
                  {response.action?.type === "giveItem" && <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded">Gain Item</span>}
                  {response.action?.type === "openShop" && <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-1 rounded">Open Shop</span>}
                </motion.button>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2 animate-pulse mt-4">
                Click anywhere to skip
              </p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NPCMarker({ npcId, position, onClick }: { npcId: string; position: { x: number; y: number }; onClick: () => void; }) {
  const npc = NPCS[npcId];
  const { npcInteractions } = useGameStore();
  const hasNewDialogue = !npcInteractions[npcId];

  if (!npc) return null;

  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.95 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-3xl"
      style={{
        left: `${position.x}%`, top: `${position.y}%`,
        background: "oklch(0.14 0.04 280 / 0.9)",
        border: hasNewDialogue ? "2px solid oklch(0.6 0.22 45)" : "1px solid oklch(0.3 0.06 280)",
        boxShadow: hasNewDialogue ? "0 0 24px oklch(0.6 0.22 45 / 0.5)" : "0 4px 12px rgba(0,0,0,0.5)"
      }}>
      {npc.portrait}
      {hasNewDialogue && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-bounce" style={{ background: "oklch(0.7 0.22 45)" }} />
      )}
    </motion.button>
  );
}

export function TownHubView() {
  const [activeNpc, setActiveNpc] = useState<string | null>(null);
  const { setGameState, player } = useGameStore();

  const npcs = [
    { id: "elder_oak", position: { x: 50, y: 35 }, label: "Town Square" },
    { id: "blacksmith_forge", position: { x: 25, y: 55 }, label: "Blacksmith" },
    { id: "mysterious_sage", position: { x: 75, y: 50 }, label: "Sage Tower" },
    { id: "tavern_keeper", position: { x: 40, y: 70 }, label: "Tavern" },
    { id: "training_dummy", position: { x: 65, y: 75 }, label: "Training" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "oklch(0.08 0.04 280)" }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: "oklch(0.55 0.18 145)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15" style={{ background: "oklch(0.55 0.15 45)" }} />

        {/* Soft ground gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30" style={{ background: "linear-gradient(to top, oklch(0.12 0.08 145), transparent)" }} />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "oklch(0.1 0.04 280 / 0.8)", borderBottom: "1px solid oklch(0.25 0.06 280 / 0.4)", backdropFilter: "blur(16px)" }}>
        <button onClick={() => setGameState("worldMap")} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" style={{ background: "oklch(0.16 0.04 280 / 0.6)" }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Starter Village</h1>
          <p className="text-xs text-muted-foreground">{player?.name} · Lv.{player?.level}</p>
        </div>
      </div>

      {/* Town Area */}
      <div className="relative flex-1 max-w-5xl mx-auto w-full flex items-center justify-center mt-12 mb-20 z-10">
        <div className="relative w-full h-[600px]">
          {/* NPC Nodes */}
          {npcs.map((npc) => (
            <div key={npc.id}>
              <div className="absolute text-center" style={{ left: `${npc.position.x}%`, top: `${npc.position.y - 10}%`, transform: "translateX(-50%)" }}>
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(0.12 0.04 280 / 0.8)", border: "1px solid oklch(0.25 0.06 280 / 0.5)", color: "oklch(0.6 0.08 280)" }}>
                  {npc.label}
                </span>
              </div>
              <NPCMarker npcId={npc.id} position={npc.position} onClick={() => setActiveNpc(npc.id)} />
            </div>
          ))}
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide uppercase opacity-40 z-10" style={{ color: "oklch(0.8 0.05 280)" }}>
        Tap characters to interact
      </p>

      {/* Active Dialogue */}
      <AnimatePresence>
        {activeNpc && <DialogueView npcId={activeNpc} onClose={() => setActiveNpc(null)} />}
      </AnimatePresence>
    </div>
  );
}
