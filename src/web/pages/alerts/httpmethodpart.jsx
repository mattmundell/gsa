/* Copyright (C) 2016-2022 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';

import PropTypes from 'web/utils/proptypes';

import withPrefix from 'web/utils/withPrefix';

import FormGroup from 'web/components/form/formgroup';
import TextField from 'web/components/form/textfield';

import useTranslation from 'web/hooks/useTranslation';

const HttpMethodPart = ({prefix, URL, onChange}) => {
  const [_] = useTranslation();
  return (
    <FormGroup title={_('HTTP Get URL')}>
      <TextField
        grow="1"
        name={prefix + 'URL'}
        value={URL}
        onChange={onChange}
      />
    </FormGroup>
  );
};

HttpMethodPart.propTypes = {
  URL: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  onChange: PropTypes.func,
};

export default withPrefix(HttpMethodPart);

// vim: set ts=2 sw=2 tw=80:
