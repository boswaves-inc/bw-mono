import { forwardRef, type SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'fill' | 'viewBox' | 'x' | 'y' | 'preserveAspectRatio' | 'xmlns'>;

export const createIcon = (callback: React.ForwardRefRenderFunction<SVGSVGElement, Omit<IconProps, "ref">>) => forwardRef<SVGSVGElement, IconProps>(callback)