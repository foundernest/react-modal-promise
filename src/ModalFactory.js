import React, {
  useState,
  useImperativeHandle,
  forwardRef
} from "react";
import { randHex } from "./utils/randHex";
import {
  insertArrayItem,
  insertObjectItem,
  getArrayIndexOfItem,
  removeArrayItemByIndex,
  removeObjectItemByKey
} from "./utils/immutable";
import { delay } from "./utils/delay";

const defaultOptions = {
  timeout: {
    enter: 500,
    exit: 500
  }
};

const ModalFactory = ({ className }, ref) => {
  const [modals, setModals] = useState([]);
  const [openModals, setOpenModals] = useState({});

  const deleteModal = async hash => {
    const modalToDeleteIndex = getArrayIndexOfItem(
      modals,
      modal => modal.hash === hash
    );
    const modalToDelete = modals[modalToDeleteIndex];
    setModals(removeArrayItemByIndex(modals, modalToDeleteIndex));
    await delay(modalToDelete.timeout.exit);
    setOpenModals(removeObjectItemByKey(openModals, hash));
  };

  const addModal = (Component, options = {}) => props => {
    return new Promise(async promiseResolve => {
      const hash = randHex();
      const resultOptions = { ...defaultOptions, ...options };
      const handleClose = value => {
        deleteModal(hash);
        promiseResolve(value);
      };
      const newModal = {
        Component,
        props,
        hash,
        handleClose,
        ...resultOptions
      };
      setModals(insertArrayItem(modals, newModal));
      await delay(resultOptions.timeout.enter);
      setOpenModals(insertObjectItem(openModals, hash));
    });
  };

  useImperativeHandle(ref, () => ({
    addModal
  }));

  const modalComponents = modals.map(
    ({ Component, props, hash, resolve, timeout }) => (
      <Component
        {...props}
        key={hash}
        timeout={timeout}
        open={Boolean(openModals[hash])}
        onClose={resolve}
      />
    )
  );

  return <div className={className}>{modalComponents}</div>;
};

export default forwardRef(ModalFactory);
