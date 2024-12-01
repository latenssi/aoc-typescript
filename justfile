setup day year:
    @deno -A --env-file main.ts {{day}} {{year}} 1

part2 day year:
    @deno -A --env-file main.ts {{day}} {{year}} 2

test:
    @deno test -A --watch
