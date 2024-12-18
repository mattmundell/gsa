/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {Puzzle as Icon} from 'lucide-react';
import IconWithStrokeWidth from 'web/components/icon/IconWithStrokeWidth';

import withSvgIcon from './withSvgIcon';

const SolutionTypeSvgIcon = withSvgIcon()(props => (
  <IconWithStrokeWidth
    IconComponent={Icon}
    {...props}
    data-testid="solution-type-icon"
  />
));

export default SolutionTypeSvgIcon;
