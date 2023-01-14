import { BlogCard } from "../completionReq/blogCardSection";
import { shuffleArray } from "./array";
import { toCamelCase, toLowerCase } from "./string";

export function tagsToPromptString(tags: BlogCard["tags"], joinTags?: BlogCard["tags"]): string {
  if (joinTags) {
    /// select 1/3 randomly from the joinTags
    const joinTagsToUse = shuffleArray(joinTags).slice(0, Math.ceil(joinTags.length / 3));
    tags = [...tags, ...joinTagsToUse];
  }
  return "#" + shuffleArray(tags).map(toCamelCase).join(" #");
}

export function stringToTags(tagsString?: string): string[] {
  if (!tagsString) {
    return [];
  }
  const camelcaseTags = tagsString.split("#").map(tag => tag.trim()).filter(Boolean);
  // add a space before a capital letter
  return camelcaseTags.map(toLowerCase);
}