# Zakzum Online World Location Foundation

The world location data foundation gives future map, travel, quest, shop, and story systems one shared place to read canon realm and location names.

The source file is:

```text
lib/game/worldLocations.js
```

This data is static JavaScript for now. It does not create database records and does not change saved characters.

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

`Character.currentLocation` is still a simple string for now and still defaults to `Kingstone` in Prisma. The project has not migrated existing characters to location keys yet.

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
- No travel system exists yet.
- No travel distances exist yet.
- No coordinates exist yet.
- No location images exist yet.
- No shops exist yet.
- No quest data exists yet.
- No combat encounter data exists yet.
- `Character.currentLocation` has not been changed yet.
- Existing characters have not been migrated to location keys.
- No database schema changes were made for world locations.

## Next Recommended Step

Add a small read-only location display helper or use `STARTING_LOCATION_KEY` during future character/location cleanup. Map UI and travel behavior should wait until the static location names stay stable.
