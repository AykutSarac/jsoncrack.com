import React from "react";
import styled from "styled-components";

const AdWrapper = styled.div`
  z-index: 1000;

  .sticky-js {
    display: flex;
    justify-content: center;
    z-index: 1000;
    position: relative;

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
      Cantarell, "Helvetica Neue", sans-serif;
  }

  #sticky-js._bsa_hide {
    display: none;
  }

  #sticky-js .native-hide {
    position: absolute;
    top: -6px;
    right: -6px;
    padding: 4px 5.42px;

    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    border-radius: 50%;
  }

  #sticky-js {
    position: fixed;
    bottom: 60px;
    right: 10%;
  }

  #sticky-js .sticky-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;

    max-width: 600px;
    text-decoration: none;
    border-radius: 10px;
    box-shadow: inset 0 0 2px hsla(0, 0%, 0%, 0.15);

    flex-flow: row nowrap;
  }

  #sticky-js .native-img {
    margin-right: 20px;

    line-height: 0;
    max-height: 40px;
  }

  #sticky-js .native-main {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    flex-grow: 1;
    flex-flow: row nowrap;
  }

  #sticky-js .native-details {
    display: flex;
    margin-right: 20px;

    flex-flow: column nowrap;
  }

  #sticky-js .native-tagline {
    margin-bottom: 3px;

    font-size: 9px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  #sticky-js .native-desc {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    max-width: 600px;
    letter-spacing: 1px;
  }

  #sticky-js .native-cta {
    padding: 10px 16px;

    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    transition: all 0.3s ease-in-out;
    transform: translateY(-1px);
    white-space: nowrap;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 3px;
  }

  #sticky-js .native-via {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 5px 10px;

    font-size: 8px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: #444;
    border-top: 0;
    border-top-left-radius: 3px;
    background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        hsla(0, 0%, 0%, 0.025) 5px,
        hsla(0, 0%, 0%, 0.025) 10px
      )
      hsla(203, 11%, 95%, 0.4);
  }

  @media only screen and (min-width: 320px) and (max-width: 759px) {
    #sticky-js,
    #sticky-js .native-main {
      flex-flow: column nowrap;
    }

    #sticky-js .native-img,
    #sticky-js .native-details {
      margin: 0;
    }

    #sticky-js .native-img {
      display: none;
    }

    #sticky-js .native-company {
      letter-spacing: 1px;
    }

    #sticky-js .native-details {
      font-size: 14px;
      text-align: left;
    }

    #sticky-js .native-cta {
      display: none;
    }
  }
`;

const template = `${"`"}
<a class="sticky-bar" style="background-color: ##backgroundColor##; color: ##textColor##" href="##link##" rel="sponsored noopener" target="_blank" title="##company## — ##tagline##">
  <div class="native-main">
    <img class="native-img" src="##logo##">
    <div class="native-details" style="color: ##textColor##">
      <span class="native-tagline">Sponsored by ##company##</span>
      <span class="native-desc">##description##</span>
    </div>
    <span class="native-cta" style="color: ##ctaTextColor##; background-color: ##ctaBackgroundColor##;">##callToAction##</span>
  </div>
</a>
<div class="native-hide" style="background-color: ##textColor##; color: ##backgroundColor##; border: solid 1px ##backgroundColor##;" onclick="_bsa.close('sticky-js')">✕</div>
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
            target: '.sticky-js',
            id: 'sticky-js',
            template: ${template}
          });
        }
      })();`;
    ref.current.appendChild(s);
  }, []);

  return <AdWrapper ref={ref} className="sticky-js"></AdWrapper>;
};
