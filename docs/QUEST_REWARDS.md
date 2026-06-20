# Zakzum Online Quest Reward Rules

The quest reward rules foundation gives static quests a shared, validated reward shape for future completion rewards. Early rewards remain modest and grounded.

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

- Rewards are static definitions only and are not applied yet.
- The quest completion API does not change character rewards yet.
- Character gold, experience, renown, and level are unchanged by completion.
- No reward UI exists yet.
- No item or equipment rewards exist.
- No random reward tables exist.
- No level-up logic exists.
- No database writes or ActivityLog records are created by these helpers.
- Combat, shops, map UI, and story progression are not connected.

## Next Recommended Step

Apply validated gold, experience, and renown rewards atomically during quest completion. Keep item rewards and level-up behavior for separate later steps.
