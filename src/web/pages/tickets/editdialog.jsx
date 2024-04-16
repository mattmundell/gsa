/* Copyright (C) 2019-2022 Greenbone AG
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
import React, {useState} from 'react';

import {TICKET_STATUS, TICKET_STATUS_TRANSLATIONS} from 'gmp/models/ticket';

import SaveDialog from 'web/components/dialog/savedialog';

import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';
import TextArea from 'web/components/form/textarea';
import useFormValidation from 'web/components/form/useFormValidation';
import useFormValues from 'web/components/form/useFormValues';

import PropTypes from 'web/utils/proptypes';
import {renderSelectItems} from 'web/utils/render';

import useTranslation from 'web/hooks/useTranslation';

import {editTicketRules as validationRules} from './validationrules';

const STATUS = [TICKET_STATUS.open, TICKET_STATUS.fixed, TICKET_STATUS.closed];

const fieldsToValidate = ['openNote', 'closedNote', 'fixedNote'];

const EditTicketDialog = ({
  closedNote = '',
  fixedNote = '',
  openNote = '',
  ticketId,
  title,
  status,
  userId,
  users,
  onClose,
  onSave,
}) => {
  const [_] = useTranslation();
  const [error, setError] = useState();
  const [formValues, handleValueChange] = useFormValues({
    ticketId,
    closedNote,
    fixedNote,
    openNote,
    status,
    userId,
  });
  const {errors, validate} = useFormValidation(validationRules, formValues, {
    onValidationSuccess: onSave,
    onValidationError: setError,
    fieldsToValidate,
  });
  const STATUS_ITEMS = STATUS.map(ticketStatus => ({
    value: ticketStatus,
    label: `${TICKET_STATUS_TRANSLATIONS[ticketStatus]}`,
  }));

  title = title || _('Edit Ticket');

  return (
    <SaveDialog
      error={error}
      title={title}
      onClose={onClose}
      onErrorClose={() => setError()}
      onSave={validate}
      values={formValues}
    >
      {({values}) => (
        <>
          <FormGroup title={_('Status')}>
            <Select
              name="status"
              items={STATUS_ITEMS}
              value={values.status}
              onChange={handleValueChange}
            />
          </FormGroup>
          <FormGroup title={_('Assigned User')}>
            <Select
              name="userId"
              items={renderSelectItems(users)}
              value={values.userId}
              onChange={handleValueChange}
            />
          </FormGroup>
          <FormGroup title={_('Note for Open')}>
            <TextArea
              errorContent={errors.openNote}
              name="openNote"
              maxRows="5"
              value={values.openNote}
              onChange={handleValueChange}
            />
          </FormGroup>
          <FormGroup title={_('Note for Fixed')}>
            <TextArea
              errorContent={errors.fixedNote}
              name="fixedNote"
              maxRows="5"
              value={values.fixedNote}
              onChange={handleValueChange}
            />
          </FormGroup>
          <FormGroup title={_('Note for Closed')}>
            <TextArea
              errorContent={errors.closedNote}
              name="closedNote"
              maxRows="5"
              value={values.closedNote}
              onChange={handleValueChange}
            />
          </FormGroup>
        </>
      )}
    </SaveDialog>
  );
};

EditTicketDialog.propTypes = {
  closedNote: PropTypes.string,
  fixedNote: PropTypes.string,
  openNote: PropTypes.string,
  status: PropTypes.oneOf(STATUS),
  ticketId: PropTypes.id.isRequired,
  title: PropTypes.toString,
  userId: PropTypes.id.isRequired,
  users: PropTypes.arrayOf(PropTypes.model),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditTicketDialog;

// vim: set ts=2 sw=2 tw=80:
