import type { L } from "ts-toolbelt";

export type DeepGet<O, P extends string[], D = undefined> = {
  stop: O;
  continue: L.Head<P> extends keyof O ? DeepGet<O[L.Head<P>], L.Tail<P>, D> : D;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}[P extends [any, ...any[]] ? "continue" : "stop"];
