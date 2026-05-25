import { NPC } from "./types";

export const NPCS: Record<string, NPC> = {
  elder_oak: {
    id: "elder_oak",
    name: "Elder Oak",
    portrait: "🧙‍♂️",
    dialogues: {
      intro: {
        id: "intro",
        text: "Ah, a new traveler! Welcome to Verdant Vale. I am Elder Oak, keeper of ancient wisdom. These lands were once peaceful, but darkness spreads from the mountains...",
        responses: [
          { text: "What darkness do you speak of?", nextDialogueId: "darkness_explained" },
          { text: "How can I help?", nextDialogueId: "quest_offer" },
          { text: "I should go.", nextDialogueId: null },
        ],
      },
      darkness_explained: {
        id: "darkness_explained",
        text: "An ancient evil stirs in Dragon's Peak. Dark creatures now roam our lands - goblins, wolves corrupted by shadow, and worse. The old barriers weaken daily.",
        responses: [
          { text: "How can I stop this?", nextDialogueId: "quest_offer" },
          { text: "That sounds dangerous...", nextDialogueId: "encouragement" },
        ],
      },
      quest_offer: {
        id: "quest_offer",
        text: "Your typing skills... I sense great power in them. Each word you type channels magical energy. Master this gift, defeat the creatures, and perhaps you can reach Dragon's Peak to seal the darkness forever.",
        responses: [
          { text: "I accept this quest!", nextDialogueId: "quest_accepted", action: { type: "startQuest", questId: "main_quest" } },
          { text: "Tell me more about typing magic.", nextDialogueId: "typing_explained" },
        ],
      },
      typing_explained: {
        id: "typing_explained",
        text: "In our world, the speed and accuracy of your words become power. Type swiftly to strike faster. Type accurately to deal critical blows. But beware - mistakes will leave you vulnerable!",
        responses: [
          { text: "I understand. I'm ready!", nextDialogueId: "quest_accepted", action: { type: "startQuest", questId: "main_quest" } },
          { text: "I need more practice first.", nextDialogueId: "practice_advice" },
        ],
      },
      practice_advice: {
        id: "practice_advice",
        text: "Wise decision. Start with the Forest Trail - the creatures there are weak but good for training. Return when you've honed your skills!",
        responses: [
          { text: "Thank you, Elder.", nextDialogueId: null },
        ],
      },
      encouragement: {
        id: "encouragement",
        text: "Fear not, young one. Every great hero started somewhere. Your fingers hold more power than any sword. Trust in your abilities!",
        responses: [
          { text: "You're right. I'll try!", nextDialogueId: "quest_offer" },
          { text: "I'm not sure I'm ready...", nextDialogueId: "practice_advice" },
        ],
      },
      quest_accepted: {
        id: "quest_accepted",
        text: "Excellent! Your courage honors us all. Take this health potion - you'll need it. May your fingers be swift and your words true!",
        responses: [
          { text: "Thank you, Elder Oak!", nextDialogueId: null, action: { type: "giveItem", itemId: "health_potion", quantity: 3 } },
        ],
      },
      returning: {
        id: "returning",
        text: "Welcome back, hero! Your legend grows with each battle. How may I assist you today?",
        responses: [
          { text: "Tell me about the regions ahead.", nextDialogueId: "regions_info" },
          { text: "Do you have any advice?", nextDialogueId: "combat_tips" },
          { text: "Just passing through.", nextDialogueId: null },
        ],
      },
      regions_info: {
        id: "regions_info",
        text: "Beyond our vale lies the Mystic Forest, shrouded in ancient magic. Further still are the Frozen Peaks, the Volcanic Wastes, and finally... Dragon's Peak itself.",
        responses: [
          { text: "What enemies await there?", nextDialogueId: "enemy_warning" },
          { text: "Thank you for the information.", nextDialogueId: null },
        ],
      },
      enemy_warning: {
        id: "enemy_warning",
        text: "Each region holds fiercer foes. Forest spirits test your speed. Ice wraiths punish hesitation. Fire demons... well, pray you type faster than they burn.",
        responses: [
          { text: "I won't back down!", nextDialogueId: null },
          { text: "Any tips for surviving?", nextDialogueId: "combat_tips" },
        ],
      },
      combat_tips: {
        id: "combat_tips",
        text: "Remember: accuracy builds your combo meter. High combos mean devastating attacks! Also, some enemies telegraph their moves - watch for their patterns.",
        responses: [
          { text: "I'll keep that in mind.", nextDialogueId: null },
        ],
      },
    },
  },
  
  blacksmith_forge: {
    id: "blacksmith_forge",
    name: "Forge the Blacksmith",
    portrait: "⚒️",
    dialogues: {
      intro: {
        id: "intro",
        text: "*CLANG CLANG* Oh! A customer! Name's Forge. I craft the finest weapons and armor in all the realms. Need something to help ya type... er, fight better?",
        responses: [
          { text: "Show me your wares!", nextDialogueId: null, action: { type: "openShop" } },
          { text: "Tell me about your craft.", nextDialogueId: "craft_story" },
          { text: "Maybe later.", nextDialogueId: null },
        ],
      },
      craft_story: {
        id: "craft_story",
        text: "Every weapon I make is infused with Word Magic. A good sword doesn't just cut - it amplifies your typing power! Higher attack means each correct word hits harder.",
        responses: [
          { text: "Interesting! Let me see your shop.", nextDialogueId: null, action: { type: "openShop" } },
          { text: "What about armor?", nextDialogueId: "armor_explained" },
        ],
      },
      armor_explained: {
        id: "armor_explained",
        text: "Armor's just as important! Good armor reduces damage from your typing mistakes. Nobody's perfect, right? Better gear means you can survive more errors.",
        responses: [
          { text: "Makes sense! Show me everything.", nextDialogueId: null, action: { type: "openShop" } },
        ],
      },
      returning: {
        id: "returning",
        text: "*CLANG* Back again? I've got new stock! Found some rare materials from adventurers. Take a look!",
        responses: [
          { text: "Let's see what you've got.", nextDialogueId: null, action: { type: "openShop" } },
          { text: "Just browsing for now.", nextDialogueId: null },
        ],
      },
    },
  },

  mysterious_sage: {
    id: "mysterious_sage",
    name: "The Sage",
    portrait: "🔮",
    dialogues: {
      intro: {
        id: "intro",
        text: "...*stares into crystal ball*... I foresaw your arrival. The one whose fingers dance across keys like lightning. You seek the Dragon of Shadows.",
        responses: [
          { text: "How do you know about me?", nextDialogueId: "prophecy" },
          { text: "What can you tell me about the Dragon?", nextDialogueId: "dragon_lore" },
          { text: "This is creepy. Goodbye.", nextDialogueId: null },
        ],
      },
      prophecy: {
        id: "prophecy",
        text: "The ancient texts speak of a warrior who wields words as weapons. 'When darkness rises from the peak, the Swift Typer shall strike!' That warrior... is you.",
        responses: [
          { text: "The Swift Typer? Really?", nextDialogueId: "title_explained" },
          { text: "What must I do?", nextDialogueId: "instructions" },
        ],
      },
      title_explained: {
        id: "title_explained",
        text: "Every keystroke you make ripples through reality. Speed determines your power. Accuracy shapes your destiny. You are more than a mere typist - you are a Word Warrior!",
        responses: [
          { text: "I'm ready to embrace my destiny.", nextDialogueId: "blessing", action: { type: "giveItem", itemId: "mana_potion", quantity: 2 } },
        ],
      },
      dragon_lore: {
        id: "dragon_lore",
        text: "The Shadow Dragon was once a guardian, corrupted by an ancient curse. It speaks in darkness - words that drain hope. Only one who masters all typing arts can defeat it.",
        responses: [
          { text: "How do I master these arts?", nextDialogueId: "instructions" },
          { text: "I will find a way.", nextDialogueId: null },
        ],
      },
      instructions: {
        id: "instructions",
        text: "Journey through all five realms. Defeat their champions. Collect the ancient relics. Only then will you have the power to face the Dragon.",
        responses: [
          { text: "I understand. Thank you, Sage.", nextDialogueId: "blessing", action: { type: "giveItem", itemId: "mana_potion", quantity: 2 } },
        ],
      },
      blessing: {
        id: "blessing",
        text: "*waves hands mysteriously* I grant you mana potions for your journey. May your words strike true, Word Warrior. We shall meet again... at the end.",
        responses: [
          { text: "Until then, Sage.", nextDialogueId: null },
        ],
      },
      returning: {
        id: "returning",
        text: "*gazes into crystal* Your progress impresses the stars themselves. The Dragon grows restless... it senses you approaching.",
        responses: [
          { text: "I'm getting stronger every day.", nextDialogueId: "encouragement" },
          { text: "Am I ready to face it?", nextDialogueId: "readiness_check" },
        ],
      },
      encouragement: {
        id: "encouragement",
        text: "Indeed you are. Your WPM increases, your accuracy sharpens. Continue this path, and nothing shall stop you.",
        responses: [
          { text: "Thank you for the encouragement.", nextDialogueId: null },
        ],
      },
      readiness_check: {
        id: "readiness_check",
        text: "*peers into crystal* ...Not yet. The Dragon requires speed beyond 80 WPM and accuracy above 95%. Train more. The time will come.",
        responses: [
          { text: "I'll keep practicing.", nextDialogueId: null },
        ],
      },
    },
  },

  tavern_keeper: {
    id: "tavern_keeper",
    name: "Mira the Innkeeper",
    portrait: "🍺",
    dialogues: {
      intro: {
        id: "intro",
        text: "Welcome to the Weary Typer's Rest! Best ale and gossip in all the realms. What brings you to my humble tavern?",
        responses: [
          { text: "What news do you have?", nextDialogueId: "tavern_gossip" },
          { text: "I need rest and supplies.", nextDialogueId: "rest_offer" },
          { text: "Just looking around.", nextDialogueId: null },
        ],
      },
      tavern_gossip: {
        id: "tavern_gossip",
        text: "Word is, the creatures are getting more aggressive. Adventurers say the words they must type are getting longer, harder. Something's stirring them up...",
        responses: [
          { text: "Longer words? That is concerning.", nextDialogueId: "difficulty_warning" },
          { text: "I can handle anything!", nextDialogueId: "bravado_response" },
        ],
      },
      difficulty_warning: {
        id: "difficulty_warning",
        text: "Aye, the further you travel, the more complex the language becomes. I heard the Frozen Peaks require knowledge of advanced vocabulary. Best brush up on your words!",
        responses: [
          { text: "Thanks for the warning.", nextDialogueId: "rest_offer" },
        ],
      },
      bravado_response: {
        id: "bravado_response",
        text: "*laughs heartily* I like your spirit! But don't let overconfidence be your downfall. Many a fast typer has fallen to a single mistyped letter.",
        responses: [
          { text: "Point taken. I'll be careful.", nextDialogueId: "rest_offer" },
        ],
      },
      rest_offer: {
        id: "rest_offer",
        text: "If you need healing, I've got potions. If you need encouragement, I've got ale. Either way, rest those fingers - you'll need them sharp!",
        responses: [
          { text: "I'll take some potions!", nextDialogueId: null, action: { type: "giveItem", itemId: "health_potion", quantity: 1 } },
          { text: "Just the encouragement, thanks.", nextDialogueId: null },
        ],
      },
      returning: {
        id: "returning",
        text: "Back so soon? *slides over a drink* The usual? I hear you've been making quite a name for yourself out there!",
        responses: [
          { text: "What are people saying?", nextDialogueId: "reputation" },
          { text: "Any new gossip?", nextDialogueId: "tavern_gossip" },
        ],
      },
      reputation: {
        id: "reputation",
        text: "They call you the Swift Fingers! Say you've been cleaving through monsters like a hot knife through butter. Keep it up and you'll be a legend!",
        responses: [
          { text: "I'm just doing what I can.", nextDialogueId: null },
          { text: "A legend? I like the sound of that!", nextDialogueId: null },
        ],
      },
    },
  },

  training_dummy: {
    id: "training_dummy",
    name: "Sir Trains-a-Lot",
    portrait: "🎯",
    dialogues: {
      intro: {
        id: "intro",
        text: "*speaks in monotone* GREETINGS ADVENTURER. I AM SIR TRAINS-A-LOT. I EXIST TO HELP YOU PRACTICE YOUR TYPING SKILLS. PLEASE DO NOT SET ME ON FIRE AGAIN.",
        responses: [
          { text: "Practice with you?", nextDialogueId: "practice_info" },
          { text: "Again? Who set you on fire?", nextDialogueId: "fire_story" },
          { text: "Uh... goodbye.", nextDialogueId: null },
        ],
      },
      practice_info: {
        id: "practice_info",
        text: "YES. I WILL PRESENT WORDS. YOU TYPE THEM. I WILL NOT FIGHT BACK. THIS IS CALLED 'TRAINING'. IT IS VERY SAFE. MOSTLY.",
        responses: [
          { text: "Let's practice!", nextDialogueId: null, action: { type: "startPractice" } },
          { text: "What do you mean 'mostly'?", nextDialogueId: "mostly_safe" },
        ],
      },
      mostly_safe: {
        id: "mostly_safe",
        text: "SOMETIMES ADVENTURERS TYPE SO FAST THEY GENERATE SPARKS. THIS IS HOW I GOT SET ON FIRE. PLEASE MAINTAIN REASONABLE SPEED.",
        responses: [
          { text: "I'll try not to burn you.", nextDialogueId: null, action: { type: "startPractice" } },
          { text: "No promises!", nextDialogueId: null, action: { type: "startPractice" } },
        ],
      },
      fire_story: {
        id: "fire_story",
        text: "A MAGE NAMED BLAZETYPER. 150 WPM. VERY IMPRESSIVE. VERY DANGEROUS. I HAVE BEEN REBUILT SEVEN TIMES. THIS IS FINE.",
        responses: [
          { text: "That's... concerning. Let's practice safely!", nextDialogueId: null, action: { type: "startPractice" } },
        ],
      },
      returning: {
        id: "returning",
        text: "YOU HAVE RETURNED. YOUR TYPING SKILLS HAVE IMPROVED BY APPROXIMATELY 12.7 PERCENT. THIS IS ACCEPTABLE PROGRESS. WANT TO PRACTICE MORE?",
        responses: [
          { text: "Let's go!", nextDialogueId: null, action: { type: "startPractice" } },
          { text: "How do you know my exact improvement?", nextDialogueId: "calculation" },
        ],
      },
      calculation: {
        id: "calculation",
        text: "I AM A MAGICAL TRAINING DUMMY. I KNOW MANY THINGS. FOR EXAMPLE, YOUR AVERAGE WPM HAS INCREASED AND YOUR ERROR RATE DECREASED. I AM VERY GOOD AT MATH.",
        responses: [
          { text: "Impressive! Let's train!", nextDialogueId: null, action: { type: "startPractice" } },
        ],
      },
    },
  },
};

export function getInitialDialogue(npcId: string, hasMetBefore: boolean): string {
  const npc = NPCS[npcId];
  if (!npc) return "intro";
  
  if (hasMetBefore && npc.dialogues.returning) {
    return "returning";
  }
  return "intro";
}
