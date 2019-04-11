import * as React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare module "react-modal-promise" {
  export type ModalTimeout = {
    enter: number;
    exit: number;
  };

  export type ModalTransitionState = "entering" | "entered" | "exiting";

  export type InjectedModalProps<Result> = {
    transitionState: ModalTransitionState;
    timeout: ModalTimeout;
    onClose: (result: Result) => void;
  };

  interface CreateModal {
    <T extends InjectedModalProps<Result>, Result = boolean>(
      Component: React.ComponentType<T>,
      options?: {
        timeout?: ModalTimeout;
      }
    ): (props?: Omit<T, "transitionState" | "onClose" | "timeout">) => Result;
  }

  type CloseModal = (hash: string) => void;

  export const closeModal: CloseModal;
  export const createModal: CreateModal;

  const PromiseModal: React.SFC<{}>;
  export default PromiseModal;
}
