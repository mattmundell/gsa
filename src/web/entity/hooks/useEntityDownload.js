/* SPDX-FileCopyrightText: 2025 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {showSuccessNotification} from '@greenbone/opensight-ui-components-mantinev7';
import {isDefined} from 'gmp/utils/identity';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useGmp from 'web/hooks/useGmp';
import useShallowEqualSelector from 'web/hooks/useShallowEqualSelector';
import useTranslation from 'web/hooks/useTranslation';
import {loadUserSettingDefaults} from 'web/store/usersettings/defaults/actions';
import {getUserSettingsDefaults} from 'web/store/usersettings/defaults/selectors';
import {getUsername} from 'web/store/usersettings/selectors';
import {generateFilename} from 'web/utils/Render';

/**
 * Custom hook to handle the download of an entity.
 *
 * @param {string} name - The name of the entity to download.
 * @param {Object} options - Options for handling download events.
 * @param {Function} [options.onDownloadError] - Callback function to handle download errors.
 * @param {Function} [options.onDownloaded] - Callback function to handle successful downloads.
 * @param {Function} [options.onInteraction] - Callback function to handle interactions before download.
 * @returns {Function} - Function to handle the entity download.
 */
const useEntityDownload = (
  name,
  {onDownloadError, onDownloaded, onInteraction} = {},
) => {
  const [_] = useTranslation();
  const username = useSelector(getUsername);
  const dispatch = useDispatch();
  const gmp = useGmp();
  const userDefaultsSelector = useShallowEqualSelector(getUserSettingsDefaults);
  const cmd = gmp[name];

  useEffect(() => {
    const detailsExportFileName = userDefaultsSelector.getValueByName(
      'detailsexportfilename',
    );
    const loadSettings = () => {
      dispatch(loadUserSettingDefaults(gmp)());
    };
    if (
      !userDefaultsSelector.isLoading() &&
      !isDefined(detailsExportFileName) &&
      !isDefined(userDefaultsSelector.getError())
    ) {
      loadSettings();
    }
  }, [name, dispatch, gmp, userDefaultsSelector]);

  const handleEntityDownload = async entity => {
    const detailsExportFileName = userDefaultsSelector.getValueByName(
      'detailsexportfilename',
    );

    if (isDefined(onInteraction)) {
      onInteraction();
    }

    const filename = generateFilename({
      creationTime: entity.creationTime,
      fileNameFormat: detailsExportFileName,
      id: entity.id,
      modificationTime: entity.modificationTime,
      resourceName: entity.name,
      resourceType: name,
      username,
    });

    try {
      const response = await cmd.export(entity);

      if (isDefined(onDownloaded)) {
        showSuccessNotification(
          '',
          _('{{name}} downloaded successfully.', {name: entity.name}),
        );
        return onDownloaded({filename, data: response.data});
      }
    } catch (error) {
      if (isDefined(onDownloadError)) {
        return onDownloadError(error);
      }
    }
  };
  return handleEntityDownload;
};

export default useEntityDownload;
