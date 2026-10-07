import React from "react";
import { IconDragon } from "../shared/Bg3Icons";
import type { DDBParsedCharacter } from "../../../types/ddb";

export const BackgroundTab: React.FC<{ character: DDBParsedCharacter | null }> = ({ character }) => (
    <div className="ddb-tab-content-panel ddb-background-panel">
        <div className="ddb-bg-card">
            <div className="ddb-bg-header-row">
                <span className="ddb-bg-title">{character?.backgroundInfo?.name || "Background"}</span>
                {character?.backgroundInfo?.featureName && (
                    <span className="ddb-bg-feature-badge">Feature: {character.backgroundInfo.featureName}</span>
                )}
            </div>
            {character?.backgroundInfo?.description && (
                <div className="ddb-bg-desc"><p>{character.backgroundInfo.description}</p></div>
            )}
        </div>

        <div className="ddb-characteristics-grid">
            <div className="ddb-trait-card"><span className="ddb-trait-title">PERSONALITY TRAITS</span><p className="ddb-trait-text">{character?.backgroundInfo?.traits?.personalityTraits || "None defined."}</p></div>
            <div className="ddb-trait-card"><span className="ddb-trait-title">IDEALS</span><p className="ddb-trait-text">{character?.backgroundInfo?.traits?.ideals || "None defined."}</p></div>
            <div className="ddb-trait-card"><span className="ddb-trait-title">BONDS</span><p className="ddb-trait-text">{character?.backgroundInfo?.traits?.bonds || "None defined."}</p></div>
            <div className="ddb-trait-card"><span className="ddb-trait-title">FLAWS</span><p className="ddb-trait-text">{character?.backgroundInfo?.traits?.flaws || "None defined."}</p></div>
        </div>
    </div>
);

export const NotesTab: React.FC<{ character: DDBParsedCharacter | null }> = ({ character }) => {
    const notes = character?.notesInfo;

    return (
        <div className="ddb-tab-content-panel ddb-notes-panel">
            <div className="ddb-notes-section">
                <span className="ddb-section-header-title">CHARACTER BACKSTORY</span>
                <div className="ddb-notes-body-text">
                    {notes?.backstory ? notes.backstory.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p className="ddb-empty-notes-text">No backstory written yet.</p>}
                </div>
            </div>

            {(notes?.allies || notes?.organizations) && (
                <div className="ddb-notes-section">
                    <span className="ddb-section-header-title">ALLIES & ORGANIZATIONS</span>
                    <div className="ddb-notes-body-text"><p>{notes.allies || notes.organizations}</p></div>
                </div>
            )}
            {notes?.enemies && (
                <div className="ddb-notes-section">
                    <span className="ddb-section-header-title">ENEMIES</span>
                    <div className="ddb-notes-body-text"><p>{notes.enemies}</p></div>
                </div>
            )}
            {notes?.otherNotes && (
                <div className="ddb-notes-section">
                    <span className="ddb-section-header-title">OTHER NOTES</span>
                    <div className="ddb-notes-body-text"><p>{notes.otherNotes}</p></div>
                </div>
            )}
        </div>
    );
};

export const ExtrasTab: React.FC<{ characterName: string }> = ({ characterName }) => (
    <div className="ddb-tab-content-panel ddb-extras-panel">
        <div className="ddb-extras-empty-state">
            <IconDragon size={28} className="ddb-extras-empty-icon" />
            <h4 className="ddb-extras-empty-title">Extras & Companions</h4>
            <p className="ddb-extras-empty-desc">
                Summoned creatures, familiars, wild shapes, pets, and sidekicks linked to {characterName} will appear here.
            </p>
        </div>
    </div>
);
