export async function part1(input: string) {
  const [list1, list2] = getLists(input);
  list1.sort();
  list2.sort();
  let sum = 0;
  for (let i = 0; i < list1.length; i++) {
    sum += Math.abs(list1[i] - list2[i]);
  }
  return sum;
}

export async function part2(input: string) {
  const [list1, list2] = getLists(input);
  const list2Freqs = list2.reduce(
    (acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }),
    {} as Record<string, number>
  );
  let similarityScore = 0;
  for (let i = 0; i < list1.length; i++) {
    similarityScore += (list2Freqs[list1[i]] ?? 0) * list1[i];
  }
  return similarityScore;
}

function getLists(input: string) {
  return input
    .split("\n")
    .filter((s) => !!s)
    .map((s) =>
      s
        .split(" ")
        .filter((s) => !!s)
        .map((s) => parseInt(s))
    )
    .reduce(
      (acc, cur) => [
        [...acc[0], cur[0]],
        [...acc[1], cur[1]],
      ],
      [[] as number[], [] as number[]]
    );
}
