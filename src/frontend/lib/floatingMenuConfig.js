/**
 * Main navigation — grouped blocks (player → game → competition → prestige → personal → system).
 * Icons only (no emoji); labels come from i18n `floatingMenu.*`.
 */

export const FLOATING_MENU_BLOCKS = [
  {
    id: "player",
    labelKey: "floatingMenu.blockPlayer",
    items: [
      { id: "home", href: "/", labelKey: "floatingMenu.home", skipModality: true },
      { id: "profile", href: "/profile", labelKey: "floatingMenu.profile" },
      { id: "mainPage", href: "/inicio", labelKey: "floatingMenu.mainPage" },
    ],
  },
  {
    id: "game",
    labelKey: "floatingMenu.blockGame",
    items: [
      { id: "tickets", href: "/statistics", labelKey: "floatingMenu.tickets" },
      { id: "tournaments", href: "/tournaments", labelKey: "floatingMenu.tournaments" },
      { id: "gameModes", href: "/modalidades", labelKey: "floatingMenu.gameModes" },
    ],
  },
  {
    id: "competition",
    labelKey: "floatingMenu.blockCompetition",
    items: [
      { id: "ranking", href: "/leaderboard", labelKey: "floatingMenu.ranking" },
      { id: "chat", href: "/chat", labelKey: "floatingMenu.chat" },
      { id: "feed", href: "/feed", labelKey: "floatingMenu.feed" },
    ],
  },
  {
    id: "prestige",
    labelKey: "floatingMenu.blockPrestige",
    items: [
      { id: "achievements", href: "/profile?section=achievements", labelKey: "floatingMenu.achievements" },
      { id: "top10", href: "/legends", labelKey: "floatingMenu.top10" },
      { id: "hallOfFame", href: "/hall-of-fame", labelKey: "floatingMenu.hallOfFame" },
    ],
  },
  {
    id: "personal",
    labelKey: "floatingMenu.blockPersonal",
    items: [
      { id: "statistics", href: "/statistics/explorer", labelKey: "floatingMenu.statistics" },
      { id: "privacy", href: "/profile?section=privacy", labelKey: "floatingMenu.privacy" },
    ],
  },
  {
    id: "system",
    labelKey: "floatingMenu.blockSystem",
    items: [
      { id: "settings", href: "/profile?section=settings", labelKey: "floatingMenu.settings" },
      { id: "tournamentGuide", href: "/guia-torneo", labelKey: "floatingMenu.tournamentGuide", skipModality: true },
      { id: "help", href: "/how-to-play?section=faq", labelKey: "floatingMenu.help" },
      { id: "logout", labelKey: "floatingMenu.logout", isLogout: true },
    ],
  },
];

/** Flat list for animation index / legacy helpers */
export function flatFloatingMenuItems() {
  return FLOATING_MENU_BLOCKS.flatMap((b) => b.items);
}
