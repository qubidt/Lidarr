import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TrackQuality from 'Album/TrackQuality';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import { icons, kinds } from 'Helpers/Props';
import InteractiveImportModal from 'InteractiveImport/InteractiveImportModal';
import FileDetailsModal from 'TrackFile/FileDetailsModal';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './UnmappedFilesTableRow.css';

class UnmappedFilesTableRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDetailsModalOpen: false,
      isInteractiveImportModalOpen: false,
      isConfirmDeleteModalOpen: false
    };
  }

  //
  // Listeners

  onDetailsPress = () => {
    this.setState({ isDetailsModalOpen: true });
  }

  onDetailsModalClose = () => {
    this.setState({ isDetailsModalOpen: false });
  }

  onInteractiveImportPress = () => {
    this.setState({ isInteractiveImportModalOpen: true });
  }

  onInteractiveImportModalClose = () => {
    this.setState({ isInteractiveImportModalOpen: false });
  }

  onDeleteFilePress = () => {
    this.setState({ isConfirmDeleteModalOpen: true });
  }

  onConfirmDelete = () => {
    this.setState({ isConfirmDeleteModalOpen: false });
    this.props.deleteUnmappedFile(this.props.id);
  }

  onConfirmDeleteModalClose = () => {
    this.setState({ isConfirmDeleteModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      id,
      path,
      size,
      dateAdded,
      quality,
      columns
    } = this.props;

    const folder = path.substring(0, Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')));

    const {
      isInteractiveImportModalOpen,
      isDetailsModalOpen,
      isConfirmDeleteModalOpen
    } = this.state;

    return (
      <>
        {
          columns.map((column) => {
            const {
              name,
              isVisible
            } = column;

            if (!isVisible) {
              return null;
            }

            if (name === 'path') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {path}
                </VirtualTableRowCell>
              );
            }

            if (name === 'size') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {formatBytes(size)}
                </VirtualTableRowCell>
              );
            }

            if (name === 'dateAdded') {
              return (
                <RelativeDateCellConnector
                  key={name}
                  className={styles[name]}
                  date={dateAdded}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'quality') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <TrackQuality
                    quality={quality}
                  />
                </VirtualTableRowCell>
              );
            }

            if (name === 'actions') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <IconButton
                    name={icons.INFO}
                    onPress={this.onDetailsPress}
                  />

                  <IconButton
                    name={icons.INTERACTIVE}
                    onPress={this.onInteractiveImportPress}
                  />

                  <IconButton
                    name={icons.DELETE}
                    onPress={this.onDeleteFilePress}
                  />

                </VirtualTableRowCell>
              );
            }

            return null;
          })
        }

        <InteractiveImportModal
          isOpen={isInteractiveImportModalOpen}
          folder={folder}
          showFilterExistingFiles={true}
          filterExistingFiles={false}
          showImportMode={false}
          showReplaceExistingFiles={false}
          replaceExistingFiles={false}
          onModalClose={this.onInteractiveImportModalClose}
        />

        <FileDetailsModal
          isOpen={isDetailsModalOpen}
          onModalClose={this.onDetailsModalClose}
          id={id}
        />

        <ConfirmModal
          isOpen={isConfirmDeleteModalOpen}
          kind={kinds.DANGER}
          title={translate('DeleteTrackFile')}
          message={translate('DeleteTrackFileMessageText', [path])}
          confirmLabel={translate('Delete')}
          onConfirm={this.onConfirmDelete}
          onCancel={this.onConfirmDeleteModalClose}
        />

      </>
    );
  }

}

UnmappedFilesTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  quality: PropTypes.object.isRequired,
  dateAdded: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteUnmappedFile: PropTypes.func.isRequired
};

export default UnmappedFilesTableRow;
