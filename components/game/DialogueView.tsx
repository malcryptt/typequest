"use client";

import { useGameStore } from "@/lib/game/store";
import { NPCS, getInitialDialogue } from "@/lib/game/dialogues";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

  // Typewriter effect
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
    }, 25);

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
    // Handle actions
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
          // Go to a practice level
          setGameState("worldMap");
          return;
        case "startQuest":
          // Quest tracking could be added here
          break;
      }
    }

    if (response.nextDialogueId) {
      setCurrentDialogueId(response.nextDialogueId);
    } else {
      // End conversation
      recordNpcInteraction(npcId);
      onClose();
    }
  };

  if (!npc || !currentDialogue) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-xl p-6 text-center">
          <p className="text-foreground">NPC not found</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center p-4 z-50">
      <div
        className="w-full max-w-4xl bg-gradient-to-b from-card to-card/95 border border-border rounded-t-2xl overflow-hidden shadow-2xl"
        onClick={handleSkipTyping}
      >
        {/* NPC Header */}
        <div className="bg-muted/50 px-6 py-4 flex items-center gap-4 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-4xl border-2 border-primary/30">
            {npc.portrait}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{npc.name}</h2>
            <p className="text-sm text-muted-foreground">
              {hasMetBefore ? "An old acquaintance" : "First meeting"}
            </p>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="px-6 py-6 min-h-[120px]">
          <p className="text-lg text-foreground leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* Response Options */}
        <div className="px-6 pb-6 space-y-2">
          {showResponses &&
            currentDialogue.responses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleResponse(response)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-all",
                  "bg-muted/30 border-border hover:bg-primary/20 hover:border-primary/50",
                  "text-foreground hover:text-primary"
                )}
              >
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                {response.text}
                {response.action?.type === "giveItem" && (
                  <span className="ml-2 text-xs text-amber-400">
                    (Receive item)
                  </span>
                )}
                {response.action?.type === "openShop" && (
                  <span className="ml-2 text-xs text-primary">
                    (Open shop)
                  </span>
                )}
              </button>
            ))}

          {!showResponses && (
            <p className="text-center text-muted-foreground text-sm">
              Click to skip...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// NPC Component for World Map
export function NPCMarker({
  npcId,
  position,
  onClick,
}: {
  npcId: string;
  position: { x: number; y: number };
  onClick: () => void;
}) {
  const npc = NPCS[npcId];
  const { npcInteractions } = useGameStore();
  const hasNewDialogue = !npcInteractions[npcId];

  if (!npc) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2",
        "w-12 h-12 rounded-full flex items-center justify-center",
        "bg-card border-2 border-primary/50 shadow-lg",
        "hover:scale-110 hover:border-primary transition-all",
        "text-2xl"
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {npc.portrait}
      {hasNewDialogue && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse" />
      )}
    </button>
  );
}

// Hub area with NPCs
export function TownHubView() {
  const [activeNpc, setActiveNpc] = useState<string | null>(null);
  const { setGameState, player } = useGameStore();

  const npcs = [
    { id: "elder_oak", position: { x: 50, y: 30 } },
    { id: "blacksmith_forge", position: { x: 25, y: 50 } },
    { id: "mysterious_sage", position: { x: 75, y: 45 } },
    { id: "tavern_keeper", position: { x: 40, y: 65 } },
    { id: "training_dummy", position: { x: 60, y: 70 } },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Starter Village</h1>
          <p className="text-muted-foreground text-sm">
            {player?.name} - Level {player?.level}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setGameState("inventory")}>
            Inventory
          </Button>
          <Button variant="outline" onClick={() => setGameState("worldMap")}>
            World Map
          </Button>
        </div>
      </header>

      {/* Town Area */}
      <div className="relative mx-auto max-w-4xl h-[600px] mt-8">
        {/* Ground/Path decoration */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-amber-900/10 to-transparent rounded-t-full" />
        
        {/* Buildings/Areas Labels */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded">Town Square</span>
        </div>
        <div className="absolute top-[45%] left-[15%] text-center">
          <span className="text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded">Blacksmith</span>
        </div>
        <div className="absolute top-[40%] right-[15%] text-center">
          <span className="text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded">Sage Tower</span>
        </div>
        <div className="absolute top-[58%] left-[30%] text-center">
          <span className="text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded">Tavern</span>
        </div>
        <div className="absolute top-[63%] right-[30%] text-center">
          <span className="text-xs text-muted-foreground bg-card/50 px-2 py-1 rounded">Training Grounds</span>
        </div>

        {/* NPCs */}
        {npcs.map((npc) => (
          <NPCMarker
            key={npc.id}
            npcId={npc.id}
            position={npc.position}
            onClick={() => setActiveNpc(npc.id)}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-sm">
          Click on characters to interact with them
        </p>
      </div>

      {/* Active Dialogue */}
      {activeNpc && (
        <DialogueView npcId={activeNpc} onClose={() => setActiveNpc(null)} />
      )}
    </div>
  );
}
