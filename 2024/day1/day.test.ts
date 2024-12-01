import { assertEquals } from "jsr:@std/assert";
import { part1, part2 } from "./day.ts";
import { readStringFromFile } from "../../lib/file.ts";

const example = await readStringFromFile("example.txt", import.meta.url);
const input = await readStringFromFile("input.txt", import.meta.url);

Deno.test("day 1, 2024, part 1", async () => {
  assertEquals(await part1(example), 11);
  assertEquals(await part1(input), 2430334);
});

Deno.test("day 1, 2024, part 2", async () => {
  assertEquals(await part2(example), 31);
  assertEquals(await part2(input), 28786472);
});
