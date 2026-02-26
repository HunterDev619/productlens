declare module 'react-google-recaptcha' {
  import type { RefObject } from 'react';

  export interface ReCAPTCHAInstance {
    getValue: () => string;
    reset: () => void;
    execute: () => Promise<string>;
  }

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    ref?: React.Ref<ReCAPTCHAInstance>;
  }

  const ReCAPTCHA: React.ForwardRefExoticComponent<ReCAPTCHAProps & React.RefAttributes<ReCAPTCHAInstance>>;
  export default ReCAPTCHA;
}
