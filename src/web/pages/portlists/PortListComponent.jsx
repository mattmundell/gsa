/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {parseInt} from 'gmp/parser';
import {isDefined} from 'gmp/utils/identity';
import {shorten} from 'gmp/utils/string';
import React from 'react';
import {handleNotificationForAction} from 'web/components/notification/handleNotificationForAction';
import EntityComponent from 'web/entity/EntityComponent';
import PortListsDialog from 'web/pages/portlists/Dialog';
import ImportPortListDialog from 'web/pages/portlists/ImportDialog';
import PortRangeDialog from 'web/pages/portlists/PortRangeDialog';
import PropTypes from 'web/utils/PropTypes';
import withGmp from 'web/utils/withGmp';

class PortListComponent extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      importDialogVisible: false,
      portListDialogVisible: false,
      portRangeDialogVisible: false,
    };

    this.created_port_ranges = [];
    this.deleted_port_ranges = [];

    this.handleCloseImportDialog = this.handleCloseImportDialog.bind(this);
    this.handleClosePortListDialog = this.handleClosePortListDialog.bind(this);
    this.handleCloseNewPortRangeDialog =
      this.handleCloseNewPortRangeDialog.bind(this);
    this.openImportDialog = this.openImportDialog.bind(this);
    this.openNewPortRangeDialog = this.openNewPortRangeDialog.bind(this);
    this.openPortListDialog = this.openPortListDialog.bind(this);
    this.handleDeletePortRange = this.handleDeletePortRange.bind(this);
    this.handleImportPortList = this.handleImportPortList.bind(this);
    this.handleSavePortList = this.handleSavePortList.bind(this);
    this.handleSavePortRange = this.handleSavePortRange.bind(this);
    this.handleTmpAddPortRange = this.handleTmpAddPortRange.bind(this);
    this.handleTmpDeletePortRange = this.handleTmpDeletePortRange.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
  }

  openPortListDialog(entity) {
    const {gmp} = this.props;

    if (entity) {
      gmp.portlist.get(entity).then(response => {
        const port_list = response.data;
        this.created_port_ranges = [];
        this.deleted_port_ranges = [];
        this.setState({
          comment: port_list.comment,
          id: port_list.id,
          port_list,
          name: port_list.name,
          portListDialogVisible: true,
          port_ranges: port_list.port_ranges,
          title: _('Edit Port List {{name}}', {name: shorten(port_list.name)}),
        });
      });
    } else {
      this.created_port_ranges = [];
      this.deleted_port_ranges = [];
      this.setState({
        comment: undefined,
        id: undefined,
        name: undefined,
        port_list: undefined,
        portListDialogVisible: true,
        title: _('New Port List'),
      });
    }

    this.handleInteraction();
  }

  closePortListDialog() {
    this.setState({portListDialogVisible: false});
  }

  handleClosePortListDialog() {
    this.closePortListDialog();
    this.handleInteraction();
  }

  openImportDialog() {
    this.setState({importDialogVisible: true});
    this.handleInteraction();
  }

  closeImportDialog() {
    this.setState({importDialogVisible: false});
  }

  handleCloseImportDialog() {
    this.closeImportDialog();
    this.handleInteraction();
  }

  openNewPortRangeDialog(port_list) {
    this.setState({
      portRangeDialogVisible: true,
      id: port_list.id,
    });
    this.handleInteraction();
  }

  closeNewPortRangeDialog() {
    this.setState({portRangeDialogVisible: false});
  }

  handleCloseNewPortRangeDialog() {
    this.closeNewPortRangeDialog();
    this.handleInteraction();
  }

  handleDeletePortRange(range) {
    const {gmp} = this.props;

    return handleNotificationForAction(
      gmp.portlist.deletePortRange(range),
      this.handleInteraction,
      this.props.onDeleted,
      _('Port range deleted successfully.'),
    );
  }

  handleSavePortRange(data) {
    const {gmp} = this.props;

    return gmp.portlist
      .createPortRange(data)
      .then(response => response.data.id);
  }

  handleImportPortList(data) {
    const {gmp, onImported, onImportError} = this.props;

    this.handleInteraction();

    return gmp.portlist
      .import(data)
      .then(onImported, onImportError)
      .then(() => this.closeImportDialog());
  }

  handleSavePortList(save, data) {
    const created_port_ranges_copy = [...this.created_port_ranges];

    this.handleInteraction();

    let promises = created_port_ranges_copy.map(range => {
      const saveData = {
        ...range,
        port_range_start: parseInt(range.start),
        port_range_end: parseInt(range.end),
        port_type: range.protocol_type,
      };
      return this.handleSavePortRange(saveData).then(id => {
        range.isTmp = false;
        range.id = id;
        this.created_port_ranges = this.created_port_ranges.filter(
          prange => prange !== range,
        );
      });
    });
    const deleted_port_ranges_copy = [...this.deleted_port_ranges];
    promises = [
      ...promises,
      ...deleted_port_ranges_copy.map(range =>
        this.handleDeletePortRange(range).then(
          (this.deleted_port_ranges = this.deleted_port_ranges.filter(
            prange => prange !== range,
          )),
        ),
      ),
    ];
    return Promise.all(promises)
      .then(() => save(data))
      .then(() => this.closePortListDialog())
      .catch(error => {
        if (data?.id && isDefined(this.props.onSaveError)) {
          return this.props.onSaveError(error);
        } else if (!data?.id && isDefined(this.props.onCreateError)) {
          return this.props.onCreateError(error);
        }
        return Promise.reject(error);
      });
  }

  handleTmpAddPortRange(values) {
    const {port_ranges} = this.state;
    let {port_range_end, port_range_start, port_type} = values;

    port_range_end = parseInt(port_range_end);
    port_range_start = parseInt(port_range_start);

    this.handleInteraction();

    // reject port ranges with missing values
    if (!port_range_start || !port_range_end) {
      return Promise.reject(
        new Error(
          _('The port range needs numerical values for start and end!'),
        ),
      );
    }

    // reject port ranges with start value lower than end value
    if (port_range_start > port_range_end) {
      return Promise.reject(
        new Error(_('The end of the port range can not be below its start!')),
      );
    }

    // check if new port range overlaps with existing and temporarily existing
    // ones, only relevant if protocol_type is the same
    for (const range of port_ranges) {
      const start = parseInt(range.start);
      const end = parseInt(range.end);
      if (
        range.protocol_type === port_type &&
        (port_range_start === start ||
          port_range_start === end ||
          (port_range_start > start && port_range_start < end) ||
          port_range_end === start ||
          port_range_end === end ||
          (port_range_end > start && port_range_end < end) ||
          (port_range_start < start && port_range_end > end))
      ) {
        return Promise.reject(
          new Error(_('New port range overlaps with an existing one!')),
        );
      }
    }

    const newRange = {
      end: values.port_range_end,
      entityType: 'portrange',
      id: values.id,
      protocol_type: values.port_type,
      start: values.port_range_start,
      isTmp: true,
    };

    this.created_port_ranges.push(newRange);
    this.setState({
      port_ranges: [...port_ranges, newRange],
    });
    this.closeNewPortRangeDialog();
  }

  handleTmpDeletePortRange(port_range) {
    const {port_ranges} = this.state;
    let new_port_ranges = port_ranges;

    if (port_range.isTmp) {
      this.created_port_ranges = this.created_port_ranges.filter(
        range => range !== port_range,
      );
    } else {
      this.deleted_port_ranges.push(port_range);
    }

    new_port_ranges = port_ranges.filter(range => range !== port_range);
    this.setState({port_ranges: new_port_ranges});

    this.handleInteraction();
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  render() {
    const {
      children,
      onCloned,
      onCloneError,
      onCreated,
      onCreateError,
      onDeleted,
      onDeleteError,
      onDownloaded,
      onDownloadError,
      onInteraction,
      onSaved,
      onSaveError,
    } = this.props;

    const {
      comment,
      id,
      importDialogVisible,
      name,
      port_list,
      portListDialogVisible,
      portRangeDialogVisible,
      title,
      port_ranges,
    } = this.state;

    return (
      <EntityComponent
        name="portlist"
        onCloneError={onCloneError}
        onCloned={onCloned}
        onCreateError={onCreateError}
        onCreated={onCreated}
        onDeleteError={onDeleteError}
        onDeleted={onDeleted}
        onDownloadError={onDownloadError}
        onDownloaded={onDownloaded}
        onInteraction={onInteraction}
        onSaveError={onSaveError}
        onSaved={onSaved}
      >
        {({save, ...other}) => (
          <React.Fragment>
            {children({
              ...other,
              create: this.openPortListDialog,
              edit: this.openPortListDialog,
              import: this.openImportDialog,
            })}
            {portListDialogVisible && (
              <PortListsDialog
                comment={comment}
                id={id}
                name={name}
                port_list={port_list}
                port_ranges={port_ranges}
                title={title}
                onClose={this.handleClosePortListDialog}
                onNewPortRangeClick={this.openNewPortRangeDialog}
                onSave={(...args) => this.handleSavePortList(save, ...args)}
                onTmpDeletePortRange={this.handleTmpDeletePortRange}
              />
            )}
            {importDialogVisible && (
              <ImportPortListDialog
                onClose={this.handleCloseImportDialog}
                onSave={this.handleImportPortList}
              />
            )}
            {portRangeDialogVisible && (
              <PortRangeDialog
                id={id}
                onClose={this.handleCloseNewPortRangeDialog}
                onSave={this.handleTmpAddPortRange}
              />
            )}
          </React.Fragment>
        )}
      </EntityComponent>
    );
  }
}

PortListComponent.propTypes = {
  children: PropTypes.func.isRequired,
  gmp: PropTypes.gmp.isRequired,
  onCloneError: PropTypes.func,
  onCloned: PropTypes.func,
  onCreateError: PropTypes.func,
  onCreated: PropTypes.func,
  onDeleteError: PropTypes.func,
  onDeleted: PropTypes.func,
  onDownloadError: PropTypes.func,
  onDownloaded: PropTypes.func,
  onImportError: PropTypes.func,
  onImported: PropTypes.func,
  onInteraction: PropTypes.func.isRequired,
  onSaveError: PropTypes.func,
  onSaved: PropTypes.func,
};

export default withGmp(PortListComponent);
