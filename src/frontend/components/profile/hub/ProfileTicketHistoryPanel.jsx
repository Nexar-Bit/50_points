"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getTopTicketsToday } from "@/frontend/lib/profileHubInsights";
import {
  buildTrackTicketHistory,
  filterHistoryTracks,
  getHistoryMonths,
  buildMonthGrid,
  MONTH_KEYS,
} from "@/frontend/lib/profileTicketHistory";
import { profileHubAsset } from "@/frontend/lib/config/profileHubAssets";
import { getTrackImageUrl } from "@/frontend/lib/tournamentImages";
import ProfileTopTicketsToday from "@/frontend/components/profile/hub/ProfileTopTicketsToday";

const TABS = [
  { id: "today", labelKey: "profile.hub.historyTabToday", iconKey: "iconHistoryTabToday" },
  { id: "recent", labelKey: "profile.hub.historyTabRecent", iconKey: "iconHistoryTabRecent" },
  { id: "full", labelKey: "profile.hub.historyTabFull", iconKey: "iconHistoryTabFull" },
];

function MiniMonthCalendar({ t, year, monthIndex, activeDates, compact = false }) {
  const cells = buildMonthGrid(year, monthIndex);
  const monthLabel = t(`profile.hub.months.${MONTH_KEYS[monthIndex]}`);

  return (
    <div className={`profile-hub-cal${compact ? " profile-hub-cal--compact" : ""}`}>
      <p className="profile-hub-cal__month">{monthLabel}</p>
      <div className="profile-hub-cal__grid">
        {cells.map((cell, idx) => {
          if (!cell) {
            return <span key={`empty-${idx}`} className="profile-hub-cal__cell profile-hub-cal__cell--empty" />;
          }
          const played = activeDates.has(cell.dateKey);
          return (
            <span
              key={cell.dateKey}
              className={`profile-hub-cal__cell${played ? " profile-hub-cal__cell--played" : ""}`}
            >
              {played ? (
                <span className="profile-hub-cal__ticket-day">
                  <span className="profile-hub-cal__day-num">{cell.day}</span>
                </span>
              ) : (
                cell.day
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function HistoryCalendarPanel({ t, tracks, mode, selectedTrackSlug, onSelectTrack, searchQuery, onSearchChange }) {
  const months = getHistoryMonths(mode);

  if (tracks.length === 0) {
    return <p className="profile-hub-history__empty">{t("profile.hub.historyEmpty")}</p>;
  }

  return (
    <div className="profile-hub-history__layout">
      <div className="profile-hub-history__calendars">
        {tracks.map((track) => {
          const dateSet = new Set(track.dates);
          return (
            <section
              key={track.slug}
              id={`profile-history-track-${track.slug}`}
              className={`profile-hub-history__track-block${
                selectedTrackSlug === track.slug ? " profile-hub-history__track-block--active" : ""
              }`}
            >
              <h4 className="profile-hub-history__track-title">{track.name.toUpperCase()}</h4>
              <div
                className={`profile-hub-history__month-grid${
                  mode === "full" ? " profile-hub-history__month-grid--full" : ""
                }`}
              >
                {months.map(({ year, monthIndex }) => (
                  <MiniMonthCalendar
                    key={`${track.slug}-${year}-${monthIndex}`}
                    t={t}
                    year={year}
                    monthIndex={monthIndex}
                    activeDates={dateSet}
                    compact={mode === "full"}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="profile-hub-history__sidebar">
        <label className="profile-hub-history__search">
          <img src={profileHubAsset("iconHistorySearch")} alt="" className="profile-hub-history__search-icon" />
          <input
            type="search"
            value={searchQuery}
            placeholder={t("profile.hub.historySearchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <ul className="profile-hub-history__track-list">
          {tracks.map((track) => {
            const logo = track.imageUrl || getTrackImageUrl(track.name, track.imageUrl) || null;
            return (
              <li key={track.slug}>
                <button
                  type="button"
                  className={`profile-hub-history__track-row${
                    selectedTrackSlug === track.slug ? " profile-hub-history__track-row--active" : ""
                  }`}
                  onClick={() => {
                    onSelectTrack(track.slug);
                    document.getElementById(`profile-history-track-${track.slug}`)?.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  }}
                >
                  {logo ? (
                    <img src={logo} alt="" className="profile-hub-history__track-logo" />
                  ) : (
                    <span className="profile-hub-history__track-monogram">
                      {track.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="profile-hub-history__track-label">{track.name}</span>
                  <img
                    src={profileHubAsset("iconHistoryCalendarBtn")}
                    alt=""
                    className="profile-hub-history__track-cal-btn"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function GuestHistoryUpsell({ t }) {
  return (
    <div className="profile-hub-history__guest">
      <p className="profile-hub-history__guest-title">{t("profile.hub.historyGuestTitle")}</p>
      <p className="profile-hub-history__guest-body">{t("profile.hub.historyGuestBody")}</p>
      <Link href="/register" className="profile-hub-history__guest-cta">
        {t("profile.hub.historyGuestCta")}
      </Link>
    </div>
  );
}

export default function ProfileTicketHistoryPanel({
  t,
  profile,
  isRegistered = false,
  liveTracks = [],
}) {
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrackSlug, setSelectedTrackSlug] = useState(null);

  const historyTracks = useMemo(
    () => buildTrackTicketHistory(profile?.allTickets ?? [], liveTracks),
    [profile?.allTickets, liveTracks],
  );

  const filteredTracks = useMemo(
    () => filterHistoryTracks(historyTracks, searchQuery),
    [historyTracks, searchQuery],
  );

  const showCalendar = isRegistered && (activeTab === "recent" || activeTab === "full");
  const topRows = getTopTicketsToday(profile?.allTickets ?? [], profile?.tournamentSummaries ?? []);

  return (
    <section className="profile-hub-history" id="profile-tickets" aria-label={t("profile.hub.historyAria")}>
      <div className="profile-hub-history__tabs" role="tablist">
        {TABS.map((tab) => {
          const icon = profileHubAsset(tab.iconKey);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`profile-hub-history__tab${isActive ? " profile-hub-history__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {icon ? <img src={icon} alt="" className="profile-hub-history__tab-icon" /> : null}
              <span>{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <div className="profile-hub-history__panel" role="tabpanel">
        {activeTab === "today" ? (
          <>
            <ProfileTopTicketsToday t={t} profile={profile} embedded />
            {!isRegistered && topRows.length === 0 ? (
              <p className="profile-hub-history__guest-hint">{t("profile.hub.historyGuestHint")}</p>
            ) : null}
          </>
        ) : null}

        {activeTab === "recent" && !isRegistered ? <GuestHistoryUpsell t={t} /> : null}
        {activeTab === "full" && !isRegistered ? <GuestHistoryUpsell t={t} /> : null}

        {activeTab === "recent" && showCalendar ? (
          <HistoryCalendarPanel
            t={t}
            tracks={filteredTracks}
            mode="recent"
            selectedTrackSlug={selectedTrackSlug}
            onSelectTrack={setSelectedTrackSlug}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : null}

        {activeTab === "full" && showCalendar ? (
          <HistoryCalendarPanel
            t={t}
            tracks={filteredTracks}
            mode="full"
            selectedTrackSlug={selectedTrackSlug}
            onSelectTrack={setSelectedTrackSlug}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : null}

        {showCalendar ? (
          <div className="profile-hub-history__actions">
            <button type="button" className="profile-hub-history__action-btn">
              {t("profile.hub.historyEdit")}
            </button>
            <button type="button" className="profile-hub-history__action-btn">
              {t("profile.hub.historyShare")}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
