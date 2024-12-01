import * as path from "jsr:@std/path";
import { writeStringToFile } from "./lib/file.ts";
import { htmlToMarkdown } from "./lib/html.ts";

if (import.meta.main) {
  const [dayStr, yearStr] = Deno.args;
  const day = parseInt(dayStr);
  const year = parseInt(yearStr);

  if (isNaN(day) || isNaN(year)) {
    console.error("Day and year must be valid numbers");
    Deno.exit(1);
  }

  setupDay(day, year);
}

async function setupDay(day: number, year: number) {
  const story = await getStory(day, year);
  const input = await getInput(day, year);
  writeStringToFile(
    path.join(".", year.toString(), `day${day}`, "story.md"),
    story
  );
  writeStringToFile(
    path.join(".", year.toString(), `day${day}`, "input.txt"),
    input
  );
  writeStringToFile(
    path.join(".", year.toString(), `day${day}`, "example.txt"),
    ""
  );
  writeStringToFile(
    path.join(".", year.toString(), `day${day}`, "day.ts"),
    `export async function part1(input: string) {
  return 0;
}

export async function part2(input: string) {
  return 0;
}
`
  );
  writeStringToFile(
    path.join(".", year.toString(), `day${day}`, "day.test.ts"),
    `import { assertEquals } from "jsr:@std/assert";
import { part1, part2 } from "./day.ts";
import { readStringFromFile } from "../../lib/file.ts";

const example = await readStringFromFile("example.txt", import.meta.url);
const input = await readStringFromFile("input.txt", import.meta.url);

Deno.test("day ${day}, ${year}, part 1", async () => {
  assertEquals(await part1(example), 0);
  assertEquals(await part1(input), 0);
});

Deno.test("day ${day}, ${year}, part 2", async () => {
  assertEquals(await part2(example), 0);
  assertEquals(await part2(input), 0);
});
`
  );
}

async function getStory(day: number, year: number = 2024) {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}`, {
    headers: { Cookie: `session=${Deno.env.get("SESSION")}` },
  });
  const html = await res.text();
  return htmlToMarkdown(html, ".day-desc");
}

async function getInput(day: number, year: number = 2024) {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: { Cookie: `session=${Deno.env.get("SESSION")}` },
  });
  return res.text();
}
