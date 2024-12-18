/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import _ from 'gmp/locale';
import Filter from 'gmp/models/filter';
import {pluralizeType, normalizeType} from 'gmp/utils/entitytype';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import ListIcon from 'web/components/icon/listicon';
import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';
import DetailsLink from 'web/components/link/detailslink';
import Loading from 'web/components/loading/loading';
import {MAX_RESOURCES} from 'web/pages/tags/component';
import {
  createLoadEntities,
  createEntitiesLoadingActions,
} from 'web/store/entities/utils/actions';
import {createSelector} from 'web/store/entities/utils/selectors';
import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

const Spacer = styled.div`
  height: 12px;
`;

const Notification = ({id, resourceType}) => {
  const filter = Filter.fromString('tag_id=' + id);
  return (
    <Divider>
      <span>
        {_('Listing only the first {{num}} items. ', {num: MAX_RESOURCES})}
        {_('To see all assigned resources click here:')}
      </span>
      <ListIcon
        filter={filter}
        page={pluralizeType(normalizeType(resourceType))}
        title={_('List Items')}
      />
    </Divider>
  );
};

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
};

class ResourceList extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isLoading: true,
      res: [],
    };
  }

  componentDidMount() {
    const {loadResources} = this.props;

    if (isDefined(loadResources)) {
      loadResources();
    }
  }

  render() {
    const {entity, resources = [], isLoading} = this.props;
    const {id, resourceCount, resourceType} = entity;
    const showNotification = resourceCount > MAX_RESOURCES;

    return (
      <React.Fragment>
        {isLoading ? (
          <Loading />
        ) : (
          <Layout flex="column">
            {showNotification && (
              <Notification id={id} resourceType={resourceType} />
            )}
            <Spacer />
            <ul>
              {resources.map(resource => (
                <li key={resource.id}>
                  <DetailsLink id={resource.id} type={resourceType}>
                    {resource.name}
                  </DetailsLink>
                </li>
              ))}
            </ul>
          </Layout>
        )}
      </React.Fragment>
    );
  }
}

ResourceList.propTypes = {
  entity: PropTypes.model.isRequired,
  isLoading: PropTypes.bool,
  loadResources: PropTypes.func,
  resources: PropTypes.array,
};

const resourcesFilter = id =>
  Filter.fromString('tag_id="' + id + '" rows=' + MAX_RESOURCES);

const mapStateToProps = (rootState, {entity}) => {
  if (!isDefined(entity)) {
    return {
      isLoading: true,
    };
  }
  const {resourceType: entityType} = entity;
  const selector = createSelector(entityType);
  const select = selector(rootState);
  const filter = resourcesFilter(entity.id);
  return {
    resources: select.getEntities(filter),
    isLoading: select.isLoadingEntities(filter),
  };
};

const mapDispatchToProps = (dispatch, {entity, gmp}) => {
  if (!isDefined(entity)) {
    return undefined;
  }

  const {resourceType: entityType} = entity;
  const selector = createSelector(entityType);
  const actions = createEntitiesLoadingActions(entityType);
  const loadEntities = createLoadEntities({
    selector,
    actions,
    entityType,
  });
  return {
    loadResources: () =>
      dispatch(loadEntities(gmp)(resourcesFilter(entity.id))),
  };
};

export default compose(
  withGmp,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ResourceList);

// vim: set ts=2 sw=2 tw=80:
