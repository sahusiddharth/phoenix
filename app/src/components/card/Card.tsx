import { forwardRef, Ref, useId, useState } from "react";

import { Heading, Icon, Icons } from "@phoenix/components";
import { useStyleProps, viewStyleProps } from "@phoenix/components/utils";

import { cardCSS } from "./styles";
import { CardProps } from "./types";

function Card(
  {
    title,
    titleExtra,
    titleSeparator = true,
    subTitle,
    children,
    collapsible = false,
    defaultOpen = true,
    extra,
    ...otherProps
  }: CardProps,
  ref: Ref<HTMLElement>
) {
  const { styleProps } = useStyleProps(otherProps, viewStyleProps);
  const [isCollapsed, setIsCollapsed] = useState(
    collapsible ? !defaultOpen : false
  );

  const headerId = useId();
  const collapseButtonId = useId();
  const bodyId = useId();

  const headingContents = (
    <div>
      <Heading level={3} weight="heavy" className="card__title">
        {title}
        {titleExtra}
      </Heading>
      {subTitle && (
        <Heading level={4} className="card__sub-title">
          {subTitle}
        </Heading>
      )}
    </div>
  );

  return (
    <section
      ref={ref}
      css={cardCSS(styleProps.style)}
      className="card"
      data-collapsible={collapsible}
      data-collapsed={isCollapsed}
      data-title-separator={titleSeparator}
      style={styleProps.style}
    >
      <header id={headerId}>
        {collapsible ? (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="card__collapsible-button button--reset"
            id={collapseButtonId}
            aria-controls={bodyId}
            aria-expanded={!isCollapsed}
          >
            <Icon
              svg={<Icons.ChevronDown />}
              className="card__collapse-toggle-icon"
              aria-hidden="true"
            />
            {headingContents}
          </button>
        ) : (
          headingContents
        )}
        {extra}
      </header>
      {
        <div
          className="card__body"
          id={bodyId}
          aria-labelledby={headerId}
          aria-hidden={isCollapsed}
        >
          {children}
        </div>
      }
    </section>
  );
}

const _Card = forwardRef(Card);
export { _Card as Card };
