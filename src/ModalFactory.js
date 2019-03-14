import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
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

const modalTransitionStates = {
  entering: "entering",
  entered: "entered",
  exiting: "exiting"
};

const ModalFactory = ({ className }, ref) => {
  const [modals, setModals] = useState([]);
  const [modalStates, setModalStates] = useState({});
  const stateRef = useRef({ modals, modalStates });
  useEffect(() => {
    stateRef.current = { modals, modalStates }
  })

  const deleteModal = async hash => {
    const { modals, modalStates } = stateRef.current
    const modalToDeleteIndex = getArrayIndexOfItem(
      modals,
      modal => modal.hash === hash
    );
    const { timeout } = modals[modalToDeleteIndex];
    setModals(removeArrayItemByIndex(modals, modalToDeleteIndex));
    setModalStates(
      insertObjectItem(modalStates, { [hash]: modalTransitionStates.exiting })
    );
    await delay(timeout.exit);
    setModalStates(removeObjectItemByKey(modalStates, hash));
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
      setModalStates(
        insertObjectItem(modalStates, {
          [hash]: modalTransitionStates.entering
        })
      );
      await delay(resultOptions.timeout.enter);
      setModalStates(
        insertObjectItem(modalStates, { [hash]: modalTransitionStates.entered })
      );
    });
  };

  useImperativeHandle(ref, () => ({
    addModal,
    deleteModal
  }));

  const modalComponents = modals.map(
    ({ Component, props, hash, handleClose, timeout }) => (
      <Component
        {...props}
        key={hash}
        timeout={timeout}
        transitionState={modalStates[hash]}
        onClose={handleClose}
      />
    )
  );

  return (
    <div className={className}>
      {modalComponents}
    </div>
  );
};

export default forwardRef(ModalFactory);
