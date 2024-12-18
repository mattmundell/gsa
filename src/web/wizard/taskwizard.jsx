/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import React from 'react';
import styled from 'styled-components';
import SaveDialog from 'web/components/dialog/savedialog';
import TextField from 'web/components/form/textfield';
import NewIcon from 'web/components/icon/newicon';
import {default as WizIcon} from 'web/components/icon/wizardicon';
import Column from 'web/components/layout/column';
import Row from 'web/components/layout/row';
import PropTypes from 'web/utils/proptypes';

export const WizardContent = styled.div`
  margin: 0 20px;
`;

const IconContainer = styled.div`
  align-self: flex-start;
`;

export const WizardIcon = () => (
  <IconContainer>
    <WizIcon size="large" />
  </IconContainer>
);

const TaskWizard = ({
  hosts,
  title = _('Task Wizard'),
  onClose,
  onNewClick,
  onSave,
}) => (
  <SaveDialog
    buttonTitle={_('Start Scan')}
    defaultValues={{hosts}}
    title={title}
    onClose={onClose}
    onSave={onSave}
  >
    {({values: state, onValueChange}) => (
      <Row>
        <WizardIcon />
        <WizardContent>
          <Column>
            <p>
              <b>{_('Quick start: Immediately scan an IP address')}</b>
            </p>
            <Row>
              <span>{_('IP address or hostname:')}</span>
              <TextField
                grow="1"
                maxLength="2000"
                name="hosts"
                value={state.hosts}
                onChange={onValueChange}
              />
            </Row>
            <div>
              {_(
                'The default address is either your computer' +
                  ' or your network gateway.',
              )}
            </div>
            {_('As a short-cut the following steps will be done for you:')}
            <ol>
              <li>{_('Create a new Target')}</li>
              <li>{_('Create a new Task')}</li>
              <li>{_('Start this scan task right away')}</li>
            </ol>
            <p>
              {_(
                'As soon as the scan progress is beyond 1%, you can already ' +
                  'jump to the scan report by clicking on the progress bar in ' +
                  'the "Status" column and review the results collected so far.',
              )}
            </p>
            <p>
              {_(
                'The Target and Task will be created using the defaults' +
                  ' as configured in "My Settings".',
              )}
            </p>
            <Row>
              <span>{_('By clicking the New Task icon')}</span>
              <NewIcon title={_('New Task')} onClick={onNewClick} />
              <span>{_('you can create a new Task yourself.')}</span>
            </Row>
          </Column>
        </WizardContent>
      </Row>
    )}
  </SaveDialog>
);

TaskWizard.propTypes = {
  hosts: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onNewClick: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

export default TaskWizard;
