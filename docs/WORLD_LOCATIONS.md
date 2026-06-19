# Zakzum Online World Location Foundation

The world location data foundation gives future map, travel, quest, shop, and story systems one shared place to read canon realm and location names.

The source file is:

```text
lib/game/worldLocations.js
```

This data is static JavaScript for now. It does not create database records.

## Canon Source

The first version is based on `core-lore.md`.

It includes the established realm catalogue and important places listed in the canon file.

## Exports

`lib/game/worldLocations.js` exports:

- `STARTING_LOCATION_KEY`
- `REALMS`
- `LOCATIONS`
- `getRealmByKey(realmKey)`
- `getLocationByKey(locationKey)`
- `getLocationsByRealm(realmKey)`
- `isValidLocationKey(locationKey)`

## Starting Location

`STARTING_LOCATION_KEY` is:

```text
kingstone
```

This represents Kingstone in the Heartlands.

`Character.currentLocation` is still a simple string field, but it now stores location keys.

Kingstone is stored as:

```text
kingstone
```

The UI should use `getLocationByKey(character.currentLocation)` to show friendly location names such as `Kingstone`.

Legacy local rows that stored `Kingstone` were normalized to `kingstone` in the Prisma migration.

## Travel Rules

Basic travel validation helpers now exist in:

```text
lib/game/travelRules.js
```

These helpers validate location keys and return safe destination summaries for travel API and UI work.

A protected travel API now uses these helpers to move owned characters between valid location keys.

## Realm Data Shape

Each realm entry includes:

- `key`
- `name`
- `primaryPeople` or `primaryPower`
- `capitalLocationKey`
- `shortDescription`

For the dark realms that do not have mortal capitals, `capitalLocationKey` points to a realm-level location record.

## Location Data Shape

Each location entry includes:

- `key`
- `name`
- `realmKey`
- `type`
- `shortDescription`

Location keys use stable lowercase kebab-case.

Current location types are:

- `capital`
- `settlement`
- `stronghold`
- `landmark`
- `wilderness`
- `market`
- `shrine`
- `dungeon`
- `realm`

## Current Limitations

- No map UI exists yet.
- Travel rules, a protected travel API, and a simple Travel UI exist.
- No travel distances exist yet.
- No coordinates exist yet.
- No location images exist yet.
- No shops exist yet.
- Static quest data now references location keys, but no quest API, UI, or database models exist yet.
- No combat encounter data exists yet.
- `Character.currentLocation` is still a string, not a database relation.
- No `Location` database table exists yet.

## Next Recommended Step

Keep location keys stable as future quest APIs and persistence are added. Map UI and richer travel behavior should continue to wait until character ownership, location validation, and activity logging remain reliable.
