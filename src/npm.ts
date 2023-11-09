import {
  type Output,
  object,
  record,
  string,
  transform,
  isoDateTime,
  parse,
} from "valibot";

export async function getPackage(
  packageName: string,
  init: RequestInit = {},
): Promise<GetPackageSchema> {
  const url = `https://registry.npmjs.org/${packageName}`;
  const res = await fetch(url, init);
  const json = await res.json();

  return parse(getPackageSchema, json);
}

const getPackageSchema = object({
  "dist-tags": record(string()),
  versions: record(
    object({
      version: string(),
    }),
  ),
  time: record(transform(string(), (s) => new Date(s))),
});

type GetPackageSchema = Output<typeof getPackageSchema>;
