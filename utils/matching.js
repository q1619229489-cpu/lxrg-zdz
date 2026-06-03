import { findRelationship } from "../data/relationships.js"
import { recommendDestination } from "../data/destinations.js"

export function matchResults(resultA, resultB) {
  var relationship = findRelationship(resultA.personality, resultB.personality)
  if (!relationship) return null
  var allPrefs = []
  if (resultA.foodPrefs) allPrefs = allPrefs.concat(resultA.foodPrefs)
  if (resultB.foodPrefs) allPrefs = allPrefs.concat(resultB.foodPrefs)
  if (resultA.destPrefs) allPrefs = allPrefs.concat(resultA.destPrefs)
  if (resultB.destPrefs) allPrefs = allPrefs.concat(resultB.destPrefs)
  var destinations = recommendDestination(relationship, resultA.personality, resultB.personality, allPrefs, resultA.traits, resultB.traits)
  return { relationship: relationship, destinations: destinations, rarityCount: relationship.rarity, rarityText: relationship.rarityText, traitsA: resultA.traits, traitsB: resultB.traits }
}
