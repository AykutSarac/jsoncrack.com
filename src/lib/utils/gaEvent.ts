import ReactGA4 from "react-ga4";

export const gaEvent = (category: string, action: string, label?: string) => {
  ReactGA4.event({
    category,
    action,
    label,
  });
};
