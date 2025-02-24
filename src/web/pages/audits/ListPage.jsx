/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {RESET_FILTER, TASKS_FILTER_FILTER} from 'gmp/models/filter';
import React from 'react';
import AuditIcon from 'web/components/icon/AuditIcon';
import ManualIcon from 'web/components/icon/ManualIcon';
import NewIcon from 'web/components/icon/NewIcon';
import IconDivider from 'web/components/layout/IconDivider';
import PageTitle from 'web/components/layout/PageTitle';
import EntitiesPage from 'web/entities/Page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';
import AuditComponent from 'web/pages/audits/Component';
import Table from 'web/pages/audits/Table';
import {taskReloadInterval} from 'web/pages/tasks/ListPage';
import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/audits';
import PropTypes from 'web/utils/PropTypes';
import withCapabilities from 'web/utils/withCapabilities';


export const ToolBarIcons = withCapabilities(
  ({capabilities, onAuditCreateClick}) => (
    <IconDivider>
      <ManualIcon
        anchor="configuring-and-managing-audits"
        page="compliance-and-special-scans"
        title={_('Help: Audits')}
      />
      {capabilities.mayCreate('task') && (
        <NewIcon title={_('New Audit')} onClick={onAuditCreateClick} />
      )}
    </IconDivider>
  ),
);

ToolBarIcons.propTypes = {
  onAuditCreateClick: PropTypes.func.isRequired,
};

const Page = ({onInteraction, onChanged, onDownloaded, onError, ...props}) => (
  <AuditComponent
    onCloneError={onError}
    onCloned={onChanged}
    onCreated={onChanged}
    onDeleteError={onError}
    onDeleted={onChanged}
    onDownloadError={onError}
    onDownloaded={onDownloaded}
    onInteraction={onInteraction}
    onResumeError={onError}
    onResumed={onChanged}
    onSaved={onChanged}
    onStartError={onError}
    onStarted={onChanged}
    onStopError={onError}
    onStopped={onChanged}
  >
    {({
      clone,
      create,
      delete: deleteFunc,
      download,
      edit,
      start,
      stop,
      resume,
      reportDownload,
      gcrFormatDefined,
    }) => (
      <React.Fragment>
        <PageTitle title={_('Audits')} />
        <EntitiesPage
          {...props}
          filtersFilter={TASKS_FILTER_FILTER}
          gcrFormatDefined={gcrFormatDefined}
          sectionIcon={<AuditIcon size="large" />}
          table={Table}
          title={_('Audits')}
          toolBarIcons={ToolBarIcons}
          onAuditCloneClick={clone}
          onAuditCreateClick={create}
          onAuditDeleteClick={deleteFunc}
          onAuditDownloadClick={download}
          onAuditEditClick={edit}
          onAuditResumeClick={resume}
          onAuditStartClick={start}
          onAuditStopClick={stop}
          onError={onError}
          onInteraction={onInteraction}
          onReportDownloadClick={reportDownload}
        />
      </React.Fragment>
    )}
  </AuditComponent>
);

Page.propTypes = {
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

export default withEntitiesContainer('audit', {
  entitiesSelector,
  loadEntities,
  defaultFilter: RESET_FILTER,
  reloadInterval: taskReloadInterval,
})(Page);
