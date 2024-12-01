import {
  fromFileUrl,
  resolve,
  dirname,
} from "https://deno.land/std/path/mod.ts";

/** Resolves a path relative to the file that calls this function */
function resolveRelativePath(
  relativePath: string,
  importMetaUrl: string
): string {
  const currentFileDir = dirname(fromFileUrl(importMetaUrl));
  return resolve(currentFileDir, relativePath);
}

/** Read a file as string, with path relative to the calling file */
export async function readStringFromFile(
  relativePath: string,
  importMetaUrl: string
): Promise<string> {
  try {
    const absolutePath = resolveRelativePath(relativePath, importMetaUrl);
    return await Deno.readTextFile(absolutePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
    throw new Error(`Failed to read file: ${String(error)}`);
  }
}

export async function writeStringToFile(
  path: string,
  content: string
): Promise<void> {
  try {
    // Extract the directory path
    const dirPath = path.slice(
      0,
      Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"))
    );

    // Create all directories in the path recursively
    if (dirPath) {
      await Deno.mkdir(dirPath, { recursive: true });
    }

    // Write the file
    await Deno.writeTextFile(path, content);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
    // If it's not an Error object, convert it to string
    throw new Error(`Failed to write file: ${String(error)}`);
  }
}
