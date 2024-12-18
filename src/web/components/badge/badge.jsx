/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {isDefined, hasValue} from 'gmp/utils/identity';
import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  margin-right: ${props => props.$margin}px;
`;

BadgeContainer.displayName = 'BadgeContainer';

const BadgeIcon = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: absolute;
  font-size: 10px;
  font-weight: bold;
  border-radius: 10px;
  min-width: 10px;
  padding: 3px 5px;
  z-index: ${Theme.Layers.higher};
  background-color: ${({$backgroundColor = Theme.green}) => $backgroundColor};
  color: ${({$color = Theme.white}) => $color};
  ${({$position = 'bottom'}) => $position}: ${({radius = 8}) => -radius}px;
  right: ${({$margin = 8}) => -$margin}px;
`;

BadgeIcon.displayName = 'BadgeIcon';

const Badge = props => {
  const icon = useRef();

  useEffect(() => {
    calcMargin();
  }, [props.content]);

  const [margin, setMargin] = useState(undefined);

  const calcMargin = () => {
    if (hasValue(icon.current)) {
      const {width} = icon.current.getBoundingClientRect();
      setMargin(width / 2);
    }
  };

  const {
    backgroundColor,
    children,
    color,
    content,
    dynamic = true,
    position,
  } = props;

  return (
    <BadgeContainer $margin={dynamic ? margin : undefined}>
      {children}

      {isDefined(content) && (
        <BadgeIcon
          ref={icon}
          $backgroundColor={backgroundColor}
          $color={color}
          $margin={dynamic ? margin : undefined}
          $position={position}
          data-testid="badge-icon"
        >
          {content}
        </BadgeIcon>
      )}
    </BadgeContainer>
  );
};

Badge.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dynamic: PropTypes.bool,
  position: PropTypes.oneOf(['bottom', 'top']),
};

export default Badge;
