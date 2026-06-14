# Journey To The Heavens Roll20 Character Sheet

A community character sheet for the custom tabletop roleplaying game **Journey To The Heavens**. The sheet is built for Roll20's custom character sheet system and is currently in active development.

The long-term goal is to prepare this project for submission to the public Roll20 character sheet repository once the sheet has been tested, packaged, and documented to Roll20's publishing standards.

## Current Status

This repository contains a working Roll20 sheet package for the final sheet folder name **Journey To The Heavens**. It is closer to public submission now, but still needs final Roll20 sandbox testing and a Roll20 user ID in `sheet.json` before opening a pull request.

Roll20's community sheet repository expects a sheet folder with, at minimum:

- an HTML sheet file
- a CSS sheet file
- a preview image
- a `sheet.json` metadata file

This project currently includes the sheet HTML, CSS, JavaScript worker source, image assets, preview image, and `sheet.json` metadata.

## Sheet Files

- `JourneyToTheHeavens.html` - Roll20 sheet markup, roll buttons, repeating sections, roll templates, and embedded sheet worker block.
- `JourneyToTheHeavens.css` - Sheet layout and styling.
- `JourneyToTheHeavens.js` - Standalone copy of the sheet worker code used for easier editing and syntax checks.
- `sheet.json` - Roll20 sheet metadata for the final `Journey To The Heavens` sheet folder.
- `preview.png` - Roll20 preview image.
- `src/` - Sheet image assets used by the CSS theme.
- `LICENSE` - MIT license.

When preparing for Roll20 publication, the worker code in `JourneyToTheHeavens.js` should stay synchronized with the `<script type="text/worker">` block in `JourneyToTheHeavens.html`.

## Supported Character Sheet Areas

The sheet currently supports:

- Character identity fields, including name, ancestry/species, mortal path, cultivator path, mortal level, major realm, and minor realm.
- Mortal, cultivator, and beast character modes.
- Core attributes: Power, Agility, Vitality, Cultivation, Qi Control, and Mental.
- Attribute checks, attribute DCs, global attribute modifiers, and per-attribute bonuses.
- Skill rolls for Acrobatics, Athletics, Deceit, Discretion, Disguise, Fine Arts, Forgery, Grapple, History, Intuition, Intimidation, Investigation, Medicine, Navigation, Perception, Performance, Persuade, Seduce, Stealth, and Survival.
- Techniques, tools, custom skills, traits, features, resources, memories, notes, and profession notes.
- Health tracking and optional automated HP calculation by realm, vitality, bloodline bonuses, and repeating HP modifiers.
- Combat tracking, including action points, defenses, evasion, durability, reduction, global attack modifiers, global damage modifiers, and repeating attacks.
- Multi-part attack damage entries with configurable damage type, technique scaling, attribute scaling, intent sharing, save fields, and attack descriptions.
- Beast part tracking.
- Inventory, holdings, currency, weight, inventory slots, item containers, equipped/carried state, and item modifiers.
- Roll behavior options for whispering, damage behavior, default attack stat, character name output, and global modifiers.

## Repeating Sections

The sheet uses Roll20 repeating sections for:

- `repeating_technique`
- `repeating_tool`
- `repeating_beastparts`
- `repeating_defences`
- `repeating_evasionsource`
- `repeating_durabilitysource`
- `repeating_reductionsource`
- `repeating_tohitmod`
- `repeating_damagemod`
- `repeating_attack`
- `repeating_feature`
- `repeating_resource`
- `repeating_memories`
- `repeating_notes`
- `repeating_traits`
- `repeating_alchemybatch`
- `repeating_arraypattern`
- `repeating_carvingwork`
- `repeating_doctorcase`
- `repeating_forgingproject`
- `repeating_fulutalisman`
- `repeating_weavingproject`
- `repeating_otheritems`
- `repeating_inventory`
- `repeating_hpmod`

## Roll Templates

The sheet defines custom Roll20 roll templates for:

- `atk` - attack rolls.
- `atkdmg` - combined attack and damage output.
- `dmg` - damage-only output.
- `features` - feature, technique, and informational output.
- `simple` - attribute and skill checks.

## Sheet Worker Automation

The sheet workers currently automate:

- Attribute totals from base values, bonuses, global modifiers, and equipped inventory modifiers.
- Skill dice and bonuses from attributes, flat bonuses, global modifiers, and equipped inventory modifiers.
- Attribute DCs, initiative, evasion, durability, reduction, and defense totals.
- Beast part values from HP and part quality.
- Health totals, realm HP bonuses, HP average calculation, and current/next realm HP roll macros.
- Inventory weight, inventory slots, container slots, carried state, equipped state, and fixed item values.
- Attack roll macros, damage formulas, automatic damage output settings, default attack stats, and global attack/damage modifiers.

## Local Development

For Roll20 custom sheet testing:

1. Open a Roll20 game where custom character sheets are available.
2. Paste `JourneyToTheHeavens.html` into the HTML editor.
3. Paste `JourneyToTheHeavens.css` into the CSS editor.
4. Confirm the embedded sheet worker script in the HTML is synchronized with `JourneyToTheHeavens.js`.
5. Save the sheet and test with new and existing characters.

Suggested manual test areas:

- Open a blank character and confirm sheet workers initialize totals.
- Change each core attribute and confirm skills, DCs, HP, inventory limits, and attacks update.
- Add and remove rows from every repeating section.
- Toggle public/GM roll whispering.
- Roll attributes, skills, techniques, features, attacks, damage, HP gain, and HP average.
- Test inventory item modifiers while equipped, unequipped, carried, not carried, and inside containers.
- Test mortal, cultivator, and beast modes.

## Publication Checklist

Before submitting to Roll20:

- Use the final Roll20 folder name `Journey To The Heavens`.
- Confirm `sheet.json` points to `JourneyToTheHeavens.html`, `JourneyToTheHeavens.css`, and `preview.png`.
- Fill in `roll20userid` in `sheet.json` before submitting.
- Confirm all image paths in the CSS work from the final Roll20 sheet folder.
- Confirm the sheet does not depend on external scripts or non-Roll20-hosted assets.
- Confirm `JourneyToTheHeavens.js` and the embedded worker block are identical or intentionally documented as different.
- Run a JavaScript syntax check against the standalone worker file.
- Test the sheet in Roll20's custom sheet sandbox.
- Review Roll20's current community sheet contribution requirements before opening a pull request.
- Open a pull request against the Roll20 character sheet repository after the final package is ready.

## License

This project is released under the MIT License. See `LICENSE` for details.
