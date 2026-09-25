import { useMemo } from 'react';

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type LandingPageCustomization = {
  css?: string;
  primaryColor?: string;
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export function splitTypographyProps<T extends PageTypographyProps>(
  props: T
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
    ...rest
  } = props;
  return [
    {
      headingFont,
      bodyFont,
      headingWeight,
      bodyWeight,
      primaryColor,
      headingSize,
      bodySize,
      headingLetterSpacing,
    },
    rest as Omit<T, keyof PageTypographyProps>,
  ];
}

const FONT_MAP: Record<string, string> = {
  'iowan-old-style': '"Iowan Old Style", "Baskerville", "Times New Roman", serif',
  inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  geist: '"Geist", "Helvetica Neue", Helvetica, Arial, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
};

export function usePageTypography(
  recipe: any = {},
  userProps: PageTypographyProps = {}
): LandingPageCustomization {
  return useMemo(() => {
    const primaryColor = userProps.primaryColor || recipe?.primaryColor;
    const headingFont =
      FONT_MAP[userProps.headingFont || ''] || userProps.headingFont || recipe?.headingFont;
    const bodyFont =
      FONT_MAP[userProps.bodyFont || ''] || userProps.bodyFont || recipe?.bodyFont;

    let css = '';
    if (primaryColor) {
      css += `
        :root {
          --accent: ${primaryColor} !important;
          --brand-primary: ${primaryColor} !important;
        }
      `;
    }
    if (headingFont) {
      css += `
        :root {
          --serif: ${headingFont} !important;
          --font-heading: ${headingFont} !important;
        }
      `;
    }
    if (bodyFont) {
      css += `
        :root {
          --mono: ${bodyFont} !important;
          --font-body: ${bodyFont} !important;
        }
      `;
    }
    if (userProps.headingSize) {
      css += `
        h1, .hero-heading {
          font-size: ${userProps.headingSize}px !important;
        }
      `;
    }
    if (userProps.headingLetterSpacing !== undefined) {
      css += `
        h1, .hero-heading {
          letter-spacing: ${userProps.headingLetterSpacing}em !important;
        }
      `;
    }

    return {
      css,
      ...recipe,
      ...userProps,
    };
  }, [recipe, userProps]);
}

const CUSTOMIZATION_STYLE_ID = 'threeui-page-customization';

export function applyPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  if (!frame || !frame.contentDocument) return;
  const doc = frame.contentDocument;

  doc.getElementById(CUSTOMIZATION_STYLE_ID)?.remove();

  if (!customization || !customization.css) return;

  const style = doc.createElement('style');
  style.id = CUSTOMIZATION_STYLE_ID;
  style.textContent = customization.css;
  doc.head.appendChild(style);
}

export function postPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  if (!frame || !frame.contentWindow || !customization) return;
  try {
    frame.contentWindow.postMessage(
      {
        type: 'threeui-customization',
        customization,
      },
      '*'
    );
  } catch (e) {
    // Ignore cross-origin restrictions
  }
}
