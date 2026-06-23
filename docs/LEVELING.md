# Zakzum Online Level Progression Rules

The level progression rules foundation gives Zakzum Online one small, reusable place for early experience and level calculations.

Progression should stay grounded and gradual. Quest completion can now raise `Character.level` when the post-reward experience total reaches a higher threshold.

## Level Thresholds

`lib/game/levelRules.js` exports `LEVEL_THRESHOLDS` for levels 1 through 10:

```text
Level 1: 0 experience
Level 2: 100 experience
Level 3: 250 experience
Level 4: 450 experience
Level 5: 700 experience
Level 6: 1000 experience
Level 7: 1400 experience
Level 8: 1900 experience
Level 9: 2500 experience
Level 10: 3200 experience
```

Level 1 starts at `0` experience. There is no level above 10 in the current table.

## Exports

`lib/game/levelRules.js` exports:

- `LEVEL_THRESHOLDS`
- `getLevelForExperience(experience)`
- `getNextLevelThreshold(currentLevel)`
- `getExperienceProgress({ level, experience })`
- `canLevelUp({ level, experience })`
- `getLevelUpValidationError({ level, experience })`
- `getLevelUpResult({ level, experience })`

`getLevelForExperience(...)` returns the highest level supported by the given experience, or `null` for invalid experience values.

`getNextLevelThreshold(...)` returns the next level's experience threshold, or `null` when the level is invalid or already at the highest known level.

`getExperienceProgress(...)` returns safe progress data for a character-like level and experience pair:

```text
level
experience
currentLevelThreshold
nextLevel
nextLevelThreshold
experienceIntoLevel
experienceNeededForNextLevel
progressPercent
```

Invalid level or experience values return the same safe shape with unavailable numeric fields set to `null`.

`canLevelUp(...)` returns `true` only when experience supports a higher level than the current level.

`getLevelUpValidationError(...)` rejects missing input, invalid levels, invalid experience values, and not-enough-experience cases with safe messages.

`getLevelUpResult(...)` returns:

```text
currentLevel
newLevel
levelsGained
experience
canLevelUp
validationError
```

## Read-only UI Feedback

The protected character overview page now shows a read-only Level Progress section:

```text
/characters/[id]
```

The section uses `getExperienceProgress(...)` and displays the current level, current experience, next level, next level threshold, experience needed for the next level, and progress percent.

When the current level table has no next level, the overview page shows a safe message that the current level table is complete.

Quest completion feedback can also show level progression details from the completion API response. If a quest completion raises the character's level, the Quest page shows the previous and new level. If no level-up happens, the success message shows progress toward the next level when available.

## Current Limitations

- Level progression is applied during successful quest completion after validated experience rewards are added.
- `Character.level` only increases when post-reward experience supports a higher level.
- Duplicate or concurrent quest completion cannot grant extra levels because completion remains guarded by the `ACCEPTED` quest progress update.
- No separate level-up API exists.
- No manual level-up UI or level-up button exists.
- No stat increases exist yet.
- No `maxStamina` increases exist yet.
- No class-based leveling exists yet.
- No level cap behavior beyond the current level 10 table exists yet.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Add level progress details to more character surfaces only where they help the player. Keep stat increases and `maxStamina` increases for a separate future system.
