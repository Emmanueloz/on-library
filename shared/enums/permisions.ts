export const ModulePermission = {
  Users: "users",
  Categories: "categories",
  Series: "series",
  Chapters: "chapters",
  Pages: "pages",
  Tags: "tags",
  Libraries: "libraries",
  Following: "following",
  History: "history",
} as const;

export type ModulePermission = (typeof ModulePermission)[keyof typeof ModulePermission];

export const TypePermission = {
  Read: "READ",
  Write: "WRITE",
  Delete: "DELETE",
} as const;

export type TypePermission = (typeof TypePermission)[keyof typeof TypePermission];
