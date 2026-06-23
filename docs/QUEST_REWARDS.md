# Zakzum Online Quest Reward Rules

The quest reward rules foundation gives static quests a shared, validated reward shape. Early rewards remain modest and grounded.

## Supported Rewards

Current quest rewards support:

- `gold`
- `experience`
- `renown`

Item, equipment, and random rewards are intentionally deferred.

Each static quest defines:

```js
rewards: {
  gold: 5,
  experience: 10,
  renown: 1,
}
```

## Exports

`lib/game/questRewardRules.js` exports:

- `getQuestRewards(quest)`
- `hasQuestRewards(quest)`
- `getQuestRewardValidationError(quest)`
- `getQuestRewardSummary(quest)`

`getQuestRewards(...)` returns normalized `gold`, `experience`, and `renown` values. Missing or invalid values safely normalize to `0`.

`hasQuestRewards(...)` returns `true` when at least one normalized reward is greater than `0`.

Validation rejects a missing quest, negative values, non-number values, and non-finite values. Missing individual reward values are valid and default to `0`.

`getQuestRewardSummary(...)` returns only:

```text
questKey
questTitle
gold
experience
renown
hasRewards
validationError
```

## Current Limitations

- Validated rewards are applied by `POST /api/characters/[id]/quests/[questKey]/complete`.
- Rewards are only applied after the quest is accepted and all required objectives are complete.
- Gold, experience, and renown are incremented in the same transaction that completes the quest and writes its ActivityLog.
- A guarded `ACCEPTED` to `COMPLETED` update must succeed before rewards are applied. Repeated or concurrent completion attempts therefore cannot award the same quest twice.
- Completion attempts rejected for incomplete required objectives do not apply rewards.
- The protected Quest UI shows gold, experience, and renown previews on quest cards.
- Successful completion shows the awarded values and updated progression totals returned by the completion API.
- Completed quests retain their read-only reward summary after refresh.
- Quest rewards grant experience, but character level remains unchanged because level-up application is not wired yet.
- Reusable level progression rules now exist in `lib/game/levelRules.js` for future level-up behavior.
- Rewards are applied only by the completion API; the UI has no separate claim flow.
- No item or equipment rewards exist.
- No random reward tables exist.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Apply level-up rules during quest completion in a separate API change. Keep item rewards as a separate future system.
