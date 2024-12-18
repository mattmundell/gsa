/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import DialogContent from 'web/components/dialog/content';
import Dialog from 'web/components/dialog/dialog';
import DialogTwoButtonFooter, {
  DELETE_ACTION,
} from 'web/components/dialog/twobuttonfooter';
import useTranslation from 'web/hooks/useTranslation';
import PropTypes from 'web/utils/proptypes';

const DEFAULT_DIALOG_WIDTH = '400px';

const ConfirmationDialog = ({
  width = DEFAULT_DIALOG_WIDTH,
  content,
  title,
  rightButtonTitle,
  rightButtonAction,
  onClose,
  onResumeClick,
  loading,
}) => {
  const [_] = useTranslation();

  rightButtonTitle = rightButtonTitle || _('OK');

  return (
    <Dialog
      data-testid="confirmation-dialog"
      footer={
        <DialogTwoButtonFooter
          loading={loading}
          rightButtonAction={rightButtonAction}
          rightButtonTitle={rightButtonTitle}
          onLeftButtonClick={onClose}
          onRightButtonClick={onResumeClick}
        />
      }
      title={title}
      width={width}
      onClose={onClose}
    >
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  content: PropTypes.elementOrString,
  rightButtonTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  width: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onResumeClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  rightButtonAction: PropTypes.oneOf([undefined, DELETE_ACTION]),
};

export default ConfirmationDialog;
