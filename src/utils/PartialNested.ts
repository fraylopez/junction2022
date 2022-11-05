export type PartialNested<K> = {
  [attr in keyof K]?: K[attr] extends object
  ? PartialNested<K[attr]>
  : K[attr] extends object | null
  ? PartialNested<K[attr]> | null
  : K[attr] extends object | null | undefined
  ? PartialNested<K[attr]> | null | undefined
  : K[attr];
};