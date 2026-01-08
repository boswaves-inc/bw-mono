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

export type ElementPropsMap = {
  'button': ButtonProps,
  'heading': HeadingProps,
  'html': HtmlProps,
  'lead': LeadProps,
  'markdown': MarkdownProps,
  'sub-heading': SubHeadingProps,
  'text': TextProps,
};

export type ElementType = keyof ElementPropsMap;

export type Element = {
  [T in ElementType]: ElementPropsMap[T] & {
    type: T,
    content: (Element | Primitive)[] | Element | Primitive;
  }
}[ElementType];

