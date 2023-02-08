import React from "react";
import styled from "styled-components";

const AdWrapper = styled.div`
  & {
    position: fixed;
    z-index: 1000;
    bottom: 40px;
    right: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
      Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  & .native-button {
    z-index: 100;
    display: flex;
    padding: 8px 20px;
    border-radius: 4px;
    box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.15);
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;

    user-select: none;
    justify-content: center;
    align-items: center;
  }

  & .native-img {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }

  & .native-overlay {
    position: fixed;
    bottom: 80px;
    display: none;
    padding: 20px;
    max-width: 330px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.15);
    opacity: 0;
    transition: transform 0.2s ease-in-out, opacity 0.1s ease-in-out;
    transform: scale(1) translateY(-50px);
  }

  & #native-button:checked + .native-overlay {
    opacity: 1;
    transition: transform 0.2s ease-in-out, opacity 0.4s ease-in-out;
    transform: scale(1) translateY(0);
  }

  #native-button {
    display: none;
  }

  & .native-banner {
    line-height: 1.35;
  }

  & .native-tagline {
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 16px;
  }

  & .native-description {
    margin-bottom: 10px;
    font-size: 16px;
  }

  & .native-footer {
    display: flex;

    justify-content: space-between;
    align-items: center;
  }

  & .native-logo {
    width: 120px;
    height: auto;
  }

  & .native-cta {
    padding: 6px 8px;
    border-radius: 3px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 12px;
  }
`;

const template = `${"`"}
<label class="native-button" for="native-button" style="background-color: ##backgroundColor##; color: ##textColor##;"><img src="##image##" class="native-img">Sponsored by ##company##</label>
<input type="checkbox" id="native-button">
<div class="native-overlay" style="background-color: ##backgroundColor##; color: ##textColor##">
  <div class="native-banner">
    <div class="native-tagline">##tagline##</div>
    <div class="native-description">##description##</div>
    <div class="native-footer">
      <a href="##statlink##" class="native-cta" style="background-color: ##ctaBackgroundColor##; color: ##ctaTextColor##">##callToAction##</a>
      <img class="native-logo" src="##logo##">
    </div>
  </div>
</div>
${"`"}`;

export const AdTest = () => {
  const ref = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    if (window.innerWidth < 660) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.id = "_carbonads_js";
    s.innerHTML = `(function() {
        if (typeof _bsa !== 'undefined' && _bsa) {
          _bsa.init('custom', 'CWYD42JI', 'placement:jsoncrackcom', {
            target: '#cutton-js',
            template: ${template}
          });
        }
      })();`;
    ref.current.appendChild(s);
  }, []);

  return <AdWrapper ref={ref} id="cutton-js"></AdWrapper>;
};
