"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/store";
import { ITEMS, getRarityColor } from "@/lib/game/items";
import { Zap, Shield, Target, Clock, Star, Coins, Trophy, RefreshCw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Rarity label/color helper
const rarityLabel: Record<string, string> = {
    common: "COMMON", uncommon: "UNCOMMON", rare: "RARE", epic: "EPIC", legendary: "LEGENDARY",
};

// Reusable animated counter
function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(timer); }
            else setVal(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return <span>{val.toLocaleString()}</span>;
}

// XP orb icon
function XpOrb() {
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "radial-gradient(circle, oklch(0.7 0.18 280), oklch(0.4 0.12 280))", boxShadow: "0 0 16px oklch(0.65 0.18 280 / 0.8)" }}>
            XP
        </div>
    );
}

export function VictoryScreen() {
    const { gameState, setGameState, combat, currentLevel, player, completeLevel, addExperience, addGold, addItem } = useGameStore();

    const isBoss = currentLevel?.name?.toLowerCase().includes("boss") ?? false;
    const wpmAchieved = combat.wpm;
    const wpmRequired = 40;
    const accuracy = combat.accuracy;
    const wordsTotal = combat.totalCharsTyped > 0 ? Math.round(combat.totalCharsTyped / 5) : 0;
    const timeTaken = combat.startTime ? Math.floor((Date.now() - combat.startTime) / 1000) : 0;

    // Star criteria
    const speedStar = wpmAchieved >= wpmRequired * 1.3;
    const accuracyStar = accuracy >= 90;
    const noMissStar = accuracy >= 98;
    const stars = [speedStar, accuracyStar, noMissStar].filter(Boolean).length;

    // Rewards
    const goldEarned = 100 + stars * 50 + (isBoss ? 200 : 0);
    const xpEarned = 150 + stars * 75 + (isBoss ? 300 : 0);
    const itemDrop = isBoss && currentLevel?.rewards?.items?.[0]
        ? ITEMS[currentLevel.rewards.items[0]]
        : null;

    const [phase, setPhase] = useState<"title" | "stats" | "stars" | "rewards">("title");
    const [starsRevealed, setStarsRevealed] = useState(0);
    const [rewardsApplied, setRewardsApplied] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("stats"), 600);
        const t2 = setTimeout(() => setPhase("stars"), 1400);
        const t3 = setTimeout(() => setStarsRevealed(1), 2000);
        const t4 = setTimeout(() => setStarsRevealed(2), 2500);
        const t5 = setTimeout(() => setStarsRevealed(3), 3000);
        const t6 = setTimeout(() => setPhase("rewards"), 3600);
        return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    }, []);

    const handleContinue = () => {
        if (!rewardsApplied) {
            setRewardsApplied(true);
            addGold(goldEarned);
            addExperience(xpEarned);
            if (currentLevel) completeLevel(currentLevel.id, stars);
            if (itemDrop) addItem(itemDrop.id);
        }
        setGameState("worldMap");
    };

    const handleRetry = () => {
        if (currentLevel) {
            useGameStore.getState().startCombat(currentLevel.id);
        }
    };

    const fmt = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-start overflow-y-auto"
            style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.25 0.1 280 / 0.9) 0%, oklch(0.08 0.04 280) 70%)" }}>

            {/* Particle glow behind victory text */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div key={i} className="absolute w-1 h-1 rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, background: "oklch(0.75 0.18 280)" }}
                        animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 3 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }} />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center gap-6">

                {/* Victory Title */}
                <motion.div className="text-center"
                    initial={{ opacity: 0, y: -40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}>
                    <h1 className="text-6xl md:text-8xl font-black tracking-wider uppercase"
                        style={{ background: "linear-gradient(to bottom, #fff 20%, oklch(0.75 0.18 280))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px oklch(0.65 0.2 280))" }}>
                        {isBoss ? "BOSS DEFEATED" : "VICTORY"}
                    </h1>
                    <p className="text-muted-foreground text-lg mt-2 tracking-widest">
                        {currentLevel?.name ?? "Stage Complete"}
                    </p>
                </motion.div>

                {/* Stats Panel */}
                <AnimatePresence>
                    {(phase === "stats" || phase === "stars" || phase === "rewards") && (
                        <motion.div className="w-full rounded-2xl p-5 grid grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                            style={{ background: "oklch(0.14 0.04 280 / 0.8)", border: "1px solid oklch(0.35 0.08 280 / 0.6)", backdropFilter: "blur(16px)" }}>
                            {[
                                { icon: <Zap size={18} />, label: isBoss ? "WPM vs Required" : "WPM Achieved", value: isBoss ? `${wpmAchieved} vs ${wpmRequired}` : wpmAchieved.toString(), color: "oklch(0.7 0.18 280)" },
                                { icon: <Target size={18} />, label: "Accuracy", value: `${accuracy}%`, color: accuracy >= 90 ? "oklch(0.7 0.2 145)" : "oklch(0.6 0.22 25)" },
                                { icon: <Shield size={18} />, label: "Words Typed", value: wordsTotal.toString(), color: "oklch(0.75 0.15 60)" },
                                { icon: <Clock size={18} />, label: "Time Taken", value: fmt(timeTaken), color: "oklch(0.65 0.1 280)" },
                            ].map(({ icon, label, value, color }) => (
                                <div key={label} className="flex items-center gap-3 rounded-xl p-3"
                                    style={{ background: "oklch(0.1 0.04 280 / 0.6)" }}>
                                    <span style={{ color }}>{icon}</span>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                                        <p className="text-xl font-bold text-foreground">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stars */}
                <AnimatePresence>
                    {(phase === "stars" || phase === "rewards") && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                            <div className="flex items-end gap-6">
                                {[
                                    { earned: speedStar, label: "Speed", delay: 0 },
                                    { earned: accuracyStar, label: "Accuracy", delay: 0.45 },
                                    { earned: noMissStar, label: "No Miss", delay: 0.9 },
                                ].map(({ earned, label, delay }, i) => (
                                    <motion.div key={label} className="flex flex-col items-center gap-2"
                                        initial={{ scale: 0, rotate: -30 }} animate={starsRevealed > i ? { scale: 1, rotate: 0 } : { scale: 0.3, rotate: -30 }}
                                        transition={{ delay, type: "spring", stiffness: 300, damping: 12 }}>
                                        <motion.div animate={starsRevealed > i && earned ? { scale: [1, 1.3, 1] } : {}}
                                            transition={{ delay: delay + 0.1, duration: 0.4 }}>
                                            <Star size={52} className={cn("transition-all duration-300", earned && starsRevealed > i ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")}
                                                style={earned && starsRevealed > i ? { filter: "drop-shadow(0 0 16px #facc15)" } : {}} />
                                        </motion.div>
                                        <span className="text-xs text-muted-foreground tracking-widest uppercase">{label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Rewards */}
                <AnimatePresence>
                    {phase === "rewards" && (
                        <motion.div className="w-full rounded-2xl p-5"
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            style={{ background: "oklch(0.14 0.04 280 / 0.8)", border: "1px solid oklch(0.35 0.08 280 / 0.6)", backdropFilter: "blur(16px)" }}>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 text-center">Rewards</p>
                            <div className="flex items-center justify-center gap-8 flex-wrap">
                                {/* Coins */}
                                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                                    className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ background: "radial-gradient(circle, oklch(0.8 0.18 85), oklch(0.55 0.15 85))", boxShadow: "0 0 20px oklch(0.75 0.18 85 / 0.6)" }}>
                                        <Coins size={20} className="text-white" />
                                    </div>
                                    <p className="text-lg font-bold text-yellow-400">+<Counter target={goldEarned} /></p>
                                    <p className="text-xs text-muted-foreground">Coins</p>
                                </motion.div>

                                {/* XP */}
                                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                                    className="flex flex-col items-center gap-2">
                                    <XpOrb />
                                    <p className="text-lg font-bold" style={{ color: "oklch(0.7 0.18 280)" }}>+<Counter target={xpEarned} /></p>
                                    <p className="text-xs text-muted-foreground">XP</p>
                                </motion.div>

                                {/* Item drop */}
                                {itemDrop && (
                                    <motion.div initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
                                        className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-20 rounded-xl flex flex-col items-center justify-center p-2 text-center"
                                            style={{ background: "oklch(0.1 0.04 280)", border: `2px solid ${getRarityColor(itemDrop.rarity)}`, boxShadow: `0 0 24px ${getRarityColor(itemDrop.rarity)}66` }}>
                                            <Trophy size={24} style={{ color: getRarityColor(itemDrop.rarity) }} />
                                            <p className="text-xs mt-1 font-semibold text-foreground leading-tight">{itemDrop.name}</p>
                                        </div>
                                        <p className="text-xs font-bold uppercase" style={{ color: getRarityColor(itemDrop.rarity) }}>{rarityLabel[itemDrop.rarity]}</p>
                                    </motion.div>
                                )}

                                {/* Boss key */}
                                {isBoss && (
                                    <motion.div initial={{ opacity: 0, rotate: -180, scale: 0 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
                                        className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                            style={{ background: "radial-gradient(circle, oklch(0.75 0.18 280), oklch(0.45 0.12 280))", boxShadow: "0 0 20px oklch(0.65 0.18 280 / 0.8)" }}>
                                            🗝️
                                        </div>
                                        <p className="text-xs text-muted-foreground">Region Key</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buttons */}
                {phase === "rewards" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="flex gap-4 w-full max-w-sm">
                        <button onClick={handleRetry}
                            className="flex-1 h-14 rounded-xl border-2 border-border text-muted-foreground font-semibold flex items-center justify-center gap-2 hover:border-primary/50 hover:text-foreground transition-all"
                            style={{ background: "oklch(0.14 0.04 280 / 0.6)", backdropFilter: "blur(8px)" }}>
                            <RefreshCw size={16} /> Retry
                        </button>
                        <motion.button onClick={handleContinue}
                            className="flex-[2] h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                            style={{ background: "linear-gradient(135deg, oklch(0.55 0.2 280), oklch(0.45 0.18 300))", boxShadow: isBoss ? "0 0 30px oklch(0.55 0.2 280 / 0.8)" : "0 4px 20px oklch(0.45 0.15 280 / 0.5)" }}
                            animate={isBoss ? { boxShadow: ["0 0 20px oklch(0.55 0.2 280 / 0.6)", "0 0 40px oklch(0.65 0.2 280 / 0.9)", "0 0 20px oklch(0.55 0.2 280 / 0.6)"] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}>
                            Continue <ChevronRight size={20} />
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
