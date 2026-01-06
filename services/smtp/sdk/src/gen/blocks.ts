// AUTO-GENERATED - DO NOT EDIT
export type Primitive = string | number;
export type ButtonProps = {
  href?: string | undefined;
  target?: ("_self" | "_blank" | "_parent" | "_top") | undefined;
  variant?: ("primary" | "secondary" | "outline") | undefined;
};
export type HeadingProps = {
  size?: ("h1" | "h2" | "h3") | undefined;
};
export type HtmlProps = {};
export type LeadProps = {};
export type MarkdownProps = {};
export type SubHeadingProps = {};
export type TextProps = {
  size?: ("default" | "lg") | undefined;
};
export type BlockPropsMap = {
  'button': ButtonProps,
  'heading': HeadingProps,
  'html': HtmlProps,
  'lead': LeadProps,
  'markdown': MarkdownProps,
  'sub-heading': SubHeadingProps,
  'text': TextProps,
};
export type BlockType = keyof BlockPropsMap;
export type Block = {
  [K in BlockType]: BlockPropsMap[K] & {
    type: K,
    content: (Block | Primitive)[] | Block | Primitive;
  }
}[BlockType];
